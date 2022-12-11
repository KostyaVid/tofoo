import { NextFunction, Request, Response } from 'express';
import logger from './../utils/logger';

import {
  BaseError,
  NotFoundError,
  InvalidArgError,
  AuthenticationError,
  ValidateError,
  EmailExistError,
} from './../utils/error';

/**
 *This middleware should connect last with app
 * @param err
 * @param req
 * @param res
 * @param next
 */
export default function errorMiddleware(
  err: BaseError,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction,
) {
  logger.error(`Time: ${new Date().toISOString()}. Error: ${err.message}`);
  if (err instanceof NotFoundError) {
    res.status(404);
    res.send({ massage: err.message });
    return;
  }
  if (err instanceof AuthenticationError) {
    res.status(401);
    res.send({ massage: err.message });
    return;
  }
  if (err instanceof InvalidArgError) {
    res.status(400);
    res.send({ massage: err.message });
    return;
  }

  if (err instanceof ValidateError) {
    res.status(400).send({ massage: err.message });
    return;
  }

  if (err instanceof EmailExistError) {
    res.status(400).send({ massage: err.message });
    return;
  }

  logger.error(err.stack);
  res.status(500);
  res.send({ massage: 'ServerError' });
}
