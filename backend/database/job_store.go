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
	var cvKey any
	if app.CVKey != "" {
		cvKey = app.CVKey
	}

	res, err := s.db.ExecContext(ctx,
		`INSERT INTO job_applications
		 (first_name, last_name, date_of_birth, address, email, phone,
		  hours_available, clothing_size, employment_type, cv_key)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		app.FirstName, app.LastName, app.DateOfBirth, app.Address,
		app.Email, app.Phone, app.HoursAvailable,
		app.ClothingSize, app.EmploymentType, cvKey,
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

// List returns one page of job applications sorted by created_at descending
// (id descending as tiebreak for stable pagination) and the total number of
// applications across all pages.
func (s *JobStore) List(
	ctx context.Context, page, perPage int,
) ([]domain.JobApplication, int, error) {
	page, perPage = clampPagination(page, perPage)

	var total int
	if err := s.db.QueryRowContext(
		ctx, `SELECT COUNT(*) FROM job_applications`,
	).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := s.db.QueryContext(ctx,
		`SELECT id, first_name, last_name, date_of_birth, address, email,
		        phone, hours_available, clothing_size, employment_type,
		        cv_key, created_at
		 FROM job_applications
		 ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
		perPage, (page-1)*perPage,
	)
	if err != nil {
		return nil, 0, err
	}
	defer func() { _ = rows.Close() }()

	items := make([]domain.JobApplication, 0, perPage)
	for rows.Next() {
		var app domain.JobApplication
		var cvKey sql.NullString
		if err := rows.Scan(
			&app.ID, &app.FirstName, &app.LastName, &app.DateOfBirth,
			&app.Address, &app.Email, &app.Phone, &app.HoursAvailable,
			&app.ClothingSize, &app.EmploymentType, &cvKey,
			&app.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		app.CVKey = cvKey.String
		items = append(items, app)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

// Delete removes a job application, returning its CV key so the caller can
// clean up object storage. Returns sql.ErrNoRows when no application with
// the given id exists.
func (s *JobStore) Delete(ctx context.Context, id int) (string, error) {
	var cvKey sql.NullString
	err := s.db.QueryRowContext(
		ctx, `SELECT cv_key FROM job_applications WHERE id = ?`, id,
	).Scan(&cvKey)
	if err != nil {
		return "", err
	}

	res, err := s.db.ExecContext(
		ctx, `DELETE FROM job_applications WHERE id = ?`, id,
	)
	if err != nil {
		return "", err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return "", err
	}
	if n == 0 {
		return "", sql.ErrNoRows
	}
	return cvKey.String, nil
}
