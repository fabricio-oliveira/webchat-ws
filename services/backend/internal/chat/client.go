package chat

import (
	"bytes"
	"encoding/json"
	"time"

	"fabricio.oliveira.com/websocket/internal/logger"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512

	// Maximum message concurrent
	maxMessageConcurrently = 32
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

type client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	inbound chan message

	User
}

func newClient(hub *Hub, conn *websocket.Conn, name string) *client {
	return &client{
		hub:     hub,
		conn:    conn,
		inbound: make(chan message, 32),
		User:    *newUser(name, conn.RemoteAddr().String()),
	}
}

func (c *client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.notifyLeave()
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, messageTxt, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logger.Error("Unexpected close %+v", err)
			}
			break
		}
		messageTxt = bytes.TrimSpace(bytes.Replace(messageTxt, newline, space, -1))
		logger.Debug("Read Message %s, %+v", c.User.Name, string(messageTxt))
		c.notifyText(messageTxt)
	}
}

func (c *client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.inbound:
			logger.Debug("write Message %s, %+v", c.User.Name, string(message.Text))
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			data, err := json.Marshal(message)
			if err != nil {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w.Write(data)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			logger.Debug("ticker %+v", time.Now())
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *client) notifyLeave() {
	logger.Debug("notifyLeave %s", c.Name)
	c.hub.broadcast <- message{
		ID:     uuid.NewString(),
		UserId: serverUser.ID,
		Name:   serverUser.Name,
		Params: map[string]interface{}{
			"id":   c.ID,
			"name": c.Name,
		},
		Command:   CMD_USER_LEAVE,
		TimeStamp: time.Now()}
}

func (c *client) notifyEnter() {
	logger.Debug("notifyEnter %s", c.Name)
	c.hub.broadcast <- message{
		ID:      uuid.NewString(),
		UserId:  serverUser.ID,
		Name:    serverUser.Name,
		Command: CMD_NEW_USER,
		Params: map[string]interface{}{
			"id":   c.ID,
			"name": c.Name,
		},
		TimeStamp: time.Now(),
	}
}

func (c *client) notifyWelcome() {
	logger.Debug("notifyEnter  %s", c.Name)
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
		TimeStamp: time.Now()}
}

func (c *client) notifyText(txt []byte) {
	c.hub.broadcast <- message{
		ID:        uuid.NewString(),
		Text:      string(txt),
		UserId:    c.User.ID,
		Name:      c.User.Name,
		Command:   CMD_TEXT,
		TimeStamp: time.Now(),
	}
}
