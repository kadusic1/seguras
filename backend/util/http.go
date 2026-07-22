package util

import (
	"context"
	"encoding/json"
	"net/http"
)

// ContextKey is a typed key for storing values in context.Context.
type ContextKey string

// WithValue returns a new context with this key set to val.
func (k ContextKey) WithValue(ctx context.Context, val any) context.Context {
	return context.WithValue(ctx, k, val)
}

// Value retrieves the value for this key from the context.
func (k ContextKey) Value(ctx context.Context) (any, bool) {
	v := ctx.Value(k)
	return v, v != nil
}

// WriteJSON serialises v as JSON and writes it to the response with the given status.
func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(v)
	if err != nil {
		http.Error(w, "failed to encode JSON", http.StatusInternalServerError)
	}
}

// WriteError writes a JSON error response with the given status, message, and error code.
func WriteError(w http.ResponseWriter, status int, msg, code string) {
	body := map[string]string{
		"error": msg,
		"code":  code,
	}
	WriteJSON(w, status, body)
}
