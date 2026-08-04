package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

type JobHandler struct {
	jobStore     *database.JobStore
	emailService *services.EmailService
	b2Service    *services.B2Service
}

func NewJobHandler(
	jobStore *database.JobStore,
	emailService *services.EmailService,
	b2Service *services.B2Service,
) (*JobHandler, error) {
	return &JobHandler{
		jobStore:     jobStore,
		emailService: emailService,
		b2Service:    b2Service,
	}, nil
}

func (h *JobHandler) Submit(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		util.WriteError(
			w, http.StatusBadRequest, "invalid form data", "BAD_REQUEST",
		)
		return
	}

	hoursStr := r.FormValue("hours_available")
	hoursAvailable, convErr := strconv.Atoi(hoursStr)
	if convErr != nil {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"hours_available must be a valid number",
			"BAD_REQUEST",
		)
		return
	}

	req := domain.SubmitJobApplicationRequest{
		FirstName:      r.FormValue("first_name"),
		LastName:       r.FormValue("last_name"),
		DateOfBirth:    r.FormValue("date_of_birth"),
		Address:        r.FormValue("address"),
		Email:          r.FormValue("email"),
		Phone:          r.FormValue("phone"),
		HoursAvailable: hoursAvailable,
		ClothingSize:   domain.ClothingSize(r.FormValue("clothing_size")),
		EmploymentType: domain.EmploymentType(r.FormValue("employment_type")),
	}

	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)
	req.DateOfBirth = strings.TrimSpace(req.DateOfBirth)
	req.Address = strings.TrimSpace(req.Address)
	req.Email = strings.TrimSpace(req.Email)
	req.Phone = strings.TrimSpace(req.Phone)

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
	}

	if err := h.jobStore.Create(r.Context(), &app); err != nil {
		util.WriteError(
			w,
			http.StatusInternalServerError,
			"failed to save application", "SERVER_ERROR",
		)
		return
	}

	var (
		fileKey     string
		fileName    string
		fileData    []byte
		contentType string
	)

	file, header, fileErr := r.FormFile("cv")
	switch {
	case fileErr == nil:
		defer func() { _ = file.Close() }()

		data, readErr := io.ReadAll(file)
		if readErr != nil {
			util.WriteError(
				w, http.StatusBadRequest,
				"failed to read CV file",
				"BAD_REQUEST",
			)
			return
		}

		if len(data) > 0 {
			fileKey = fmt.Sprintf("cv/%d_%s", app.ID, header.Filename)
			fileName = header.Filename
			fileData = data
			contentType = header.Header.Get("Content-Type")
			if contentType == "" {
				contentType = "application/octet-stream"
			}

			if err := h.jobStore.UpdateCVKey(
				r.Context(), app.ID, fileKey,
			); err != nil {
				util.WriteError(
					w, http.StatusInternalServerError,
					"failed to save cv",
					"SERVER_ERROR",
				)
				return
			}

			h.b2Service.UploadFileAsync(fileKey, fileData, contentType)
		}

	case errors.Is(fileErr, http.ErrMissingFile):
		// No CV provided. This is allowed — proceed without one.

	default:
		util.WriteError(
			w, http.StatusBadRequest,
			"failed to read CV file",
			"BAD_REQUEST",
		)
		return
	}

	h.emailService.SendJobApplicationNotification(&app, fileName, fileData, contentType)

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

func (h *JobHandler) UploadCV(w http.ResponseWriter, r *http.Request) {
	var size int64
	if err := json.NewDecoder(r.Body).Decode(&size); err != nil {
		util.WriteError(
			w, http.StatusBadRequest,
			"invalid JSON body",
			"BAD_REQUEST",
		)
		return
	}

	if size <= 0 {
		util.WriteError(
			w, http.StatusBadRequest,
			"invalid CV file size",
			"BAD_REQUEST",
		)
		return
	}

	// Max size is 10 MB and max filename length is 255 characters
	if size > 10<<20 {
		util.WriteError(
			w, http.StatusBadRequest,
			"CV file size must not exceed 10 MB",
			"BAD_REQUEST",
		)
		return
	}

	fileName := uuid.New().String() + ".pdf"
	presignedURL, err := h.b2Service.PresignPutURL(
		r.Context(), fileName, 15*time.Minute,
	)
	if err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to generate presigned URL",
			"SERVER_ERROR",
		)
		return
	}

	util.WriteJSON(w, http.StatusOK, domain.CVUploadResponse{
		UploadURL: presignedURL,
		Key:       fileName,
	})
}

func (h *JobHandler) DeleteCV(w http.ResponseWriter, r *http.Request) {
	var cvKey string
	if err := json.NewDecoder(r.Body).Decode(&cvKey); err != nil {
		util.WriteError(
			w, http.StatusBadRequest,
			"invalid JSON body",
			"BAD_REQUEST",
		)
		return
	}

	if cvKey == "" {
		util.WriteError(
			w, http.StatusBadRequest,
			"cv_key is required",
			"BAD_REQUEST",
		)
		return
	}

	if err := h.b2Service.DeleteFile(r.Context(), cvKey); err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			fmt.Sprintf("failed to delete CV: %v", err),
			"SERVER_ERROR",
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
