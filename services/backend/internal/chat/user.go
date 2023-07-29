package chat

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID      string
	Name    string
	Addr    string
	EnterAt time.Time
}

func newUser(name string, addr string) *User {
	return &User{
		ID:      uuid.NewString(),
		Name:    name,
		Addr:    addr,
		EnterAt: time.Now(),
	}
}
