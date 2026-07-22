.PHONY: all frontend backend clean

all: frontend backend

frontend:
	gnome-terminal --tab --title="frontend" -- bash -c "cd frontend && bun run dev; exec bash"

backend:
	gnome-terminal --tab --title="backend" -- bash -c "cd backend && go run cmd/server/main.go; exec bash"

clean:
	-pkill -f "bun run dev"
	-pkill -f "go run cmd/server/main.go"
