package services

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/kadusic1/seguras/backend/config"
)

// B2Service uploads and deletes objects in a Backblaze B2 bucket using the
// AWS SDK for Go v2
type B2Service struct {
	client        *s3.Client
	presignClient *s3.PresignClient
	bucket        string
}

// NewB2Service creates a B2Service wrapping an S3 client configured for
// Backblaze B2, loading credentials from the environment.
func NewB2Service(ctx context.Context) (*B2Service, error) {
	cfg, err := config.LoadB2()
	if err != nil {
		return nil, err
	}

	awsCfg, err := awsconfig.LoadDefaultConfig(ctx,
		awsconfig.WithRegion(cfg.Region),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.KeyID, cfg.AppKey, "",
		)),
	)
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(cfg.Endpoint)
		o.UsePathStyle = true
	})

	presignClient := s3.NewPresignClient(client)

	return &B2Service{
		client: client, presignClient: presignClient, bucket: cfg.Bucket,
	}, nil
}

// B2Object describes an object stored in the bucket.
type B2Object struct {
	Key          string
	LastModified time.Time
}

// ListObjects returns every object currently in the bucket, paginating
// through the list API until the bucket is exhausted.
func (s *B2Service) ListObjects(
	ctx context.Context,
) ([]B2Object, error) {
	var objects []B2Object
	var token *string

	for {
		out, err := s.client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
			Bucket:            aws.String(s.bucket),
			ContinuationToken: token,
		})
		if err != nil {
			return nil, fmt.Errorf("list objects: %w", err)
		}

		for _, obj := range out.Contents {
			objects = append(objects, B2Object{
				Key:          aws.ToString(obj.Key),
				LastModified: aws.ToTime(obj.LastModified),
			})
		}

		if !aws.ToBool(out.IsTruncated) {
			return objects, nil
		}
		token = out.NextContinuationToken
	}
}

// DeleteObjects removes the given keys from the bucket in batches, since
// DeleteObjects accepts at most 1000 keys per request.
func (s *B2Service) DeleteObjects(
	ctx context.Context, keys []string,
) error {
	const batchSize = 1000

	for start := 0; start < len(keys); start += batchSize {
		end := min(start+batchSize, len(keys))
		identifiers := make([]types.ObjectIdentifier, 0, end-start)
		for _, key := range keys[start:end] {
			identifiers = append(identifiers, types.ObjectIdentifier{
				Key: aws.String(key),
			})
		}

		_, err := s.client.DeleteObjects(ctx, &s3.DeleteObjectsInput{
			Bucket: aws.String(s.bucket),
			Delete: &types.Delete{
				Objects: identifiers,
				Quiet:   aws.Bool(true),
			},
		})
		if err != nil {
			return fmt.Errorf("delete objects: %w", err)
		}
	}
	return nil
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

// PresignPutURL generates a presigned URL that allows a client to upload an
// object directly to the given key via HTTP PUT, valid for the given expiry.
func (s *B2Service) PresignPutURL(
	ctx context.Context, key string, expiry time.Duration,
) (string, error) {
	req, err := s.presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(expiry))
	if err != nil {
		return "", fmt.Errorf("presign put url %q: %w", key, err)
	}

	return req.URL, nil
}

// GetObject retrieves the object at the given key from the configured
// bucket, returning its body and content type.
func (s *B2Service) GetObject(
	ctx context.Context, key string,
) ([]byte, string, error) {
	out, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return nil, "", fmt.Errorf("get object %q: %w", key, err)
	}
	defer func() {
		_ = out.Body.Close()
	}()

	data, err := io.ReadAll(out.Body)
	if err != nil {
		return nil, "", fmt.Errorf("read object %q: %w", key, err)
	}

	contentType := ""
	if out.ContentType != nil {
		contentType = *out.ContentType
	}

	return data, contentType, nil
}

// PresignGetURL generates a presigned URL that allows downloading an
// object directly from the given key via HTTP GET, valid for the given expiry.
func (s *B2Service) PresignGetURL(
	ctx context.Context, key string, expiry time.Duration,
) (string, error) {
	req, err := s.presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(expiry))
	if err != nil {
		return "", fmt.Errorf("presign get url %q: %w", key, err)
	}

	return req.URL, nil
}
