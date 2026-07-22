package auth

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/kadusic1/seguras/backend/util"
)

var userIDKey = util.ContextKey("user_id")

// UserIDFromContext extracts the authenticated user ID from the context.
func UserIDFromContext(ctx context.Context) (int, bool) {
	v, ok := userIDKey.Value(ctx)
	if !ok {
		return 0, false
	}
	id, ok := v.(int)
	return id, ok
}

// AuthMiddleware returns a middleware that validates a Bearer access token and
// injects the user ID into the request context.
func AuthMiddleware(jwtService *JWTService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if header == "" {
				util.WriteError(w, http.StatusUnauthorized, "missing authorization header", "UNAUTHORIZED")
				return
			}

			parts := strings.SplitN(header, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
				util.WriteError(w, http.StatusUnauthorized, "invalid authorization header", "UNAUTHORIZED")
				return
			}

			claims, err := jwtService.ParseAndValidateAccessToken(parts[1])
			if err != nil {
				util.WriteError(w, http.StatusUnauthorized, "invalid or expired token", "UNAUTHORIZED")
				return
			}

			userID, err := strconv.Atoi(strings.TrimPrefix(claims.Subject, "access:"))
			if err != nil {
				util.WriteError(w, http.StatusUnauthorized, "invalid token payload", "UNAUTHORIZED")
				return
			}

			ctx := userIDKey.WithValue(r.Context(), userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
