package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/kadusic1/seguras/backend/auth"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/util"
	"golang.org/x/crypto/bcrypt"
)

// AuthHandler exposes HTTP handlers for authentication endpoints.
type AuthHandler struct {
	userStore *database.UserStore
	jwtSvc    *auth.JWTService
}

// NewAuthHandler creates an AuthHandler with the given dependencies.
func NewAuthHandler(userStore *database.UserStore, jwtSvc *auth.JWTService) *AuthHandler {
	return &AuthHandler{userStore: userStore, jwtSvc: jwtSvc}
}

// Login authenticates a user with email and password and returns token pair.
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req domain.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteError(w, http.StatusBadRequest, "invalid request body", "BAD_REQUEST")
		return
	}

	req.Email = strings.TrimSpace(req.Email)
	if req.Email == "" || req.Password == "" {
		util.WriteError(w, http.StatusBadRequest, "email and password are required", "BAD_REQUEST")
		return
	}

	user, err := h.userStore.GetByEmail(r.Context(), req.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			util.WriteError(w, http.StatusUnauthorized, "invalid email or password", "UNAUTHORIZED")
			return
		}
		util.WriteError(w, http.StatusInternalServerError, "internal server error", "SERVER_ERROR")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		util.WriteError(w, http.StatusUnauthorized, "invalid email or password", "UNAUTHORIZED")
		return
	}

	tokens, err := h.generateTokens(user)
	if err != nil {
		util.WriteError(w, http.StatusInternalServerError, "failed to generate tokens", "SERVER_ERROR")
		return
	}

	util.WriteJSON(w, http.StatusOK, tokens)
}

// Refresh accepts a valid refresh token and returns a new access token.
func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req domain.RefreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteError(w, http.StatusBadRequest, "invalid request body", "BAD_REQUEST")
		return
	}

	if req.RefreshToken == "" {
		util.WriteError(w, http.StatusBadRequest, "refresh_token is required", "BAD_REQUEST")
		return
	}

	claims, err := h.jwtSvc.ParseAndValidateRefreshToken(req.RefreshToken)
	if err != nil {
		util.WriteError(w, http.StatusUnauthorized, "invalid or expired refresh token", "UNAUTHORIZED")
		return
	}

	userID, err := extractUserID(claims.Subject)
	if err != nil {
		util.WriteError(w, http.StatusUnauthorized, "invalid token payload", "UNAUTHORIZED")
		return
	}

	user, err := h.userStore.GetByID(r.Context(), userID)
	if err != nil {
		util.WriteError(w, http.StatusUnauthorized, "user not found", "UNAUTHORIZED")
		return
	}

	accessToken, err := h.jwtSvc.GenerateAccessToken(user)
	if err != nil {
		util.WriteError(w, http.StatusInternalServerError, "failed to generate access token", "SERVER_ERROR")
		return
	}

	util.WriteJSON(w, http.StatusOK, domain.TokenResponse{
		AccessToken: accessToken,
		ExpiresIn:   int64(time.Now().Add(h.jwtSvc.AccessTTL()).Unix()),
	})
}

// Me returns the authenticated user's profile.
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.UserIDFromContext(r.Context())
	if !ok {
		util.WriteError(w, http.StatusUnauthorized, "unauthorized", "UNAUTHORIZED")
		return
	}

	user, err := h.userStore.GetByID(r.Context(), userID)
	if err != nil {
		util.WriteError(w, http.StatusNotFound, "user not found", "NOT_FOUND")
		return
	}

	util.WriteJSON(w, http.StatusOK, map[string]any{
		"id":         user.ID,
		"name":       user.Name,
		"last_name":  user.LastName,
		"email":      user.Email,
		"created_at": user.CreatedAt,
	})
}

func (h *AuthHandler) generateTokens(user *domain.User) (*domain.TokenResponse, error) {
	accessToken, err := h.jwtSvc.GenerateAccessToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken, err := h.jwtSvc.GenerateRefreshToken(user)
	if err != nil {
		return nil, err
	}

	return &domain.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(time.Now().Add(h.jwtSvc.AccessTTL()).Unix()),
	}, nil
}

func extractUserID(subject string) (int, error) {
	var id int
	_, err := fmt.Sscanf(subject, "refresh:%d", &id)
	return id, err
}
