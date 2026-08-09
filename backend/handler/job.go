package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

type JobHandler struct {
	jobStore       *database.JobStore
	emailService   *services.EmailService
	b2Service      *services.B2Service
	defaultPerPage int
}

func NewJobHandler(
	jobStore *database.JobStore,
	emailService *services.EmailService,
	b2Service *services.B2Service,
	defaultPerPage int,
) (*JobHandler, error) {
	return &JobHandler{
		jobStore:       jobStore,
		emailService:   emailService,
		b2Service:      b2Service,
		defaultPerPage: defaultPerPage,
	}, nil
}

func (h *JobHandler) Submit(w http.ResponseWriter, r *http.Request) {
	var req domain.SubmitJobApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteError(
			w, http.StatusBadRequest, "invalid JSON body", "BAD_REQUEST",
		)
		return
	}

	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)
	req.DateOfBirth = strings.TrimSpace(req.DateOfBirth)
	req.Address = strings.TrimSpace(req.Address)
	req.Email = strings.TrimSpace(req.Email)
	req.Phone = strings.TrimSpace(req.Phone)
	req.CVKey = strings.TrimSpace(req.CVKey)

	if req.FirstName == "" || req.LastName == "" || req.DateOfBirth == "" ||
		req.Address == "" || req.Email == "" ||
		req.Phone == "" || req.ClothingSize == "" {
		util.WriteError(
			w, http.StatusBadRequest, "all fields are required", "BAD_REQUEST",
		)
		return
	}

	if len(req.FirstName) > 100 || len(req.LastName) > 100 {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"name fields must not exceed 100 characters",
			"BAD_REQUEST",
		)
		return
	}

	if len(req.Address) > 255 {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"address must not exceed 255 characters",
			"BAD_REQUEST",
		)
		return
	}

	if req.EmploymentType != domain.EmploymentSecurity && req.EmploymentType != domain.EmploymentService {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"employment_type must be 'security' or 'service'",
			"BAD_REQUEST",
		)
		return
	}

	if req.ClothingSize != domain.ClothingXS && req.ClothingSize != domain.ClothingS &&
		req.ClothingSize != domain.ClothingM && req.ClothingSize != domain.ClothingL &&
		req.ClothingSize != domain.ClothingXL && req.ClothingSize != domain.Clothing2XL &&
		req.ClothingSize != domain.Clothing3XL {
		util.WriteError(w, http.StatusBadRequest, "clothing_size must be one of: XS, S, M, L, XL, 2XL, 3XL", "BAD_REQUEST")
		return
	}

	if req.HoursAvailable < 1 || req.HoursAvailable > 168 {
		util.WriteError(
			w, http.StatusBadRequest,
			"hours_available must be between 1 and 168",
			"BAD_REQUEST",
		)
		return
	}

	dob, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"invalid date_of_birth format, expected YYYY-MM-DD",
			"BAD_REQUEST",
		)
		return
	}
	if !dob.Before(time.Now()) {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"date_of_birth must be in the past",
			"BAD_REQUEST",
		)
		return
	}

	if !util.ValidEmail(req.Email) {
		util.WriteError(w, http.StatusBadRequest, "invalid email format", "BAD_REQUEST")
		return
	}

	if !util.ValidPhone(req.Phone) {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"invalid phone number",
			"BAD_REQUEST",
		)
		return
	}

	app := domain.JobApplication{
		FirstName:      req.FirstName,
		LastName:       req.LastName,
		DateOfBirth:    req.DateOfBirth,
		Address:        req.Address,
		Email:          req.Email,
		Phone:          req.Phone,
		HoursAvailable: req.HoursAvailable,
		ClothingSize:   req.ClothingSize,
		EmploymentType: req.EmploymentType,
		CVKey:          req.CVKey,
	}

	if err := h.jobStore.Create(r.Context(), &app); err != nil {
		util.WriteError(
			w,
			http.StatusInternalServerError,
			"failed to save application", "SERVER_ERROR",
		)
		return
	}

	// The CV, if any, was already uploaded straight to B2 via a presigned
	// URL obtained from UploadCV. We fetch it back in a goroutine so it can
	// be attached to the notification email; a failure here shouldn't fail
	// the whole submission since the application is already saved.
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		var (
			fileName    string
			fileData    []byte
			contentType string
		)

		if app.CVKey != "" {
			data, ct, err := h.b2Service.GetObject(ctx, app.CVKey)
			if err != nil {
				log.Printf("failed to fetch cv %q from b2: %v", app.CVKey, err)
			} else {
				fileName = app.CVKey
				fileData = data
				contentType = ct
			}
		}

		if err := h.emailService.SendJobApplicationNotification(
			&app, fileName, fileData, contentType,
		); err != nil {
			log.Printf("failed to send job application email: %v", err)
		}
	}()

	util.WriteJSON(w, http.StatusCreated, domain.JobApplicationResponse{
		ID:             app.ID,
		FirstName:      app.FirstName,
		LastName:       app.LastName,
		DateOfBirth:    app.DateOfBirth,
		Address:        app.Address,
		Email:          app.Email,
		Phone:          app.Phone,
		HoursAvailable: app.HoursAvailable,
		ClothingSize:   app.ClothingSize,
		EmploymentType: app.EmploymentType,
		CreatedAt:      time.Now(),
	})
}

// List returns one page of job applications with presigned URLs for the CVs.
func (h *JobHandler) List(w http.ResponseWriter, r *http.Request) {
	page, perPage, ok := parsePageParams(w, r, h.defaultPerPage)
	if !ok {
		return
	}

	items, total, err := h.jobStore.List(r.Context(), page, perPage)
	if err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to list job applications", "SERVER_ERROR",
		)
		return
	}

	resp := domain.PaginatedResponse[domain.JobListItemResponse]{
		Items:   make([]domain.JobListItemResponse, 0, len(items)),
		Total:   total,
		Page:    page,
		PerPage: perPage,
	}
	for _, item := range items {
		jobItem := domain.JobListItemResponse{
			JobApplicationResponse: domain.JobApplicationResponse{
				ID:             item.ID,
				FirstName:      item.FirstName,
				LastName:       item.LastName,
				DateOfBirth:    item.DateOfBirth,
				Address:        item.Address,
				Email:          item.Email,
				Phone:          item.Phone,
				HoursAvailable: item.HoursAvailable,
				ClothingSize:   item.ClothingSize,
				EmploymentType: item.EmploymentType,
				CreatedAt:      item.CreatedAt,
			},
		}
		if item.CVKey != "" {
			url, err := h.b2Service.PresignGetURL(
				r.Context(), item.CVKey, presignExpiry,
			)
			if err != nil {
				util.WriteError(
					w, http.StatusInternalServerError,
					"failed to generate CV URL", "SERVER_ERROR",
				)
				return
			}
			jobItem.CVURL = url
		}
		resp.Items = append(resp.Items, jobItem)
	}

	util.WriteJSON(w, http.StatusOK, resp)
}

// Delete removes a job application, triggering non-blocking cleanup of its
// CV in B2.
func (h *JobHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil || id < 1 {
		util.WriteError(
			w, http.StatusBadRequest, "invalid job application id",
			"BAD_REQUEST",
		)
		return
	}

	cvKey, err := h.jobStore.Delete(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			util.WriteError(
				w, http.StatusNotFound, "job application not found",
				"NOT_FOUND",
			)
			return
		}
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to delete job application", "SERVER_ERROR",
		)
		return
	}

	if cvKey != "" {
		h.b2Service.DeleteFileAsync(cvKey)
	}

	w.WriteHeader(http.StatusNoContent)
}
