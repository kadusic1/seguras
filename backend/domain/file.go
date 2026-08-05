package domain

// FileUploadRequest is the expected JSON body for requesting a presigned
// file upload URL.
type FileUploadRequest struct {
	Filename    string `json:"filename"`
	ContentType string `json:"content_type"`
	Size        int64  `json:"size"`
}

// FileUploadResponse is the JSON envelope returned with a presigned upload
// URL and the storage key to use with it.
type FileUploadResponse struct {
	UploadURL string `json:"upload_url"`
	Key       string `json:"key"`
}
