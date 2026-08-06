const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Role = require('../models/Role');
const { sendSuccess, sendError } = require('../utils/response');
require('dotenv').config();

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;
  const userRole = role || 'CUSTOMER';

  try {
    // 1. Check if email already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return sendError(res, 'A user with this email address already exists.', 400);
    }

    // 2. Fetch the role from database matching userRole
    const roleRecord = await Role.findOne({ name: userRole.toUpperCase() });
    if (!roleRecord) {
      return sendError(res, `Specified role '${userRole}' does not exist in the system.`, 400);
    }

    // 3. Generate verification token and hash the password
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user document
    const newUser = new User({
      full_name,
      email,
      password_hash: passwordHash,
      role: userRole.toUpperCase(),
      role_ref: roleRecord._id,
      verification_token: verificationToken,
      is_verified: false
    });

    await newUser.save();

    console.log(`[USER REGISTERED] User: ${email}, Verification Token: ${verificationToken}`);

    // Return successfully
    return sendSuccess(
      res, 
      'User registered successfully. Please verify your email.', 
      { email: newUser.email, role: newUser.role, verificationToken }, 
      201
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return sendError(res, 'An error occurred during user registration.', 500);
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Fetch user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    // 2. Verify password match
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    // 3. Sign JWT token (expires in 24 hours)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me_in_production',
      { expiresIn: '24h' }
    );

    // 4. Return success response with token and user details
    return sendSuccess(res, 'User authenticated successfully', {
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return sendError(res, 'An error occurred during user authentication.', 500);
  }
};

/**
 * Request Password Reset (Forgot Password)
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // To prevent user enumeration, return a general success message
      return sendSuccess(res, 'If that email address exists in our system, a password reset link has been sent.', null);
    }

    // 2. Generate secure random reset token and expiration (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.reset_token = resetToken;
    user.reset_token_expires = Date.now() + 3600000; // 1-hour validity

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log(`[PASSWORD RESET REQUESTED] User: ${user.email}, Link: ${resetUrl}`);

    // 3. Configure & send reset email
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"NexBiz Support" <support@nexbiz.com>',
      to: user.email,
      subject: 'NexBiz Password Reset Request',
      text: `Hello, you requested a password reset. Use this link to reset it (valid for 1 hour):\n${resetUrl}`,
      html: `
        <h3>NexBiz Password Reset</h3>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link is only valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email successfully sent to ${user.email}`);
    } catch (emailError) {
      console.error('Nodemailer SMTP failed. Fallback: Logged token link to console.');
      console.log(`[DEVELOPMENT FALLBACK RESET LINK] => ${resetUrl}`);
    }

    return sendSuccess(res, 'If that email address exists in our system, a password reset link has been sent.', null);
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return sendError(res, 'An error occurred while processing the forgot password request.', 500);
  }
};

/**
 * Reset Password with token
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // 1. Fetch user matching active, valid, unexpired token
    const user = await User.findOne({
      reset_token: token,
      reset_token_expires: { $gt: Date.now() }
    });

    if (!user) {
      return sendError(res, 'The password reset token is invalid or has expired.', 400);
    }

    // 2. Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // 3. Update password and clear reset tokens
    user.password_hash = newPasswordHash;
    user.reset_token = null;
    user.reset_token_expires = null;
    
    await user.save();

    return sendSuccess(res, 'Your password has been successfully reset. You can now login.', null);
  } catch (error) {
    console.error('Reset Password Error:', error);
    return sendError(res, 'An error occurred while resetting the password.', 500);
  }
};

/**
 * Get profile details
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
      return sendError(res, 'User profile could not be found.', 404);
    }

    return sendSuccess(res, 'User profile retrieved successfully', user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    return sendError(res, 'An error occurred while retrieving the profile.', 500);
  }
};

/**
 * Update profile details
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  const { full_name, email } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User profile could not be found.', 404);
    }

    // 1. If email is being changed, ensure it's not already taken
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return sendError(res, 'This email address is already in use by another user.', 400);
      }
      user.email = email.toLowerCase();
    }

    // 2. Update optional fields
    if (full_name) {
      user.full_name = full_name;
    }

    await user.save();

    // 3. Fetch and return updated profile
    const updatedUser = await User.findById(userId).select('-password_hash');

    return sendSuccess(res, 'User profile updated successfully', updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    return sendError(res, 'An error occurred while updating the profile.', 500);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};
