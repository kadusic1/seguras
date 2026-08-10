// Package handler wires HTTP routes to request handlers.
package handler

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/kadusic1/seguras/backend/auth"
	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/services"
)

// NewRouter builds the chi router with all middleware and route groups.
func NewRouter(
	db *sql.DB,
	emailService *services.EmailService,
	b2Service *services.B2Service,
	itemsPerPage int,
	presignExpiry time.Duration,
) (*chi.Mux, error) {
	// Stores
	userStore := database.NewUserStore(db)
	jobStore := database.NewJobStore(db)
	newsStore := database.NewNewsStore(db)
	contactStore := database.NewContactStore(db)

	// Services
	jwtSvc, err := auth.NewJWTService()
	if err != nil {
		return nil, fmt.Errorf("jwt: %w", err)
	}

	// Handlers
	authHandler := NewAuthHandler(userStore, jwtSvc)
	jobHandler, err := NewJobHandler(
		jobStore, emailService, b2Service, itemsPerPage, presignExpiry,
	)
	if err != nil {
		return nil, fmt.Errorf("job handler: %w", err)
	}
	newsHandler, err := NewNewsHandler(
		newsStore, b2Service, itemsPerPage, presignExpiry,
	)
	if err != nil {
		return nil, fmt.Errorf("news handler: %w", err)
	}
	contactHandler, err := NewContactHandler(contactStore, emailService, itemsPerPage)
	if err != nil {
		return nil, fmt.Errorf("contact handler: %w", err)
	}
	fileHandler := NewFileHandler(b2Service, presignExpiry)

	// Router setup and middleware
	serverCfg := config.LoadServer()
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{serverCfg.CORSOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// --- Public routes ---
	// Auth
	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)
	})

	// Jobs
	r.Post("/jobs/apply", jobHandler.Submit)

	// Files
	r.Post("/files/presign", fileHandler.PresignUpload)
	r.Delete("/files/{key}", fileHandler.Delete)

	// News
	r.Get("/news", newsHandler.List)

	// Contact
	r.Post("/contact", contactHandler.Submit)

	// --- Protected routes (require auth) ---
	r.Group(func(r chi.Router) {
		r.Use(auth.AuthMiddleware(jwtSvc))
		r.Get("/auth/me", authHandler.Me)
		r.Get("/jobs", jobHandler.List)
		r.Delete("/jobs/{id}", jobHandler.Delete)
		r.Post("/news", newsHandler.Create)
		r.Delete("/news/{id}", newsHandler.Delete)
		r.Get("/contact", contactHandler.List)
		r.Delete("/contact/{id}", contactHandler.Delete)
	})

	return r, nil
}
