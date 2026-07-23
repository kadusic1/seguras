package domain

import "time"

// EmploymentType represents the type of employment for a job application.
type EmploymentType string

const (
	EmploymentSecurity EmploymentType = "security"
	EmploymentService  EmploymentType = "service"
)

// ClothingSize represents a clothing size option for job applicants.
type ClothingSize string

const (
	ClothingXS  ClothingSize = "XS"
	ClothingS   ClothingSize = "S"
	ClothingM   ClothingSize = "M"
	ClothingL   ClothingSize = "L"
	ClothingXL  ClothingSize = "XL"
	Clothing2XL ClothingSize = "2XL"
	Clothing3XL ClothingSize = "3XL"
)

// JobApplication represents a job application submitted through the frontend form.
type JobApplication struct {
	ID             int
	FirstName      string
	LastName       string
	DateOfBirth    string
	BSN            string
	Address        string
	Email          string
	Phone          string
	BankAccount    string
	HoursAvailable int
	ClothingSize   ClothingSize
	EmploymentType EmploymentType
	CreatedAt      time.Time
}

// SubmitJobApplicationRequest is the expected JSON body for submitting a job application.
type SubmitJobApplicationRequest struct {
	FirstName      string         `json:"first_name"`
	LastName       string         `json:"last_name"`
	DateOfBirth    string         `json:"date_of_birth"`
	BSN            string         `json:"bsn"`
	Address        string         `json:"address"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	BankAccount    string         `json:"bank_account"`
	HoursAvailable int            `json:"hours_available"`
	ClothingSize   ClothingSize   `json:"clothing_size"`
	EmploymentType EmploymentType `json:"employment_type"`
}

// JobApplicationResponse is the JSON envelope returned for a job application.
type JobApplicationResponse struct {
	ID             int            `json:"id"`
	FirstName      string         `json:"first_name"`
	LastName       string         `json:"last_name"`
	DateOfBirth    string         `json:"date_of_birth"`
	BSN            string         `json:"bsn"`
	Address        string         `json:"address"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	BankAccount    string         `json:"bank_account"`
	HoursAvailable int            `json:"hours_available"`
	ClothingSize   ClothingSize   `json:"clothing_size"`
	EmploymentType EmploymentType `json:"employment_type"`
	CreatedAt      time.Time      `json:"created_at"`
}
