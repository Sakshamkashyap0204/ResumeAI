'use strict';

const { sendError } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const env = require('../config/env');

function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409);
}

function handleValidationError(err) {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new AppError('Validation failed', 422, errors);
}

function handleJWTError() {
  return new AppError('Invalid token. Please log in again.', 401);
}

function handleJWTExpiredError() {
  return new AppError('Your session has expired. Please log in again.', 401);
}

// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  let error = err;

  if (err.name === 'CastError') error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKeyError(err);
  else if (err.name === 'ValidationError') error = handleValidationError(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message =
    error.isOperational || !env.isProduction
      ? error.message
      : 'An unexpected error occurred';

  if (!error.isOperational) {
    console.error('[UNHANDLED ERROR]', err);
  }

  return sendError(res, statusCode, message, error.errors || null);
}

module.exports = globalErrorHandler;
