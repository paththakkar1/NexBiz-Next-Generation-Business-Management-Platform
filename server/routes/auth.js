const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');

// Middlewares
const { verifyToken } = require('../middleware/auth');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  updateProfileRules
} = require('../middleware/validator');

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', registerRules, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
router.post('/login', loginRules, authController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate password reset token & email reset link
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordRules, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
router.post('/reset-password', resetPasswordRules, authController.resetPassword);

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile details
 * @access  Private
 */
router.put('/profile', verifyToken, updateProfileRules, authController.updateProfile);

module.exports = router;
