package database

// clampPagination normalises pagination parameters: pages start at 1 and a
// page holds between 1 and 100 items, defaulting to 10.
func clampPagination(page, perPage int) (int, int) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 10
	}
	if perPage > 100 {
		perPage = 100
	}
	return page, perPage
}
