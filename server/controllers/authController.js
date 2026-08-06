const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/db');
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
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return sendError(res, 'A user with this email address already exists.', 400);
    }

    // 2. Fetch the role ID from database matching the userRole
    const [roleRow] = await db.query('SELECT id FROM roles WHERE name = ?', [userRole]);
    if (roleRow.length === 0) {
      return sendError(res, `Specified role '${userRole}' does not exist in the system.`, 400);
    }
    const roleId = roleRow[0].id;

    // 3. Generate verification token and hash the password
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user record
    await db.query(
      `INSERT INTO users (full_name, email, password_hash, role, role_id, verification_token, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, passwordHash, userRole, roleId, verificationToken, false]
    );

    console.log(`[USER REGISTERED] User: ${email}, Verification Token: ${verificationToken}`);

    // Return successfully
    return sendSuccess(
      res, 
      'User registered successfully. Please verify your email.', 
      { email, role: userRole, verificationToken }, 
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
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }
    const user = users[0];

    // 2. Verify password match
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    // 3. Sign JWT token (expires in 24 hours)
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_me_in_production',
      { expiresIn: '24h' }
    );

    // 4. Return success response with token and user details
    return sendSuccess(res, 'User authenticated successfully', {
      token,
      user: {
        id: user.id,
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
    const [users] = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // To prevent user enumeration, return a general success message
      return sendSuccess(res, 'If that email address exists in our system, a password reset link has been sent.', null);
    }
    const user = users[0];

    // 2. Generate secure random reset token and expiration (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1-hour validity

    // 3. Save token to user profile
    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, expires, user.id]
    );

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log(`[PASSWORD RESET REQUESTED] User: ${user.email}, Link: ${resetUrl}`);

    // 4. Configure & send reset email
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
    const [users] = await db.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > ?',
      [token, new Date()]
    );

    if (users.length === 0) {
      return sendError(res, 'The password reset token is invalid or has expired.', 400);
    }
    const user = users[0];

    // 2. Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // 3. Update password and clear reset tokens
    await db.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [newPasswordHash, user.id]
    );

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

    const [users] = await db.query(
      'SELECT id, full_name, email, role, is_verified, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return sendError(res, 'User profile could not be found.', 404);
    }

    return sendSuccess(res, 'User profile retrieved successfully', users[0]);
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
    // 1. If email is being changed, ensure it's not already taken
    if (email && email !== req.user.email) {
      const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (existingUsers.length > 0) {
        return sendError(res, 'This email address is already in use by another user.', 400);
      }
    }

    // 2. Perform database update
    const updateFields = [];
    const queryParams = [];

    if (full_name) {
      updateFields.push('full_name = ?');
      queryParams.push(full_name);
    }

    if (email) {
      updateFields.push('email = ?');
      queryParams.push(email);
    }

    if (updateFields.length === 0) {
      return sendError(res, 'No changes were provided to update.', 400);
    }

    queryParams.push(userId);

    await db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      queryParams
    );

    // 3. Fetch and return updated profile
    const [updatedUsers] = await db.query(
      'SELECT id, full_name, email, role, is_verified, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    return sendSuccess(res, 'User profile updated successfully', updatedUsers[0]);
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
