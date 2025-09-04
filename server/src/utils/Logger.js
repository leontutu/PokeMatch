/**
 * Logger utility for development.
 * Logs messages with time in seconds since process uptime for easier debugging.
 * Implements a singleton pattern.
 */
class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }
        Logger.instance = this;
    }

    log(message) {
        console.log(`[LOG] ${this.time()} - ${message}`);
    }

    info(message) {
        console.info(`[INFO] ${this.time()} - ${message}`);
    }

    warn(message) {
        console.warn(`[WARN] ${this.time()} - ${message}`);
    }

    error(message, error) {
        console.error(`[ERROR] ${this.time()} - ${message}`, error.message);
    }

    time() {
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
