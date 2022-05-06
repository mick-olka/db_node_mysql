"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericErrorHandler = exports.notFoundError = void 0;
/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
const notFoundError = (req, res, next) => {
    // eslint-disable-line no-unused-vars
    res.status(404).json({
        error: {
            code: 404,
            message: "Not_Found",
        },
    });
};
exports.notFoundError = notFoundError;
/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const genericErrorHandler = (err, req, res, next) => {
    if (err.stack) {
        process.stdout.write('Error stack trace: ', err.stack);
    }
    res.status(500).json({ error: {
            code: 500,
            message: "Server Error",
        }, });
};
exports.genericErrorHandler = genericErrorHandler;
