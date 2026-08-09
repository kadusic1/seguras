package handler

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

const presignExpiry = 15 * time.Minute

// NewsHandler serves news articles and their images.
type NewsHandler struct {
	newsStore      *database.NewsStore
	b2Service      *services.B2Service
	defaultPerPage int
}

func NewNewsHandler(
	newsStore *database.NewsStore,
	b2Service *services.B2Service,
	defaultPerPage int,
) (*NewsHandler, error) {
	return &NewsHandler{
		newsStore:      newsStore,
		b2Service:      b2Service,
		defaultPerPage: defaultPerPage,
	}, nil
}

// List returns one page of news with presigned URLs for all images.
func (h *NewsHandler) List(w http.ResponseWriter, r *http.Request) {
	page, perPage, ok := parsePageParams(w, r, h.defaultPerPage)
	if !ok {
		return
	}

	items, total, err := h.newsStore.List(r.Context(), page, perPage)
	if err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to list news", "SERVER_ERROR",
		)
		return
	}

	resp := domain.PaginatedResponse[domain.NewsItemResponse]{
		Items:   make([]domain.NewsItemResponse, 0, len(items)),
		Total:   total,
		Page:    page,
		PerPage: perPage,
	}
	for _, item := range items {
		newsItem := domain.NewsItemResponse{
			ID:        item.ID,
			Heading:   item.Heading,
			Text:      item.Text,
			CreatedAt: item.CreatedAt,
			TimeAgo:   util.TimeAgo(item.CreatedAt),
			Images:    make([]domain.NewsImageResponse, 0, len(item.Images)),
		}
		for _, img := range item.Images {
			url, err := h.b2Service.PresignGetURL(
				r.Context(), img.ImageKey, presignExpiry,
			)
			if err != nil {
				util.WriteError(
					w, http.StatusInternalServerError,
					"failed to generate image URL", "SERVER_ERROR",
				)
				return
			}
			newsItem.Images = append(newsItem.Images, domain.NewsImageResponse{
				ID:           img.ID,
				URL:          url,
				DisplayOrder: img.DisplayOrder,
			})
		}
		resp.Items = append(resp.Items, newsItem)
	}

	util.WriteJSON(w, http.StatusOK, resp)
}

// Create stores a news article with its images and returns the created
// article with the image keys as provided by the client.
func (h *NewsHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateNewsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteError(
			w, http.StatusBadRequest, "invalid JSON body", "BAD_REQUEST",
		)
		return
	}

	req.Heading = strings.TrimSpace(req.Heading)
	req.Text = strings.TrimSpace(req.Text)

	if req.Heading == "" || req.Text == "" {
		util.WriteError(
			w, http.StatusBadRequest,
			"heading and text are required",
			"BAD_REQUEST",
		)
		return
	}

	if len(req.Heading) > 255 {
		util.WriteError(
			w, http.StatusBadRequest,
			"heading must not exceed 255 characters",
			"BAD_REQUEST",
		)
		return
	}

	if len(req.Text) > 65535 {
		util.WriteError(
			w, http.StatusBadRequest,
			"text must not exceed 65535 characters",
			"BAD_REQUEST",
		)
		return
	}

	images := make([]domain.NewsImage, 0, len(req.Images))
	for _, img := range req.Images {
		img.ImageKey = strings.TrimSpace(img.ImageKey)
		if img.ImageKey == "" || len(img.ImageKey) > 500 {
			util.WriteError(
				w, http.StatusBadRequest,
				"each image must have an image_key of at most 500 characters",
				"BAD_REQUEST",
			)
			return
		}
		if img.DisplayOrder < 0 {
			util.WriteError(
				w, http.StatusBadRequest,
				"display_order must not be negative",
				"BAD_REQUEST",
			)
			return
		}
		images = append(images, domain.NewsImage{
			ImageKey:     img.ImageKey,
			DisplayOrder: img.DisplayOrder,
		})
	}

	news := &domain.News{
		Heading: req.Heading,
		Text:    req.Text,
	}
	if err := h.newsStore.Create(r.Context(), news, images); err != nil {
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to create news", "SERVER_ERROR",
		)
		return
	}

	resp := domain.CreateNewsResponse{
		ID:        news.ID,
		Heading:   news.Heading,
		Text:      news.Text,
		CreatedAt: news.CreatedAt,
		Images:    make([]domain.CreateNewsImageResponse, 0, len(images)),
	}
	for _, img := range images {
		resp.Images = append(resp.Images, domain.CreateNewsImageResponse{
			ID:           img.ID,
			ImageKey:     img.ImageKey,
			DisplayOrder: img.DisplayOrder,
		})
	}

	util.WriteJSON(w, http.StatusCreated, resp)
}

// Delete removes a news article and its images, triggering non-blocking
// cleanup of the image objects in B2.
func (h *NewsHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil || id < 1 {
		util.WriteError(
			w, http.StatusBadRequest, "invalid news id", "BAD_REQUEST",
		)
		return
	}

	imageKeys, err := h.newsStore.Delete(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			util.WriteError(
				w, http.StatusNotFound, "news not found", "NOT_FOUND",
			)
			return
		}
		util.WriteError(
			w, http.StatusInternalServerError,
			"failed to delete news", "SERVER_ERROR",
		)
		return
	}

	for _, key := range imageKeys {
		h.b2Service.DeleteFileAsync(key)
	}

	w.WriteHeader(http.StatusNoContent)
}
