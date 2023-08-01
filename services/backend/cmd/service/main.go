package main

import (
	"context"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"fabricio.oliveira.com/websocket/internal/config"
	"fabricio.oliveira.com/websocket/internal/logger"
	"github.com/gin-gonic/gin"
)

func main() {

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	router := gin.Default()
	config.Routes(router)

	srv := http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen: %s\n", err)
		}
	}()

	<-ctx.Done()
	logger.Info("shuting down")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	config.ReleaseResources(ctx)

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server Forced to shutdown")
	}

	logger.Info("Server exiting")
}
