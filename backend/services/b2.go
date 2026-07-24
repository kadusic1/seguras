package services

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// B2Config holds the credentials and settings needed to talk to a
// Backblaze B2 bucket through its S3-compatible API.
type B2Config struct {
	// Endpoint is the S3-compatible endpoint for your bucket's region,
	// e.g. "https://s3.us-west-004.backblazeb2.com".
	Endpoint string
	// Region is the B2 region, e.g. "us-west-004".
	Region string
	// KeyID is the Backblaze application key ID.
	KeyID string
	// AppKey is the Backblaze application key secret.
	AppKey string
	// Bucket is the default bucket name to operate on.
	Bucket string
}

// B2Service uploads and deletes objects in a Backblaze B2 bucket using the
// AWS SDK for Go v2
type B2Service struct {
	client *s3.Client
	bucket string
}

// NewB2Service creates a B2Service wrapping an S3 client configured for
// Backblaze B2, given the provided B2Config.
func NewB2Service(ctx context.Context, cfg B2Config) (*B2Service, error) {
	awsCfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(cfg.Region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.KeyID, cfg.AppKey, "",
		)),
	)
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(cfg.Endpoint)
		// B2's S3-compatible API works with virtual-hosted or path style;
		// path style is the safer default across custom endpoints.
		o.UsePathStyle = true
	})

	return &B2Service{client: client, bucket: cfg.Bucket}, nil
}

// UploadFile uploads data to the given key (object path) in the configured
// bucket, setting the provided content type.
func (s *B2Service) UploadFile(
	ctx context.Context, key string, data []byte, contentType string,
) error {
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        bytes.NewReader(data),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return fmt.Errorf("upload file %q: %w", key, err)
	}
	return nil
}

// UploadFileAsync is a fire-and-forget wrapper around UploadFile that runs in a
// background goroutine and logs errors instead of returning them.
func (s *B2Service) UploadFileAsync(key string, data []byte, contentType string) {
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		if err := s.UploadFile(ctx, key, data, contentType); err != nil {
			log.Printf("b2 upload failed: %v", err)
		}
	}()
}

// DeleteFileAsync is a fire-and-forget wrapper around DeleteFile that runs in a
// background goroutine and logs errors instead of returning them.
func (s *B2Service) DeleteFileAsync(key string) {
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		if err := s.DeleteFile(ctx, key); err != nil {
			log.Printf("b2 delete failed: %v", err)
		}
	}()
}

// DeleteFile removes the object at the given key from the configured bucket.
func (s *B2Service) DeleteFile(ctx context.Context, key string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("delete file %q: %w", key, err)
	}
	return nil
}
