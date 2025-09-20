/**
 * Logger utility for development and production.
 * Logs messages with a standardized ISO timestamp.
 * Logs can be strings or objects (objects are stringified).
 * Writes only to console, no file or HTTP transport.
 */
class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private formatMessage(level: string, message: string | object): string {
        const timestamp = this.getTimestamp();
        const content = typeof message === "string" ? message : JSON.stringify(message);
        return `[${level}] ${timestamp} - ${content}`;
    }

    log(message: string | object) {
        console.log(this.formatMessage("LOG", message));
    }

    info(message: string | object) {
        console.info(this.formatMessage("INFO", message));
    }

    warn(message: string | object) {
        console.warn(this.formatMessage("WARN", message));
    }

    debug(message: string | object) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(this.formatMessage("DEBUG", message));
        }
    }

    error(error: Error | unknown) {
        const timestamp = this.getTimestamp();
        if (error instanceof Error) {
            console.error(`[ERROR] ${timestamp} - ${error.stack || error.message}`);
        } else {
            console.error(`[ERROR] ${timestamp} - ${JSON.stringify(error)}`);
        }
    }
}

/**
 * Singleton logger instance.
 */
const logger = new Logger();
export default logger;
