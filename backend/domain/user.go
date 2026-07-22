// Package domain defines core business types used across the application.
package domain

import "time"

// User represents a registered user in the system.
type User struct {
	ID        int
	Name      string
	LastName  string
	Email     string
	Password  string
	CreatedAt time.Time
	UpdatedAt time.Time
}
