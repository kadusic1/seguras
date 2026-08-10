package config

import (
	"fmt"
	"time"
)

// PresignConfig holds the lifetime of presigned URLs.
type PresignConfig struct {
	Expiry time.Duration
}

// LoadPresign reads the presigned URL expiry from the environment,
// falling back to 15 minutes when unset.
func LoadPresign() (*PresignConfig, error) {
	raw := GetEnv("PRESIGN_EXPIRY", "15m")
	d, err := time.ParseDuration(raw)
	if err != nil || d <= 0 {
		return nil, fmt.Errorf(
			"env: PRESIGN_EXPIRY must be a positive duration, got %q", raw,
		)
	}
	return &PresignConfig{Expiry: d}, nil
}
