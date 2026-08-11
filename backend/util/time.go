package util

import "time"

// FormatDate converts a date string (YYYY-MM-DD or RFC3339) to dd.mm.yyyy
// for display. Falls back to the raw value if parsing fails, so a bad value
// never breaks the email.
func FormatDate(dob string) string {
	for _, layout := range []string{"2006-01-02", time.RFC3339Nano} {
		t, err := time.Parse(layout, dob)
		if err == nil {
			return t.Format("02.01.2006")
		}
	}
	return dob
}
