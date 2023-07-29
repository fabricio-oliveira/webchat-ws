package logger

import (
	"log"
	"os"

	"fabricio.oliveira.com/websocket/internal/util"
)

const (
	debug = "DEBUG"
	info  = "INFO"
	err   = "ERR"
	fatal = "FATAL"

	log_level = "LOG_LEVEL"

	log_level_debug = 3
	log_level_info  = 2
	log_level_err   = 1
	log_level_fatal = 0
)

var (
	logLevel int

	logInfo  *log.Logger
	logErr   *log.Logger
	logDebug *log.Logger
	logFatal *log.Logger
)

func init() {

	switch util.Getenv(log_level, debug) {
	case debug:
		logLevel = log_level_debug
	case info:
		logLevel = log_level_info
	case err:
		logLevel = log_level_err
	case fatal:
		logLevel = log_level_fatal
	default:
		logLevel = log_level_info
	}

	logDebug = log.New(os.Stdout, "DEBUG: ", log.Ldate|log.Ltime)
	logInfo = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime)
	logErr = log.New(os.Stdout, "ERROR: ", log.Ldate|log.Ltime)
	logFatal = log.New(os.Stdout, "FATAL: ", log.Ldate|log.Ltime)
}

func Debug(msg string, args ...interface{}) {
	if logLevel >= log_level_debug {
		logDebug.Printf(Yellow+"msg: "+msg+"\n"+Reset, args...)
	}
}

func Info(msg string, args ...interface{}) {
	if logLevel >= log_level_info {
		logInfo.Printf("msg: "+msg+"\n", args...)
	}
}

func Error(msg string, args ...interface{}) {
	if logLevel >= log_level_err {
		logErr.Printf(Red+"msg: "+msg+"\n"+Reset, args...)
	}
}

func Fatal(msg string, args ...interface{}) {
	if logLevel >= log_level_fatal {
		logFatal.Fatalf(Red+"msg: "+msg+"\n"+Reset, args...)
	}
}
