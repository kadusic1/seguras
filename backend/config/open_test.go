package config

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/kadusic1/seguras/backend/util"
)

// TestOpenDBReadsTimestampsAsUTC pins the invariant that every database
// connection reads and writes TIMESTAMP columns as UTC wall-clock,
// regardless of the server's default timezone. It requires a running
// MariaDB/MySQL instance and is skipped unless TEST_DB_DSN is set.
//
// On a server whose session timezone is not UTC (e.g. CEST), a connection
// without the pinned session timezone shifts TIMESTAMP values by the zone
// offset into the future, which made time.Since() negative and TimeAgo
// report "1m ago" for every item.
func TestOpenDBReadsTimestampsAsUTC(t *testing.T) {
	dsn := os.Getenv("TEST_DB_DSN")
	if dsn == "" {
		t.Skip("TEST_DB_DSN not set; skipping database integration test")
	}

	db, err := OpenDB(dsn)
	if err != nil {
		t.Fatalf("OpenDB: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			t.Errorf("close db: %v", err)
		}
	}()

	ctx := context.Background()
	conn, err := db.Conn(ctx)
	if err != nil {
		t.Fatalf("db.Conn: %v", err)
	}
	defer func() {
		if err := conn.Close(); err != nil {
			t.Errorf("close conn: %v", err)
		}
	}()

	if _, err := conn.ExecContext(ctx,
		`CREATE TEMPORARY TABLE tz_probe (
			id INT PRIMARY KEY,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`); err != nil {
		t.Fatalf("create temporary table: %v", err)
	}

	if _, err := conn.ExecContext(ctx,
		`INSERT INTO tz_probe (id) VALUES (1)`); err != nil {
		t.Fatalf("insert fresh row: %v", err)
	}

	var fresh time.Time
	if err := conn.QueryRowContext(ctx,
		`SELECT created_at FROM tz_probe WHERE id = 1`,
	).Scan(&fresh); err != nil {
		t.Fatalf("scan fresh row: %v", err)
	}

	age := time.Since(fresh)
	if age < 0 || age > 2*time.Minute {
		t.Fatalf("fresh created_at %s is not in the recent past (age %s); "+
			"session timezone is likely not UTC", fresh, age)
	}
	if fresh.Location() != time.UTC {
		t.Fatalf("fresh created_at parsed in %s, want UTC",
			fresh.Location())
	}

	if _, err := conn.ExecContext(ctx,
		`INSERT INTO tz_probe (id, created_at)
		 VALUES (2, CURRENT_TIMESTAMP - INTERVAL 2 HOUR)`); err != nil {
		t.Fatalf("insert two-hour-old row: %v", err)
	}

	var old time.Time
	if err := conn.QueryRowContext(ctx,
		`SELECT created_at FROM tz_probe WHERE id = 2`,
	).Scan(&old); err != nil {
		t.Fatalf("scan two-hour-old row: %v", err)
	}

	if got := util.TimeAgo(old); got != "2h ago" {
		t.Fatalf("TimeAgo(two-hour-old row) = %q, want %q", got, "2h ago")
	}
}
