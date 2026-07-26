package config

// B2Config holds Backblaze B2 credentials and bucket settings.
type B2Config struct {
	Endpoint string
	Region   string
	KeyID    string
	AppKey   string
	Bucket   string
}

// LoadB2 reads Backblaze B2 configuration from the environment.
func LoadB2() (*B2Config, error) {
	endpoint, err := MustEnv("B2_ENDPOINT")
	if err != nil {
		return nil, err
	}
	region, err := MustEnv("B2_REGION")
	if err != nil {
		return nil, err
	}
	keyID, err := MustEnv("B2_KEY_ID")
	if err != nil {
		return nil, err
	}
	appKey, err := MustEnv("B2_APP_KEY")
	if err != nil {
		return nil, err
	}
	bucket, err := MustEnv("B2_BUCKET")
	if err != nil {
		return nil, err
	}
	return &B2Config{
		Endpoint: endpoint,
		Region:   region,
		KeyID:    keyID,
		AppKey:   appKey,
		Bucket:   bucket,
	}, nil
}
