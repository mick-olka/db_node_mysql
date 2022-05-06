
import { NextFunction, Request, Response } from 'express';

/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // eslint-disable-line no-unused-vars
  res.status(404).json({
    error: {
      code: 404,
      message: "Not_Found",
    },
  });
};

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const genericErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.stack) {
    process.stdout.write('Error stack trace: ', err.stack);
  }
  res.status(500).json({ error: {
      code: 500,
      message: "Server Error",
    }, });
};
