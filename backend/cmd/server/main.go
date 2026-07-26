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

	dbCfg, err := config.LoadDB()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	db, err := sql.Open("mysql", dbCfg.DSN)
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

	emailSender, err := util.NewAsyncSender()
	if err != nil {
		log.Fatalf("email sender: %v", err)
	}

	b2Service, err := services.NewB2Service(context.Background())
	if err != nil {
		log.Fatalf("b2 service: %v", err)
	}

	r, err := handler.NewRouter(db, emailSender, b2Service)
	if err != nil {
		log.Fatalf("router: %v", err)
	}

	serverCfg := config.LoadServer()
	log.Printf("server starting on :%s", serverCfg.Port)
	if err := http.ListenAndServe(":"+serverCfg.Port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
