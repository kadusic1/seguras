// Command server starts the Seguras HTTP API server.
package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"

	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/handler"
	"github.com/kadusic1/seguras/backend/services"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("failed to load .env file: %v", err)
	}

	dbCfg, err := config.LoadDB()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	db, err := config.OpenDB(dbCfg.DSN)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("failed to close database connection: %v", err)
		}
	}()

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	emailService, err := services.NewEmailService()
	if err != nil {
		log.Fatalf("email service: %v", err)
	}

	b2Service, err := services.NewB2Service(context.Background())
	if err != nil {
		log.Fatalf("b2 service: %v", err)
	}

	serverCfg := config.LoadServer()

	paginationCfg, err := config.LoadPagination()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	presignCfg, err := config.LoadPresign()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	r, err := handler.NewRouter(
		db, emailService, b2Service, paginationCfg.ItemsPerPage,
		presignCfg.Expiry,
	)
	if err != nil {
		log.Fatalf("router: %v", err)
	}

	log.Printf("server starting on :%s", serverCfg.Port)
	if err := http.ListenAndServe(":"+serverCfg.Port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
