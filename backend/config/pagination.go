package config

import (
	"fmt"
	"strconv"
)

// PaginationConfig holds the default number of items per page.
type PaginationConfig struct {
	ItemsPerPage int
}

// LoadPagination reads the default items-per-page value from the
// environment, falling back to 10 when unset.
func LoadPagination() (*PaginationConfig, error) {
	raw := GetEnv("ITEMS_PER_PAGE", "10")
	n, err := strconv.Atoi(raw)
	if err != nil || n < 1 {
		return nil, fmt.Errorf(
			"env: ITEMS_PER_PAGE must be a positive integer, got %q", raw,
		)
	}
	return &PaginationConfig{ItemsPerPage: n}, nil
}
