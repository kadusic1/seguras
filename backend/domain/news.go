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

// NewsImageResponse is an image with a presigned URL for downloading it.
type NewsImageResponse struct {
	ID           int    `json:"id"`
	URL          string `json:"url"`
	DisplayOrder int    `json:"display_order"`
}

// NewsItemResponse is a news article with its images' presigned URLs.
type NewsItemResponse struct {
	ID        int                 `json:"id"`
	Heading   string              `json:"heading"`
	Text      string              `json:"text"`
	CreatedAt time.Time           `json:"created_at"`
	Images    []NewsImageResponse `json:"images"`
}

// NewsListResponse is the JSON envelope returned for a page of news.
type NewsListResponse struct {
	Items   []NewsItemResponse `json:"items"`
	Total   int                `json:"total"`
	Page    int                `json:"page"`
	PerPage int                `json:"per_page"`
}

// CreateNewsImageRequest is a single image reference in a create request.
type CreateNewsImageRequest struct {
	ImageKey     string `json:"image_key"`
	DisplayOrder int    `json:"display_order"`
}

// CreateNewsRequest is the expected JSON body for creating a news article.
type CreateNewsRequest struct {
	Heading string                   `json:"heading"`
	Text    string                   `json:"text"`
	Images  []CreateNewsImageRequest `json:"images"`
}

// CreateNewsImageResponse is an image as stored, carrying its key.
type CreateNewsImageResponse struct {
	ID           int    `json:"id"`
	ImageKey     string `json:"image_key"`
	DisplayOrder int    `json:"display_order"`
}

// CreateNewsResponse is the JSON envelope returned for a created news article.
type CreateNewsResponse struct {
	ID        int                      `json:"id"`
	Heading   string                   `json:"heading"`
	Text      string                   `json:"text"`
	CreatedAt time.Time                `json:"created_at"`
	Images    []CreateNewsImageResponse `json:"images"`
}
