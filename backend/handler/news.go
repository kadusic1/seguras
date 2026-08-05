package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/services"
	"github.com/kadusic1/seguras/backend/util"
)

const (
	defaultNewsPerPage = 10
	maxNewsPerPage     = 100
	presignExpiry      = 15 * time.Minute
)

// NewsHandler serves news articles and their images.
type NewsHandler struct {
	newsStore *database.NewsStore
	b2Service *services.B2Service
}

func NewNewsHandler(
	newsStore *database.NewsStore,
	b2Service *services.B2Service,
) (*NewsHandler, error) {
	return &NewsHandler{
		newsStore: newsStore,
		b2Service: b2Service,
	}, nil
}

// List returns one page of news with presigned URLs for all images.
func (h *NewsHandler) List(w http.ResponseWriter, r *http.Request) {
	page, err := parsePositiveInt(r.URL.Query().Get("page"), 1)
	if err != nil {
		util.WriteError(
			w, http.StatusBadRequest, "page must be a positive integer",
			"BAD_REQUEST",
		)
		return
	}

	perPage, err := parsePositiveInt(
		r.URL.Query().Get("per_page"), defaultNewsPerPage,
	)
	if err != nil {
		util.WriteError(
			w, http.StatusBadRequest,
			"per_page must be a positive integer",
			"BAD_REQUEST",
		)
		return
	}
	if perPage > maxNewsPerPage {
		util.WriteError(
			w, http.StatusBadRequest,
			"per_page must not exceed 100",
			"BAD_REQUEST",
		)
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

	resp := domain.NewsListResponse{
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

// parsePositiveInt parses s as an int, returning def when s is empty and
// an error when s is present but not a positive integer.
func parsePositiveInt(s string, def int) (int, error) {
	if s == "" {
		return def, nil
	}
	n, err := strconv.Atoi(s)
	if err != nil || n < 1 {
		return 0, err
	}
	return n, nil
}
