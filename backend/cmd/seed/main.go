package main

import (
	"context"
	"database/sql"
	"flag"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"

	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
)

func main() {
	name := flag.String("name", "", "user's first name")
	lastName := flag.String("lastname", "", "user's last name")
	email := flag.String("email", "", "user's email")
	password := flag.String("password", "", "user's plaintext password")
	flag.Parse()

	if *name == "" || *lastName == "" || *email == "" || *password == "" {
		log.Fatal("all flags are required: -name -lastname -email -password")
	}

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

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash password: %v", err)
	}

	user := &domain.User{
		Name:     *name,
		LastName: *lastName,
		Email:    *email,
		Password: string(hash),
	}

	store := database.NewUserStore(db)
	if err := store.CreateUser(context.Background(), user); err != nil {
		log.Fatalf("failed to create user: %v", err)
	}

	log.Printf("created user %s (%s)", user.Email, user.Name)
}
