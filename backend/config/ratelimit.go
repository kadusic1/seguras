package config

// import (
// 	"fmt"
// 	"strconv"
// 	"time"
// )

// // RateLimitConfig holds the global request limit per client IP.
// type RateLimitConfig struct {
// 	Requests int
// 	Window   time.Duration
// }

// // LoadRateLimit reads the global request limit from the environment,
// // falling back to 100 requests per minute when unset.
// func LoadRateLimit() (*RateLimitConfig, error) {
// 	requestsRaw := GetEnv("RATE_LIMIT_REQUESTS", "100")
// 	n, err := strconv.Atoi(requestsRaw)
// 	if err != nil || n < 1 {
// 		return nil, fmt.Errorf(
// 			"env: RATE_LIMIT_REQUESTS must be a positive integer, got %q", requestsRaw,
// 		)
// 	}

// 	windowRaw := GetEnv("RATE_LIMIT_WINDOW", "1m")
// 	d, err := time.ParseDuration(windowRaw)
// 	if err != nil || d <= 0 {
// 		return nil, fmt.Errorf(
// 			"env: RATE_LIMIT_WINDOW must be a positive duration, got %q", windowRaw,
// 		)
// 	}
// 	return &RateLimitConfig{Requests: n, Window: d}, nil
// }