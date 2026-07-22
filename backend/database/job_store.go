package database

import (
	"context"
	"database/sql"

	"github.com/kadusic1/seguras/backend/domain"
)

// JobStore provides persistence operations for job applications backed by MySQL.
type JobStore struct {
	db *sql.DB
}

// NewJobStore creates a JobStore wrapping the given database connection.
func NewJobStore(db *sql.DB) *JobStore {
	return &JobStore{db: db}
}

// Create inserts a new job application row and populates app.ID with the generated ID.
func (s *JobStore) Create(ctx context.Context, app *domain.JobApplication) error {
	res, err := s.db.ExecContext(ctx,
		`INSERT INTO job_applications
		 (first_name, last_name, date_of_birth, bsn, address, email, phone,
		  bank_account, hours_available, clothing_size, employment_type)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		app.FirstName, app.LastName, app.DateOfBirth, app.BSN, app.Address,
		app.Email, app.Phone, app.BankAccount, app.HoursAvailable,
		app.ClothingSize, app.EmploymentType,
	)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	app.ID = int(id)
	return nil
}
