const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
require('dotenv').config();

/**
 * Middleware to verify JWT token in Authorization header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access denied. No authentication token provided.', 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me_in_production');
    
    // Attach decoded user information (userId, email, role) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Authentication token has expired. Please login again.', 401);
    }
    return sendError(res, 'Invalid authentication token. Request unauthorized.', 401);
  }
};

/**
 * Middleware to authorize access based on user roles (RBAC)
 * @param {...string} allowedRoles - List of roles permitted to access the resource
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'Access denied. User role details missing from session.', 403);
    }

    const hasAccess = allowedRoles.includes(req.user.role);
    
    if (!hasAccess) {
      return sendError(res, 'Access forbidden. You do not have the required permissions.', 403);
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
