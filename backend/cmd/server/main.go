// Command server starts the Seguras HTTP API server.
package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"

	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/handler"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("failed to load .env file: %v", err)
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	db, err := sql.Open("mysql", cfg.DBDSN)
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

	emailSender := util.NewAsyncSender(util.SMTPConfig{
		Host:     cfg.SMTPHost,
		Port:     cfg.SMTPPort,
		Username: cfg.SMTPUsername,
		Password: cfg.SMTPPassword,
		From:     cfg.FromEmail,
	})

	b2Service, err := services.NewB2Service(
		context.Background(), services.B2Config{
			Endpoint: cfg.B2Endpoint,
			Region:   cfg.B2Region,
			KeyID:    cfg.B2KeyID,
			AppKey:   cfg.B2AppKey,
			Bucket:   cfg.B2Bucket,
		})
	if err != nil {
		log.Fatalf("failed to init b2 service: %v", err)
	}

	r := handler.NewRouter(cfg, db, emailSender, b2Service)

	log.Printf("server starting on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
