// Package database provides persistence operations for domain types.
package database

import (
	"context"
	"database/sql"

	"github.com/kadusic1/seguras/backend/domain"
)

// UserStore provides CRUD operations for users backed by MySQL.
type UserStore struct {
	db *sql.DB
}

// NewUserStore creates a UserStore wrapping the given database connection.
func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

// GetByEmail retrieves a user by their email address. Returns sql.ErrNoRows if not found.
func (s *UserStore) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	u := &domain.User{}
	err := s.db.QueryRowContext(ctx,
		`SELECT id, name, last_name, email, password, created_at, updated_at
		 FROM users WHERE email = ?`, email,
	).Scan(&u.ID, &u.Name, &u.LastName, &u.Email, &u.Password, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return u, nil
}

// GetByID retrieves a user by their primary key. Returns sql.ErrNoRows if not found.
func (s *UserStore) GetByID(ctx context.Context, id int) (*domain.User, error) {
	u := &domain.User{}
	err := s.db.QueryRowContext(ctx,
		`SELECT id, name, last_name, email, password, created_at, updated_at
		 FROM users WHERE id = ?`, id,
	).Scan(&u.ID, &u.Name, &u.LastName, &u.Email, &u.Password, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return u, nil
}

// CreateUser inserts a new user row and populates u.ID with the generated ID.
func (s *UserStore) CreateUser(ctx context.Context, u *domain.User) error {
	res, err := s.db.ExecContext(ctx,
		`INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)`,
		u.Name, u.LastName, u.Email, u.Password,
	)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	u.ID = int(id)
	return nil
}
