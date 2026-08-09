package domain

import "time"

type ContactMessage struct {
	ID        int
	FirstName string
	LastName  string
	Email     string
	Phone     string
	Company   string
	Message   string
	CreatedAt time.Time
}

type SubmitContactRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Company   string `json:"company"`
	Message   string `json:"message"`
}

type ContactResponse struct {
	ID        int       `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Company   string    `json:"company"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

type ContactListItemResponse struct {
	ContactResponse
	TimeAgo string `json:"time_ago"`
}
