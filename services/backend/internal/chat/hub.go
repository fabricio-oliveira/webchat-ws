package chat

import (
	"encoding/json"
	"time"

	"fabricio.oliveira.com/websocket/internal/logger"
	"github.com/google/uuid"
)

type HubID struct {
	// ID of hub
	ID string `json:"id"`

	// Name of hub
	Name string `json:"name"`

	// Created
	CreatedAt time.Time
}

func (h *HubID) UnmarshalJSON(b []byte) error {
	var tmp struct {
		Name string `json:"name"`
	}

	err := json.Unmarshal(b, &tmp)
	if err != nil {
		return err
	}
	h.Name = tmp.Name
	return nil
}

type Hub struct {
	HubID

	// Registered clients.
	clients map[*client]bool

	// Inbound messages from the clients.
	broadcast chan message

	// Register requests from the clients.
	register chan *client

	// Unregister requests from clients.
	unregister chan *client
}

var serverUser = newUser("Server", "127.0.0.1")

func newHub(name string) *Hub {
	return &Hub{
		HubID: HubID{
			ID:        uuid.NewString(),
			Name:      name,
			CreatedAt: time.Now(),
		},
		broadcast:  make(chan message),
		register:   make(chan *client),
		unregister: make(chan *client),
		clients:    make(map[*client]bool),
	}
}

func (h *Hub) initClient(c *client) {
	logger.Debug("new Client %+v", c.User)
	h.register <- c

	go c.writePump()
	go c.readPump()

	users := []map[string]interface{}{}
	for cl := range c.hub.clients {
		if c.ID == cl.ID {
			continue
		}

		users = append(users,
			map[string]interface{}{
				"id":   cl.ID,
				"name": cl.Name,
			})
	}

	c.inbound <- message{
		ID:      uuid.NewString(),
		UserId:  serverUser.ID,
		Name:    serverUser.Name,
		Text:    "Welcome",
		Command: CMD_WELCOME,
		Params: map[string]interface{}{
			"id":    c.ID,
			"name":  c.Name,
			"users": users,
		},
		CreatedAt: time.Now()}

	c.hub.broadcast <- message{
		ID:      uuid.NewString(),
		UserId:  serverUser.ID,
		Name:    serverUser.Name,
		Command: CMD_NEW_USER,
		Params: map[string]interface{}{
			"id":   c.ID,
			"name": c.Name,
		},
		CreatedAt: time.Now()}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			logger.Debug("register new client %+v", client)
			h.clients[client] = true
		case client := <-h.unregister:
			logger.Debug("unregister client %+v", client)
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.inbound)
			}
		case message := <-h.broadcast:
			for client, more := range h.clients {
				if more {
					rules(client, &message)
				} else {
					close(client.inbound)
					delete(h.clients, client)
				}
			}
		}
	}
}

func rules(c *client, m *message) {
	logger.Debug("rules message received: %+v, %+v", c.User, m)
	switch m.Command {
	case CMD_NEW_USER:
		id := m.Params["id"].(string)
		if c.User.ID != id {
			c.inbound <- *m
		}
	default:
		c.inbound <- *m
	}
}
