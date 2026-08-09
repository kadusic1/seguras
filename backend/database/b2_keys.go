package database

import (
	"context"
	"database/sql"
)

// B2KeyLister lists the B2 object keys referenced anywhere in the database.
// It is the single source of truth for where B2 keys live, used by the
// sweeper to find orphaned objects.
type B2KeyLister struct {
	db *sql.DB
}

// NewB2KeyLister creates a B2KeyLister wrapping the given database connection.
func NewB2KeyLister(db *sql.DB) *B2KeyLister {
	return &B2KeyLister{db: db}
}

// ListReferencedKeys returns every B2 object key referenced by any table.
func (s *B2KeyLister) ListReferencedKeys(ctx context.Context) ([]string, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT image_key FROM news_images
		 UNION
		 SELECT cv_key FROM job_applications WHERE cv_key IS NOT NULL`)
	if err != nil {
		return nil, err
	}
	defer func() { _ = rows.Close() }()

	var keys []string
	for rows.Next() {
		var key string
		if err := rows.Scan(&key); err != nil {
			return nil, err
		}
		keys = append(keys, key)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return keys, nil
}
