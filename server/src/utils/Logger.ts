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

    private isTest(): boolean {
        return process.env.NODE_ENV === "test";
    }

    log(message: string | object) {
        if (this.isTest()) return;
        console.log(this.formatMessage("LOG", message));
    }

    info(message: string | object) {
        if (this.isTest()) return;
        console.info(this.formatMessage("INFO", message));
    }

    warn(message: string | object) {
        if (this.isTest()) return;
        console.warn(this.formatMessage("WARN", message));
    }

    debug(message: string | object) {
        if (process.env.NODE_ENV === "production" || this.isTest()) return;
        console.debug(this.formatMessage("DEBUG", message));
    }

    error(error: Error | unknown) {
        if (this.isTest()) return;
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
