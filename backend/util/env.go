// Package util provides shared helpers for environment, HTTP, and context operations.
package util

import (
	"fmt"
	"os"
	"time"
)

// GetEnv returns the value of the environment variable key, or fallback if unset or empty.
func GetEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// MustEnv returns the value of the environment variable key, or an error if unset.
func MustEnv(key string) (string, error) {
	v := os.Getenv(key)
	if v == "" {
		return "", fmt.Errorf("env: %s is required but not set", key)
	}
	return v, nil
}

// MustDuration returns the value of key parsed as a Go duration, or an error if unset or invalid.
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
