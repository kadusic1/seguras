// Package config loads application configuration from environment variables.
package config

import (
	"time"

	"github.com/kadusic1/seguras/backend/util"
)

// Config holds runtime configuration values loaded from the environment.
type Config struct {
	DBDSN      string
	JWTSecret  string
	AccessTTL  time.Duration
	RefreshTTL time.Duration
	Port       string
}

// Load reads required and optional environment variables and returns a Config.
func Load() (*Config, error) {
	dbDSN, err := util.MustEnv("DB_DSN")
	if err != nil {
		return nil, err
	}
	jwtSecret, err := util.MustEnv("JWT_SECRET")
	if err != nil {
		return nil, err
	}
	accessTTL, err := util.MustDuration("ACCESS_TTL")
	if err != nil {
		return nil, err
	}
	refreshTTL, err := util.MustDuration("REFRESH_TTL")
	if err != nil {
		return nil, err
	}

	return &Config{
		DBDSN:      dbDSN,
		JWTSecret:  jwtSecret,
		AccessTTL:  accessTTL,
		RefreshTTL: refreshTTL,
		Port:       util.GetEnv("PORT", "8080"),
	}, nil
}
