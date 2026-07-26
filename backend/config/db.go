package config

// DBConfig holds database connection settings.
type DBConfig struct {
	DSN string
}

// LoadDB reads database configuration from the environment.
func LoadDB() (*DBConfig, error) {
	dsn, err := MustEnv("DB_DSN")
	if err != nil {
		return nil, err
	}
	return &DBConfig{DSN: dsn}, nil
}
