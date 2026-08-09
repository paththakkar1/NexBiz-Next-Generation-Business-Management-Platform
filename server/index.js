const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware setup
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'NexBiz Backend API Server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root API Welcome route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to NexBiz Next-Generation Business Management Platform API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Modular system routes (placeholder stubs for modules)
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    activeCustomers: 124,
    totalLeads: 48,
    pendingInvoicesAmount: '₹4,52,000',
    lowStockItemsCount: 5,
    currency: 'INR (₹)'
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint Not Found',
    path: req.originalUrl
  });
});

// Global Central Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Express HTTP Server
app.listen(PORT, async () => {
  console.log(`🚀 NexBiz Server running on http://localhost:${PORT}`);
  await testConnection();
});
