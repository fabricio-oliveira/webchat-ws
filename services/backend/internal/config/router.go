package config

import (
	"context"

	"fabricio.oliveira.com/websocket/internal/chat"
	"fabricio.oliveira.com/websocket/internal/healthcheck"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	// rootpath endpoint
	healthcheck.Routes(router)

	v1 := router.Group("api/v1")
	// ws
	chat.Routes(v1)
}

func ReleaseResources(_ context.Context) {
	chat.Close()
}
