import pino from "pino";

/**
 * Application logger configured with pretty-printing and timestamp formatting.
 */
const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss.l o",
        },
    },
});

export default logger;