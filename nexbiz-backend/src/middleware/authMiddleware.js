const jwt = require('jsonwebtoken');

// Verify Authorization Bearer Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id, email, and role
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Restrict access by user role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access forbidden: Insufficient permissions.'
            });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };