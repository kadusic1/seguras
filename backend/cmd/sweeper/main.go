// Command sweeper deletes objects from the B2 bucket that are no longer
// referenced by any database row. It is meant to run on a schedule (cron,
// systemd timer) and to be safe to run manually.
package main

import (
	"context"
	"flag"
	"log"
	"time"

	"github.com/joho/godotenv"

	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/database"
	"github.com/kadusic1/seguras/backend/services"
)

func main() {
	dryRun := flag.Bool("dry-run", false,
		"list objects that would be deleted without deleting them")
	flag.Parse()

	if err := godotenv.Load(); err != nil {
		log.Fatalf("failed to load .env file: %v", err)
	}

	grace := config.GetEnv("ORPHAN_GRACE", "24h")
	orphanGrace, err := time.ParseDuration(grace)
	if err != nil {
		log.Fatalf("config: ORPHAN_GRACE invalid: %v", err)
	}

	dbCfg, err := config.LoadDB()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	db, err := config.OpenDB(dbCfg.DSN)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("failed to close database connection: %v", err)
		}
	}()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	b2Service, err := services.NewB2Service(context.Background())
	if err != nil {
		log.Fatalf("b2 service: %v", err)
	}

	referenced, err := database.NewB2KeyLister(db).ListReferencedKeys(
		context.Background(),
	)
	if err != nil {
		log.Fatalf("failed to list referenced keys: %v", err)
	}
	referencedSet := make(map[string]struct{}, len(referenced))
	for _, key := range referenced {
		referencedSet[key] = struct{}{}
	}

	objects, err := b2Service.ListObjects(context.Background())
	if err != nil {
		log.Fatalf("failed to list bucket objects: %v", err)
	}

	cutoff := time.Now().Add(-orphanGrace)
	var orphans []string
	var skipped int
	for _, obj := range objects {
		if _, ok := referencedSet[obj.Key]; ok {
			continue
		}
		if obj.LastModified.After(cutoff) {
			skipped++
			continue
		}
		orphans = append(orphans, obj.Key)
	}

	if *dryRun {
		log.Printf(
			"dry run: %d object(s) would be deleted, %d kept (recent), "+
				"%d referenced",
			len(orphans), skipped, len(referencedSet),
		)
		for _, key := range orphans {
			log.Printf("would delete %s", key)
		}
		return
	}

	if len(orphans) > 0 {
		if err := b2Service.DeleteObjects(context.Background(), orphans); err != nil {
			log.Fatalf("failed to delete objects: %v", err)
		}
	}

	log.Printf(
		"deleted %d object(s), kept %d (recent), %d referenced",
		len(orphans), skipped, len(referencedSet),
	)
}
