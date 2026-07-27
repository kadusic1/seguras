package util

import "time"

// FormatDate converts a YYYY-MM-DD date string to dd.mm.yyyy for display.
// Falls back to the raw value if parsing fails, so a bad value never breaks
// the email.
func FormatDate(dob string) string {
	t, err := time.Parse("2006-01-02", dob)
	if err != nil {
		return dob
	}
	return t.Format("02.01.2006")
}
