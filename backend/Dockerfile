# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.25 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /seguras-backend ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux go build -o /seguras-cron ./cmd/sweeper

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /seguras-backend /seguras-backend
COPY --from=build-stage /seguras-cron /seguras-cron

EXPOSE 8080

USER nonroot:nonroot

CMD ["/seguras-backend"]
