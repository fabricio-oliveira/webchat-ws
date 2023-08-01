package chat

import (
	"net/http"

	"fabricio.oliveira.com/websocket/internal/logger"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func wsHub(c *gin.Context) {
	hubID := c.Param("id")
	logger.Debug("hub ID %s", hubID)
	var hub *Hub

	if hubID == "default" {
		hub = defaultHub
	} else {
		var ok bool
		hub, ok = hubs[hubID]
		if !ok {
			c.JSON(http.StatusNotFound, map[string]interface{}{"msg": "hub not found"})
			return
		}
	}
	logger.Debug("Hub  %+v", hub)
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	// get user name of chat
	name := c.Query("name")
	if name == "" {
		name = "anonymous"
	}

	if err != nil {
		logger.Error("fail enable ws for your connection")
		return
	}
	client := newClient(hub, conn, name)
	hub.initClient(client)
}

func listHub(c *gin.Context) {
	result := []HubID{}

	for _, v := range hubs {
		result = append(result, v.HubID)
	}

	c.JSON(http.StatusOK, result)
}

func createHub(c *gin.Context) {
	hubID := HubID{}

	err := c.ShouldBindJSON(&hubID)
	if err != nil {
		logger.Info("Fail to parse payload to create a new Hub: %s", err.Error())
	}

	hub := newHub(hubID.Name)
	go hub.run()

	hubs[hub.ID] = hub
	c.JSON(http.StatusOK, hub.HubID)
}

func deleteHub(c *gin.Context) {
	id := c.Param("id")
	logger.Debug("hub ID %s", id)

	hub := hubs[id]
	if hub == nil {
		c.JSON(http.StatusNotFound, map[string]string{"msg": "hub not found"})
		return
	}

	if hub.Name == DEFAULT_HUB_NAME {
		c.JSON(http.StatusForbidden, map[string]string{"msg": "protected hub, not allowed to delete"})
		return
	}

	hub.close()
	c.Status(http.StatusOK)
}

func Routes(router *gin.RouterGroup) {
	router.GET("/chats/:id", wsHub)
	router.GET("/chats", listHub)
	router.POST("/chats", createHub)
	router.DELETE("/chats/:id", deleteHub)
}

func Close() {
	for _, hub := range hubs {
		hub.close()
	}
}
