package config

import (
	"database/sql"
	"time"

	"github.com/go-sql-driver/mysql"
)

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

// OpenDB opens a database connection that stores and reads timestamps as
// UTC. The session timezone is pinned to +00:00 per connection and parsed
// time.Time values are stamped UTC, so TIMESTAMP columns round-trip as UTC
// wall-clock regardless of the server's default timezone.
func OpenDB(dsn string) (*sql.DB, error) {
	cfg, err := mysql.ParseDSN(dsn)
	if err != nil {
		return nil, err
	}
	cfg.ParseTime = true
	cfg.Loc = time.UTC
	if cfg.Params == nil {
		cfg.Params = make(map[string]string)
	}
	cfg.Params["time_zone"] = "'+00:00'"
	connector, err := mysql.NewConnector(cfg)
	if err != nil {
		return nil, err
	}
	return sql.OpenDB(connector), nil
}
