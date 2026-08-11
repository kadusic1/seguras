package util

import (
	"net/http"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

// ClientIPKey derives the rate-limit key from the client IP resolved by the
// ClientIPFrom* middleware. CanonicalizeIP buckets IPv6 clients by /64 so they
// can't rotate addresses to evade the limit.
func ClientIPKey(r *http.Request) (string, error) {
	return httprate.CanonicalizeIP(middleware.GetClientIP(r.Context())), nil
}

// LimitHandler returns the house-style JSON error response for rate-limited requests.
func LimitHandler(w http.ResponseWriter, _ *http.Request) {
	WriteError(w, http.StatusTooManyRequests, "Too many requests. Please try again later.", "rate_limited")
}
