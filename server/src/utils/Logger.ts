/**
 * Logger utility for development.
 * Logs messages with time in seconds since process uptime for easier debugging.
 */
class Logger {
    log(message: string) {
        console.log(`[LOG] ${this.time()} - ${message}`);
    }

    info(message: string) {
        console.info(`[INFO] ${this.time()} - ${message}`);
    }

    warn(message: string) {
        console.warn(`[WARN] ${this.time()} - ${message}`);
    }

    error(error: Error) {
        console.error(
            `[ERROR] ${this.time()} - ${error.stack || error.message}`
        );
    }

    time(): string {
        const totalSeconds = Math.floor(process.uptime());
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds}`;
    }
}

/**
 * Singleton logger instance.
 */
const logger = new Logger();
export default logger;
