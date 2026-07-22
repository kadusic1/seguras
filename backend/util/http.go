package util

import (
	"context"
	"encoding/json"
	"net/http"
)

type ContextKey string

func (k ContextKey) WithValue(ctx context.Context, val any) context.Context {
	return context.WithValue(ctx, k, val)
}

func (k ContextKey) Value(ctx context.Context) (any, bool) {
	v := ctx.Value(k)
	return v, v != nil
}

func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(v)
	if err != nil {
		http.Error(w, "failed to encode JSON", http.StatusInternalServerError)
	}
}

func WriteError(w http.ResponseWriter, status int, msg, code string) {
	body := map[string]string{
		"error": msg,
		"code":  code,
	}
	WriteJSON(w, status, body)
}
