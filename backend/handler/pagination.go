package handler

import (
	"net/http"

	"github.com/kadusic1/seguras/backend/util"
)

// maxPerPage is the maximum page size accepted by list endpoints.
const maxPerPage = 100

// parsePageParams parses and validates the page and per_page query
// parameters against the given default page size, writing an error
// response and returning ok=false when validation fails.
func parsePageParams(
	w http.ResponseWriter, r *http.Request, defaultPerPage int,
) (page, perPage int, ok bool) {
	page, err := util.ParsePositiveInt(r.URL.Query().Get("page"), 1)
	if err != nil {
		util.WriteError(
			w, http.StatusBadRequest,
			"page must be a positive integer", "BAD_REQUEST",
		)
		return 0, 0, false
	}

	perPage, err = util.ParsePositiveInt(
		r.URL.Query().Get("per_page"), defaultPerPage,
	)
	if err != nil {
		util.WriteError(
			w, http.StatusBadRequest,
			"per_page must be a positive integer", "BAD_REQUEST",
		)
		return 0, 0, false
	}
	if perPage > maxPerPage {
		util.WriteError(
			w, http.StatusBadRequest,
			"per_page must not exceed 100", "BAD_REQUEST",
		)
		return 0, 0, false
	}

	return page, perPage, true
}
