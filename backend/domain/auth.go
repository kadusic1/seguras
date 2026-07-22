package domain

import "github.com/golang-jwt/jwt/v5"

// LoginRequest carries the credentials for a login attempt.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// TokenResponse contains the token pair returned after authentication.
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
}

// RefreshRequest carries a refresh token to obtain a new access token.
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

// ErrorResponse is the standard JSON error envelope returned by the API.
type ErrorResponse struct {
	Error string `json:"error"`
	Code  string `json:"code"`
}

// AccessClaims holds the custom claims embedded in an access JWT.
type AccessClaims struct {
	jwt.RegisteredClaims
	Email string `json:"email"`
}

// RefreshClaims holds the custom claims embedded in a refresh JWT.
type RefreshClaims struct {
	jwt.RegisteredClaims
}
