const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Mongoose connection
require('./config/db');

// Run database seed script
const seedDB = require('./config/seed');
seedDB();

// Routes
const authRoutes = require('./routes/auth');

// Response utilities
const { sendError, sendSuccess } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Customize for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development helpful)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root Health Route
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 'NexBiz REST API health check passed', {
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);

// Fallback Route for non-existent endpoints (404)
app.use((req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
});

// Global Error Handler Middleware (500)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An internal server error occurred.' : err.message,
    500
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`NexBiz API Server running on port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL base: http://localhost:${PORT}/api`);
  console.log(`==================================================`);
});

module.exports = app;
