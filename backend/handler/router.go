// Package handler wires HTTP routes to request handlers.
package handler

import (
	"database/sql"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/kadusic1/seguras/backend/auth"
	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/util"
)

// NewRouter builds the chi router with all middleware and route groups.
func NewRouter(cfg *config.Config, db *sql.DB, emailSender *util.AsyncSender) *chi.Mux {
	userStore := database.NewUserStore(db)
	jwtSvc := auth.NewJWTService(cfg.JWTSecret, cfg.AccessTTL, cfg.RefreshTTL)
	authHandler := NewAuthHandler(userStore, jwtSvc)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)

		r.Group(func(r chi.Router) {
			r.Use(auth.AuthMiddleware(jwtSvc))
			r.Get("/me", authHandler.Me)
		})
	})

	jobStore := database.NewJobStore(db)
	jobHandler := NewJobHandler(jobStore, emailSender, cfg.NotificationEmail)

	r.Post("/jobs/apply", jobHandler.Submit)

	return r
}
