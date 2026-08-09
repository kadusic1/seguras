package domain

// PaginatedResponse is the JSON envelope returned for one page of items.
type PaginatedResponse[T any] struct {
	Items   []T `json:"items"`
	Total   int `json:"total"`
	Page    int `json:"page"`
	PerPage int `json:"per_page"`
}
