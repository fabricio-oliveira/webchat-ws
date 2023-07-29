package chat

import (
	"bytes"
	"encoding/json"
	"log"
	"time"

	"fabricio.oliveira.com/websocket/internal/logger"
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
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, messageTxt, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		messageTxt = bytes.TrimSpace(bytes.Replace(messageTxt, newline, space, -1))
		logger.Debug("Message received, userId %s: %s", c.User.ID, messageTxt)
		c.hub.broadcast <- message{Text: string(messageTxt), UserId: c.User.ID, Name: c.User.Name}
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
			logger.Debug("received Message %+v, %v", string(message.Text), ok)
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

			// // Add queued chat messages to the current websocket message.
			// n := len(c.inbound)
			// for i := 0; i < n; i++ {
			// 	otherMessageTxt := <-c.inbound
			// 	data, err = json.Marshal(otherMessageTxt)
			// 	if err != nil {
			// 		// The hub closed the channel.
			// 		c.conn.WriteMessage(websocket.CloseMessage, []byte{})
			// 		return
			// 	}

			// 	w.Write(newline)
			// 	w.Write(data)
			// }

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			logger.Debug("ticker")
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
