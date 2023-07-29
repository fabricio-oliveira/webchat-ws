package chat

import "time"

type message struct {
	UserId string

	Name string

	Text string

	CreatedAt time.Time
}
