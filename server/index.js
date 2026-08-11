const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Import modular route handlers
const dashboardRoutes = require('./routes/dashboard.routes');
const crmRoutes = require('./routes/crm.routes');
const invoiceRoutes = require('./routes/invoices.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const payrollRoutes = require('./routes/payroll.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
    modules: ['dashboard', 'crm', 'invoices', 'inventory', 'payroll']
  });
});

// Mount Modular API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payroll', payrollRoutes);

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
