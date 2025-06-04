type LogLevel = "debug" | "info" | "warn" | "error"

class Logger {
  private logToConsole(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString()
    const metaString = meta ? JSON.stringify(meta) : ""

    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}`)

    // In a production environment, you would send logs to a service like Datadog, Sentry, etc.
  }

  debug(message: string, meta?: any) {
    this.logToConsole("debug", message, meta)
  }

  info(message: string, meta?: any) {
    this.logToConsole("info", message, meta)
  }

  warn(message: string, meta?: any) {
    this.logToConsole("warn", message, meta)
  }

  error(message: string, meta?: any) {
    this.logToConsole("error", message, meta)

    // In a production environment, you would send errors to an error tracking service
    // like Sentry
  }
}

export const logger = new Logger()
