package config

// ServerConfig holds HTTP server settings.
type ServerConfig struct {
	Port       string
	CORSOrigin string
}

// LoadServer reads server configuration from the environment.
func LoadServer() *ServerConfig {
	return &ServerConfig{
		Port:       GetEnv("PORT", "8080"),
		CORSOrigin: GetEnv("CORS_ORIGIN", "http://localhost:3000"),
	}
}
