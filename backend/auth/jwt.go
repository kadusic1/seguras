// Package auth provides JWT token operations and HTTP authentication middleware.
package auth

import (
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kadusic1/seguras/backend/domain"
)

// JWTService handles signing, parsing, and validating JWT tokens.
type JWTService struct {
	secret     []byte
	accessTTL  time.Duration
	refreshTTL time.Duration
}

// NewJWTService creates a JWTService with the given signing secret and TTLs.
func NewJWTService(secret string, accessTTL, refreshTTL time.Duration) *JWTService {
	return &JWTService{
		secret:     []byte(secret),
		accessTTL:  accessTTL,
		refreshTTL: refreshTTL,
	}
}

// GenerateAccessToken creates a signed access JWT for the given user.
func (s *JWTService) GenerateAccessToken(user *domain.User) (string, error) {
	claims := domain.AccessClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("access:%d", user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.accessTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Email: user.Email,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.secret)
}

// GenerateRefreshToken creates a signed refresh JWT for the given user.
func (s *JWTService) GenerateRefreshToken(user *domain.User) (string, error) {
	claims := domain.RefreshClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("refresh:%d", user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.refreshTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.secret)
}

// ParseAndValidateAccessToken parses a token string and validates it as an access token.
func (s *JWTService) ParseAndValidateAccessToken(tokenString string) (*domain.AccessClaims, error) {
	claims := &domain.AccessClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, s.keyFunc,
		jwt.WithValidMethods([]string{"HS256"}),
	)
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}
	if !strings.HasPrefix(claims.Subject, "access:") {
		return nil, jwt.ErrTokenInvalidClaims
	}
	return claims, nil
}

// ParseAndValidateRefreshToken parses a token string and validates it as a refresh token.
func (s *JWTService) ParseAndValidateRefreshToken(tokenString string) (*domain.RefreshClaims, error) {
	claims := &domain.RefreshClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, s.keyFunc,
		jwt.WithValidMethods([]string{"HS256"}),
	)
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}
	if !strings.HasPrefix(claims.Subject, "refresh:") {
		return nil, jwt.ErrTokenInvalidClaims
	}
	return claims, nil
}

// AccessTTL returns the configured access token TTL duration.
func (s *JWTService) AccessTTL() time.Duration {
	return s.accessTTL
}

func (s *JWTService) keyFunc(token *jwt.Token) (any, error) {
	return s.secret, nil
}
