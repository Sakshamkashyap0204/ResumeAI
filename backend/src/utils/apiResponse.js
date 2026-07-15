'use strict';

/**
 * Sends a successful JSON response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 */
function sendSuccess(res, statusCode, message, data = null) {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
}

/**
 * Sends an error JSON response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Array|null} errors
 */
function sendError(res, statusCode, message, errors = null) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
}

module.exports = { sendSuccess, sendError };
