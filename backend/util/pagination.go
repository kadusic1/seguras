package util

import "strconv"

// ParsePositiveInt parses s as an int, returning def when s is empty and an
// error when s is present but not a positive integer.
func ParsePositiveInt(s string, def int) (int, error) {
	if s == "" {
		return def, nil
	}
	n, err := strconv.Atoi(s)
	if err != nil || n < 1 {
		return 0, err
	}
	return n, nil
}
