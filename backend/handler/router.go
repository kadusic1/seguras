// Package handler wires HTTP routes to request handlers.
package handler

import (
	"database/sql"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/kadusic1/seguras/backend/auth"
	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/database"
)

// NewRouter builds the chi router with all middleware and route groups.
func NewRouter(cfg *config.Config, db *sql.DB) *chi.Mux {
	userStore := database.NewUserStore(db)
	jwtSvc := auth.NewJWTService(cfg.JWTSecret, cfg.AccessTTL, cfg.RefreshTTL)
	authHandler := NewAuthHandler(userStore, jwtSvc)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)

		r.Group(func(r chi.Router) {
			r.Use(auth.AuthMiddleware(jwtSvc))
			r.Get("/me", authHandler.Me)
		})
	})

	return r
}
