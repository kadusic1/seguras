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

// List returns one page of contact messages sorted by created_at descending
// (id descending as tiebreak for stable pagination) and the total number of
// messages across all pages.
func (s *ContactStore) List(
	ctx context.Context, page, perPage int,
) ([]domain.ContactMessage, int, error) {
	page, perPage = clampPagination(page, perPage)

	var total int
	if err := s.db.QueryRowContext(
		ctx, `SELECT COUNT(*) FROM contact_messages`,
	).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := s.db.QueryContext(ctx,
		`SELECT id, first_name, last_name, email, phone, company, message,
		        created_at
		 FROM contact_messages
		 ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
		perPage, (page-1)*perPage,
	)
	if err != nil {
		return nil, 0, err
	}
	defer func() { _ = rows.Close() }()

	items := make([]domain.ContactMessage, 0, perPage)
	for rows.Next() {
		var msg domain.ContactMessage
		if err := rows.Scan(
			&msg.ID, &msg.FirstName, &msg.LastName, &msg.Email, &msg.Phone,
			&msg.Company, &msg.Message, &msg.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		items = append(items, msg)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

// Delete removes a contact message. Returns sql.ErrNoRows when no message
// with the given id exists.
func (s *ContactStore) Delete(ctx context.Context, id int) error {
	res, err := s.db.ExecContext(
		ctx, `DELETE FROM contact_messages WHERE id = ?`, id,
	)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
