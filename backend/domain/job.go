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
	Address        string
	Email          string
	Phone          string
	HoursAvailable int
	ClothingSize   ClothingSize
	EmploymentType EmploymentType
	CVKey          string
	CreatedAt      time.Time
}

// SubmitJobApplicationRequest is the expected JSON body for submitting a job application.
type SubmitJobApplicationRequest struct {
	FirstName      string         `json:"first_name"`
	LastName       string         `json:"last_name"`
	DateOfBirth    string         `json:"date_of_birth"`
	Address        string         `json:"address"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	HoursAvailable int            `json:"hours_available"`
	ClothingSize   ClothingSize   `json:"clothing_size"`
	EmploymentType EmploymentType `json:"employment_type"`
	CVKey          string         `json:"cv_key"`
}

// JobApplicationResponse is the JSON envelope returned for a job application.
type JobApplicationResponse struct {
	ID             int            `json:"id"`
	FirstName      string         `json:"first_name"`
	LastName       string         `json:"last_name"`
	DateOfBirth    string         `json:"date_of_birth"`
	Address        string         `json:"address"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	HoursAvailable int            `json:"hours_available"`
	ClothingSize   ClothingSize   `json:"clothing_size"`
	EmploymentType EmploymentType `json:"employment_type"`
	CreatedAt      time.Time      `json:"created_at"`
}

// JobListItemResponse is a job application in a list response, including a
// presigned URL to download the CV when one was submitted.
type JobListItemResponse struct {
	JobApplicationResponse
	CVURL   string `json:"cv_url,omitempty"`
	TimeAgo string `json:"time_ago"`
}
