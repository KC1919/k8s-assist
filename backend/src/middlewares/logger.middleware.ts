import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * Simple request logging middleware that logs HTTP method and URL.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info({ method: req.method, url: req.originalUrl });
    next();
}