package database

import (
	"context"
	"database/sql"

	"github.com/kadusic1/seguras/backend/domain"
)

type UserStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

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
