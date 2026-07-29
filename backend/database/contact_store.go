package database

import (
	"context"
	"database/sql"

	"github.com/kadusic1/seguras/backend/domain"
)

type ContactStore struct {
	db *sql.DB
}

func NewContactStore(db *sql.DB) *ContactStore {
	return &ContactStore{db: db}
}

func (s *ContactStore) Create(
	ctx context.Context, msg *domain.ContactMessage,
) error {
	res, err := s.db.ExecContext(ctx,
		`INSERT INTO contact_messages
		 (first_name, last_name, email, phone, company, message)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		msg.FirstName, msg.LastName, msg.Email, msg.Phone, msg.Company,
		msg.Message,
	)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	msg.ID = int(id)
	return nil
}
