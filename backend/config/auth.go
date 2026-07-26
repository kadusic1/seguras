package config

import "time"

// AuthConfig holds JWT signing and token lifetime settings.
type AuthConfig struct {
	JWTSecret  string
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

// LoadAuth reads authentication configuration from the environment.
func LoadAuth() (*AuthConfig, error) {
	secret, err := MustEnv("JWT_SECRET")
	if err != nil {
		return nil, err
	}
	accessTTL, err := MustDuration("ACCESS_TTL")
	if err != nil {
		return nil, err
	}
	refreshTTL, err := MustDuration("REFRESH_TTL")
	if err != nil {
		return nil, err
	}
	return &AuthConfig{
		JWTSecret:  secret,
		AccessTTL:  accessTTL,
		RefreshTTL: refreshTTL,
	}, nil
}
