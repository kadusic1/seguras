// Package handler wires HTTP routes to request handlers.
package handler

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	// "github.com/go-chi/httprate"
	"github.com/kadusic1/seguras/backend/auth"
	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/services"
	// "github.com/kadusic1/seguras/backend/util"
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
	// rateCfg, err := config.LoadRateLimit()
	// if err != nil {
	// 	return nil, fmt.Errorf("rate limit: %w", err)
	// }
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// // Requests always arrive via Cloudflare, so resolve the client IP from its
	// // header. Must run before the rate limiter; its output is the rate-limit key.
	// r.Use(middleware.ClientIPFromHeader("CF-Connecting-IP"))

	// // Global rate limit per client IP.
	// r.Use(httprate.LimitBy(rateCfg.Requests, rateCfg.Window, util.ClientIPKey,
	// 	httprate.WithLimitHandler(util.LimitHandler)))
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
		// // Brute-force protection: 10 login attempts per 5 minutes per client IP.
		// r.With(httprate.LimitBy(10, 5*time.Minute, util.ClientIPKey,
		// 	httprate.WithLimitHandler(util.LimitHandler))).Post("/login", authHandler.Login)
		r.Post("/login", authHandler.Login)
		r.Post("/refresh", authHandler.Refresh)
	})

	// Jobs
	// // Anti-spam: 5 applications per 5 minutes per client IP.
	// r.With(
	// 	httprate.LimitBy(5, 5*time.Minute, util.ClientIPKey,
	// 		httprate.WithLimitHandler(util.LimitHandler))).Post("/jobs/apply",
	// 	jobHandler.Submit,
	// )
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
		r.Get("/jobs/{id}/cv", jobHandler.GetCV)
		r.Delete("/jobs/{id}", jobHandler.Delete)
		r.Post("/news", newsHandler.Create)
		r.Delete("/news/{id}", newsHandler.Delete)
		r.Get("/contact", contactHandler.List)
		r.Delete("/contact/{id}", contactHandler.Delete)
	})

	return r, nil
}
