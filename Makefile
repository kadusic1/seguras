.PHONY: all frontend backend clean

all: frontend backend

frontend:
	gnome-terminal --tab --title="frontend" -- bash -c "cd frontend && bun run dev; exec bash"

backend:
	gnome-terminal --tab --title="backend" -- bash -c "cd backend && go run cmd/server/main.go; exec bash"

sweep:
	cd backend && go run cmd/sweeper/main.go -dry-run

clean:
	-pkill -f "bun run dev"
	-pkill -f "go run cmd/server/main.go"
