package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/util"
)

type JobHandler struct {
	jobStore    *database.JobStore
	emailSender *util.AsyncSender
}

func NewJobHandler(jobStore *database.JobStore, emailSender *util.AsyncSender) *JobHandler {
	return &JobHandler{jobStore: jobStore, emailSender: emailSender}
}

func (h *JobHandler) Submit(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		util.WriteError(w, http.StatusBadRequest, "invalid form data", "BAD_REQUEST")
		return
	}

	hoursStr := r.FormValue("hours_available")
	hoursAvailable, _ := strconv.Atoi(hoursStr)

	req := domain.SubmitJobApplicationRequest{
		FirstName:      r.FormValue("first_name"),
		LastName:       r.FormValue("last_name"),
		DateOfBirth:    r.FormValue("date_of_birth"),
		BSN:            r.FormValue("bsn"),
		Address:        r.FormValue("address"),
		Email:          r.FormValue("email"),
		Phone:          r.FormValue("phone"),
		BankAccount:    r.FormValue("bank_account"),
		HoursAvailable: hoursAvailable,
		ClothingSize:   domain.ClothingSize(r.FormValue("clothing_size")),
		EmploymentType: domain.EmploymentType(r.FormValue("employment_type")),
	}

	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)
	req.Email = strings.TrimSpace(req.Email)
	req.Phone = strings.TrimSpace(req.Phone)

	if req.FirstName == "" || req.LastName == "" || req.DateOfBirth == "" ||
		req.BSN == "" || req.Address == "" || req.Email == "" ||
		req.Phone == "" || req.BankAccount == "" || req.ClothingSize == "" ||
		req.HoursAvailable <= 0 {
		util.WriteError(w, http.StatusBadRequest, "all fields are required", "BAD_REQUEST")
		return
	}

	if !strings.Contains(req.Email, "@") {
		util.WriteError(w, http.StatusBadRequest, "invalid email format", "BAD_REQUEST")
		return
	}

	if req.EmploymentType != domain.EmploymentSecurity && req.EmploymentType != domain.EmploymentService {
		util.WriteError(w, http.StatusBadRequest, "employment_type must be 'security' or 'service'", "BAD_REQUEST")
		return
	}

	if req.ClothingSize != domain.ClothingXS && req.ClothingSize != domain.ClothingS &&
		req.ClothingSize != domain.ClothingM && req.ClothingSize != domain.ClothingL &&
		req.ClothingSize != domain.ClothingXL && req.ClothingSize != domain.Clothing2XL &&
		req.ClothingSize != domain.Clothing3XL {
		util.WriteError(w, http.StatusBadRequest, "clothing_size must be one of: XS, S, M, L, XL, 2XL, 3XL", "BAD_REQUEST")
		return
	}

	if _, err := time.Parse("2006-01-02", req.DateOfBirth); err != nil {
		util.WriteError(w, http.StatusBadRequest, "invalid date_of_birth format, expected YYYY-MM-DD", "BAD_REQUEST")
		return
	}

	app := domain.JobApplication{
		FirstName:      req.FirstName,
		LastName:       req.LastName,
		DateOfBirth:    req.DateOfBirth,
		BSN:            req.BSN,
		Address:        req.Address,
		Email:          req.Email,
		Phone:          req.Phone,
		BankAccount:    req.BankAccount,
		HoursAvailable: req.HoursAvailable,
		ClothingSize:   req.ClothingSize,
		EmploymentType: req.EmploymentType,
	}

	if err := h.jobStore.Create(r.Context(), &app); err != nil {
		util.WriteError(w, http.StatusInternalServerError, "failed to save application", "SERVER_ERROR")
		return
	}

	// file, header, err := r.FormFile("cv")
	// if err == nil {
	// 	defer file.Close()
	// 	os.MkdirAll("./uploads", 0755)
	// 	destPath := fmt.Sprintf("./uploads/cv_%d_%s", time.Now().Unix(), header.Filename)
	// 	dest, createErr := os.Create(destPath)
	// 	if createErr == nil {
	// 		io.Copy(dest, file)
	// 		dest.Close()
	// 	}
	// }

	htmlBody := jobEmailBody(&app)
	h.emailSender.Send(util.EmailPayload{
		To:      "segurasservicediensten@gmail.com",
		Subject: "New Job Application",
		Body:    htmlBody,
	})

	util.WriteJSON(w, http.StatusCreated, domain.JobApplicationResponse{
		ID:             app.ID,
		FirstName:      app.FirstName,
		LastName:       app.LastName,
		DateOfBirth:    app.DateOfBirth,
		BSN:            app.BSN,
		Address:        app.Address,
		Email:          app.Email,
		Phone:          app.Phone,
		BankAccount:    app.BankAccount,
		HoursAvailable: app.HoursAvailable,
		ClothingSize:   app.ClothingSize,
		EmploymentType: app.EmploymentType,
		CreatedAt:      time.Now(),
	})
}

func jobEmailBody(app *domain.JobApplication) string {
	return fmt.Sprintf(`New Job Application
====================

Name:             %s %s
Date of Birth:    %s
BSN:              %s
Address:          %s
Email:            %s
Phone:            %s
Bank Account:     %s
Hours Available:  %d
Clothing Size:    %s
Employment Type:  %s`,
		app.FirstName, app.LastName, app.DateOfBirth, app.BSN,
		app.Address, app.Email, app.Phone, app.BankAccount,
		app.HoursAvailable, app.ClothingSize, app.EmploymentType)
}
