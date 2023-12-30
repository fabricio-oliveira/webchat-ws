FROM golang:1.20-alpine as builder

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest

COPY . ./
RUN go mod download
RUN go build -o build/service ./cmd/service

FROM alpine:3.19
WORKDIR /app

COPY --from=0 /app/build/service /app

EXPOSE 8080

CMD ["./service"]