package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

const maxFileSize = 10 << 20 // 10 MB

var fileExtRe = regexp.MustCompile(`^[a-z0-9]{1,10}$`)

// FileHandler serves presigned upload and delete operations for any file a
// form needs to collect, independent of the feature that form belongs to.
type FileHandler struct {
	b2Service     *services.B2Service
	presignExpiry time.Duration
}

func NewFileHandler(
	b2Service *services.B2Service,
	presignExpiry time.Duration,
) *FileHandler {
	return &FileHandler{
		b2Service:     b2Service,
		presignExpiry: presignExpiry,
	}
}

// sanitizeExt returns a lowercase alphanumeric extension (max 10 chars)
// derived from the given filename, falling back to "bin" when none is safe.
func sanitizeExt(filename string) string {
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(filename), "."))
	if !fileExtRe.MatchString(ext) {
		return "bin"
	}
	return ext
}

// PresignUpload validates a file size and returns a presigned URL the
// client can PUT the file to, along with the storage key for later use.
func (h *FileHandler) PresignUpload(w http.ResponseWriter, r *http.Request) {
	var req domain.FileUploadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteError(
			w, http.StatusBadRequest, "invalid JSON body", "BAD_REQUEST",
		)
		return
	}

	if req.Size <= 0 {
		util.WriteError(
			w, http.StatusBadRequest, "invalid file size", "BAD_REQUEST",
		)
		return
	}

	if req.Size > maxFileSize {
		util.WriteError(
			w, http.StatusBadRequest,
			"file size must not exceed 10 MB",
			"BAD_REQUEST",
		)
		return
	}

	if len(req.Filename) > 255 {
		util.WriteError(
			w, http.StatusBadRequest,
			"filename must not exceed 255 characters",
			"BAD_REQUEST",
		)
		return
	}

	key := uuid.New().String() + "." + sanitizeExt(req.Filename)
	presignedURL, err := h.b2Service.PresignPutURL(
		r.Context(), key, h.presignExpiry,
	)
	if err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to generate presigned URL",
			"SERVER_ERROR",
		)
		return
	}

	util.WriteJSON(w, http.StatusOK, domain.FileUploadResponse{
		UploadURL: presignedURL,
		Key:       key,
	})
}

// Delete removes the object stored under the given key.
func (h *FileHandler) Delete(w http.ResponseWriter, r *http.Request) {
	key := chi.URLParam(r, "key")
	if key == "" {
		util.WriteError(
			w, http.StatusBadRequest, "key is required", "BAD_REQUEST",
		)
		return
	}

	if err := h.b2Service.DeleteFile(r.Context(), key); err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			fmt.Sprintf("failed to delete file: %v", err),
			"SERVER_ERROR",
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
