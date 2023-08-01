package chat

import "fabricio.oliveira.com/websocket/internal/logger"

const DEFAULT_HUB_NAME = "default"
const USER_SERVER = "SERVER"

var defaultHub *Hub = newHub(DEFAULT_HUB_NAME)
var hubs map[string]*Hub = map[string]*Hub{defaultHub.ID: defaultHub}
var serverUser = newUser(USER_SERVER, "127.0.0.1")

func init() {
	go defaultHub.run()
	logger.Info("default hub ID %+v", defaultHub.ID)
}
