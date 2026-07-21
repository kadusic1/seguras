package util

import (
	"fmt"
	"os"
	"time"
)

func GetEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func MustEnv(key string) (string, error) {
	v := os.Getenv(key)
	if v == "" {
		return "", fmt.Errorf("env: %s is required but not set", key)
	}
	return v, nil
}

func MustDuration(key string) (time.Duration, error) {
	v := os.Getenv(key)
	if v == "" {
		return 0, fmt.Errorf("env: %s is required but not set", key)
	}
	d, err := time.ParseDuration(v)
	if err != nil {
		return 0, fmt.Errorf("env: %s invalid: %w", key, err)
	}
	return d, nil
}
