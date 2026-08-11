package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
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

type ContactHandler struct {
	contactStore   *database.ContactStore
	emailService   *services.EmailService
	defaultPerPage int
}

func NewContactHandler(
	contactStore *database.ContactStore,
	emailService *services.EmailService,
	defaultPerPage int,
) (*ContactHandler, error) {
	return &ContactHandler{
		contactStore:   contactStore,
		emailService:   emailService,
		defaultPerPage: defaultPerPage,
	}, nil
}

func (h *ContactHandler) Submit(w http.ResponseWriter, r *http.Request) {
	var req domain.SubmitContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteError(
			w, http.StatusBadRequest, "invalid JSON body", "BAD_REQUEST",
		)
		return
	}

	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)
	req.Email = strings.TrimSpace(req.Email)
	req.Phone = strings.TrimSpace(req.Phone)
	req.Company = strings.TrimSpace(req.Company)
	req.Message = strings.TrimSpace(req.Message)

	if req.FirstName == "" || req.LastName == "" || req.Email == "" ||
		req.Phone == "" || req.Message == "" {
		util.WriteError(
			w, http.StatusBadRequest,
			"first_name, last_name, email,phone, and message are required",
			"BAD_REQUEST",
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

	if len(req.Company) > 255 {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"company must not exceed 255 characters",
			"BAD_REQUEST",
		)
		return
	}

	if len(req.Message) > 2000 {
		util.WriteError(
			w,
			http.StatusBadRequest,
			"message must not exceed 2000 characters",
			"BAD_REQUEST",
		)
		return
	}

	if !util.ValidEmail(req.Email) {
		util.WriteError(
			w, http.StatusBadRequest, "invalid email format", "BAD_REQUEST",
		)
		return
	}

	if !util.ValidPhone(req.Phone) {
		util.WriteError(
			w, http.StatusBadRequest, "invalid phone number", "BAD_REQUEST",
		)
		return
	}

	msg := domain.ContactMessage{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Phone:     req.Phone,
		Company:   req.Company,
		Message:   req.Message,
	}

	if err := h.contactStore.Create(r.Context(), &msg); err != nil {
		util.WriteError(
			w,
			http.StatusInternalServerError,
			"failed to save message",
			"SERVER_ERROR",
		)
		return
	}

	h.emailService.SendContactNotification(&msg)

	util.WriteJSON(w, http.StatusCreated, domain.ContactResponse{
		ID:        msg.ID,
		FirstName: msg.FirstName,
		LastName:  msg.LastName,
		Email:     msg.Email,
		Phone:     msg.Phone,
		Company:   msg.Company,
		Message:   msg.Message,
		CreatedAt: time.Now(),
	})
}

// List returns one page of contact messages.
func (h *ContactHandler) List(w http.ResponseWriter, r *http.Request) {
	page, perPage, ok := parsePageParams(w, r, h.defaultPerPage)
	if !ok {
		return
	}

	items, total, err := h.contactStore.List(r.Context(), page, perPage)
	if err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to list contact messages", "SERVER_ERROR",
		)
		return
	}

	resp := domain.PaginatedResponse[domain.ContactListItemResponse]{
		Items:   make([]domain.ContactListItemResponse, 0, len(items)),
		Total:   total,
		Page:    page,
		PerPage: perPage,
	}
	for _, item := range items {
		resp.Items = append(resp.Items, domain.ContactListItemResponse{
			ContactResponse: domain.ContactResponse(item),
			TimeAgo:         item.CreatedAt,
		})
	}

	util.WriteJSON(w, http.StatusOK, resp)
}

// Delete removes a contact message.
func (h *ContactHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil || id < 1 {
		util.WriteError(
			w, http.StatusBadRequest, "invalid contact message id",
			"BAD_REQUEST",
		)
		return
	}

	if err := h.contactStore.Delete(r.Context(), id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			util.WriteError(
				w, http.StatusNotFound, "contact message not found",
				"NOT_FOUND",
			)
			return
		}
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to delete contact message", "SERVER_ERROR",
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
