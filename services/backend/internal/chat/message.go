package chat

import "time"

const (
	CMD_NEW_USER = "NEW_USER"
	CMD_WELCOME  = "WELCOME"
	CMD_TEXT     = "TEXT"
)

type message struct {
	ID string `json:"id"`

	UserId string `json:"user_id"`
	Name   string `json:"name"`

	Command string `json:"command"`

	Text   string                 `json:"text"`
	Params map[string]interface{} `json:"params"`

	CreatedAt time.Time `json:"created_at"`
}
