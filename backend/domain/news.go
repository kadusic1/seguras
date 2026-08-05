package domain

import "time"

// News is a news article published on the site.
type News struct {
	ID        int
	Heading   string
	Text      string
	CreatedAt time.Time
}

// NewsImage is a single image attached to a news article.
type NewsImage struct {
	ID           int
	NewsID       int
	ImageKey     string
	DisplayOrder int
	CreatedAt    time.Time
}

// NewsWithImages is a news article combined with its images, ordered by
// display order. Returned by the store's List method.
type NewsWithImages struct {
	News
	Images []NewsImage
}
