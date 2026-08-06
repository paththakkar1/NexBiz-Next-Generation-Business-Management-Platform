const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'EMPLOYEE', 'CUSTOMER'],
    default: 'CUSTOMER'
  },
  role_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verification_token: {
    type: String,
    default: null
  },
  reset_token: {
    type: String,
    default: null
  },
  reset_token_expires: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
