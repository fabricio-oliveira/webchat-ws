package util

import (
	"os"
)

// Getenv get environment value by key if exist if not return the fallback
func Getenv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}

	return value
}
