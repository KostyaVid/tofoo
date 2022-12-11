import { NextFunction, Request, Response } from 'express';
import logger from './../utils/logger';

export default function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const date = Date.now();
  next();
  logger.info(
    `Time: ${new Date().toISOString()}. Method: ${req.method}. Path: ${req.path}. Duration: ${
      Date.now() - date
    }ms`,
  );
}
