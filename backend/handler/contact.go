package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

type ContactHandler struct {
	contactStore *database.ContactStore
	emailService *services.EmailService
}

func NewContactHandler(
	contactStore *database.ContactStore,
	emailService *services.EmailService,
) (*ContactHandler, error) {
	return &ContactHandler{
		contactStore: contactStore,
		emailService: emailService,
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
