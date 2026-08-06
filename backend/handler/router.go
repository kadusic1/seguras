// Package handler wires HTTP routes to request handlers.
package handler

import (
	"database/sql"
	"fmt"

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
) (*chi.Mux, error) {
	userStore := database.NewUserStore(db)

	jwtSvc, err := auth.NewJWTService()
	if err != nil {
		return nil, fmt.Errorf("jwt: %w", err)
	}
	authHandler := NewAuthHandler(userStore, jwtSvc)

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

	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)

		r.Group(func(r chi.Router) {
			r.Use(auth.AuthMiddleware(jwtSvc))
			r.Get("/me", authHandler.Me)
		})
	})

	jobStore := database.NewJobStore(db)
	jobHandler, err := NewJobHandler(jobStore, emailService, b2Service)
	if err != nil {
		return nil, fmt.Errorf("job handler: %w", err)
	}

	r.Post("/jobs/apply", jobHandler.Submit)

	fileHandler := NewFileHandler(b2Service)
	r.Post("/files/presign", fileHandler.PresignUpload)
	r.Delete("/files/{key}", fileHandler.Delete)

	newsStore := database.NewNewsStore(db)
	newsHandler, err := NewNewsHandler(newsStore, b2Service, itemsPerPage)
	if err != nil {
		return nil, fmt.Errorf("news handler: %w", err)
	}

	r.Get("/news", newsHandler.List)

	r.Group(func(r chi.Router) {
		r.Use(auth.AuthMiddleware(jwtSvc))
		r.Post("/news", newsHandler.Create)
		r.Delete("/news/{id}", newsHandler.Delete)
	})

	contactStore := database.NewContactStore(db)
	contactHandler, err := NewContactHandler(contactStore, emailService)
	if err != nil {
		return nil, fmt.Errorf("contact handler: %w", err)
	}

	r.Post("/contact", contactHandler.Submit)

	return r, nil
}
