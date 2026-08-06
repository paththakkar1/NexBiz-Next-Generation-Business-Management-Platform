const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.get('/admin-only', authenticateToken, authorizeRoles('Admin'), (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard!' });
});

module.exports = router;