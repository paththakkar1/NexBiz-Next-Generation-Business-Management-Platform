/**
 * Standardized API Response helper functions
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Human-readable success message
 * @param {Object|Array|null} data - Payload to send to client
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {Object|Array|null} errorDetails - Additional diagnostic error details (optional)
 */
const sendError = (res, message, statusCode = 500, errorDetails = null) => {
  const responsePayload = {
    success: false,
    message
  };
  
  if (errorDetails) {
    responsePayload.errors = errorDetails;
  }
  
  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  sendSuccess,
  sendError
};
