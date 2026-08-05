package util

import (
	"fmt"
	"time"
)

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

// TimeAgo returns a compact relative time description for display, rounded
// down to the largest unit: "5m ago", "2h ago", "20d ago", "3m ago", "1y ago".
// Never compound ("2h 50m ago"). Future timestamps and anything under a
// minute are reported as "1m ago".
func TimeAgo(t time.Time) string {
	mins := int(time.Since(t).Minutes())
	if mins < 1 {
		mins = 1
	}
	switch {
	case mins < 60:
		return fmt.Sprintf("%dm ago", mins)
	case mins < 24*60:
		return fmt.Sprintf("%dh ago", mins/60)
	case mins < 30*24*60:
		return fmt.Sprintf("%dd ago", mins/(24*60))
	case mins < 12*30*24*60:
		return fmt.Sprintf("%dm ago", mins/(30*24*60))
	default:
		return fmt.Sprintf("%dy ago", mins/(12*30*24*60))
	}
}
