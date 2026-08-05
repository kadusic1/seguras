package database

import (
	"context"
	"database/sql"
	"strings"

	"github.com/kadusic1/seguras/backend/domain"
)

// NewsStore provides persistence for news articles and their images.
type NewsStore struct {
	db *sql.DB
}

// NewNewsStore creates a NewsStore wrapping the given database connection.
func NewNewsStore(db *sql.DB) *NewsStore {
	return &NewsStore{db: db}
}

// Create inserts a news row and its images in one transaction, populating
// news.ID and each image's ID and NewsID.
func (s *NewsStore) Create(
	ctx context.Context, news *domain.News, images []domain.NewsImage,
) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	res, err := tx.ExecContext(ctx,
		`INSERT INTO news (heading, text) VALUES (?, ?)`,
		news.Heading, news.Text,
	)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	news.ID = int(id)

	for i := range images {
		images[i].NewsID = news.ID
		res, err := tx.ExecContext(ctx,
			`INSERT INTO news_images (news_id, image_key, display_order)
			 VALUES (?, ?, ?)`,
			images[i].NewsID, images[i].ImageKey,
			images[i].DisplayOrder,
		)
		if err != nil {
			return err
		}
		imgID, err := res.LastInsertId()
		if err != nil {
			return err
		}
		images[i].ID = int(imgID)
	}

	return tx.Commit()
}

// List returns one page of news sorted by created_at descending (id
// descending as tiebreak for stable pagination), each item carrying its
// images sorted by display_order ascending. It also returns the total
// number of news items across all pages.
func (s *NewsStore) List(
	ctx context.Context, page, perPage int,
) ([]domain.NewsWithImages, int, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 10
	}
	if perPage > 100 {
		perPage = 100
	}

	var total int
	if err := s.db.QueryRowContext(
		ctx, `SELECT COUNT(*) FROM news`,
	).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := s.db.QueryContext(ctx,
		`SELECT id, heading, text, created_at FROM news
		 ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
		perPage, (page-1)*perPage,
	)
	if err != nil {
		return nil, 0, err
	}
	defer func() { _ = rows.Close() }()

	var pageNews []domain.News
	var newsIDs []int
	for rows.Next() {
		var n domain.News
		if err := rows.Scan(
			&n.ID, &n.Heading, &n.Text, &n.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		pageNews = append(pageNews, n)
		newsIDs = append(newsIDs, n.ID)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	items := make([]domain.NewsWithImages, 0, len(pageNews))
	if len(pageNews) == 0 {
		return items, total, nil
	}

	imagesByNewsID := make(map[int][]domain.NewsImage)
	placeholders := strings.TrimSuffix(
		strings.Repeat("?,", len(newsIDs)), ",",
	)
	args := make([]any, len(newsIDs))
	for i, id := range newsIDs {
		args[i] = id
	}
	imgRows, err := s.db.QueryContext(ctx,
		`SELECT id, news_id, image_key, display_order, created_at
		 FROM news_images WHERE news_id IN (`+placeholders+`)
		 ORDER BY news_id, display_order ASC`,
		args...,
	)
	if err != nil {
		return nil, 0, err
	}
	defer func() { _ = imgRows.Close() }()

	for imgRows.Next() {
		var img domain.NewsImage
		if err := imgRows.Scan(
			&img.ID, &img.NewsID, &img.ImageKey, &img.DisplayOrder,
			&img.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		imagesByNewsID[img.NewsID] = append(
			imagesByNewsID[img.NewsID], img,
		)
	}
	if err := imgRows.Err(); err != nil {
		return nil, 0, err
	}

	for _, n := range pageNews {
		images := imagesByNewsID[n.ID]
		if images == nil {
			images = []domain.NewsImage{}
		}
		items = append(items, domain.NewsWithImages{
			News:   n,
			Images: images,
		})
	}

	return items, total, nil
}
