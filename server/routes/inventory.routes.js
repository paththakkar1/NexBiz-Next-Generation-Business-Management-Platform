const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

let mockProducts = [
  { id: 1, sku: 'SKU-NEX-001', name: 'Enterprise Cloud Gateway Terminal', category: 'Hardware', price: 14500.00, stock_quantity: 42, low_stock_threshold: 10, unit: 'Units' },
  { id: 2, sku: 'SKU-NEX-002', name: 'Smart Thermal Invoice Printer', category: 'Peripherals', price: 6800.00, stock_quantity: 4, low_stock_threshold: 15, unit: 'Pcs' },
  { id: 3, sku: 'SKU-NEX-003', name: 'Wireless Barcode Scanner 2D', category: 'Peripherals', price: 3200.00, stock_quantity: 8, low_stock_threshold: 12, unit: 'Pcs' },
  { id: 4, sku: 'SKU-NEX-004', name: 'NexBiz SaaS Annual License Code', category: 'Software', price: 49999.00, stock_quantity: 150, low_stock_threshold: 20, unit: 'Keys' },
  { id: 5, sku: 'SKU-NEX-005', name: 'IoT Warehouse Tracking Hub', category: 'Hardware', price: 28500.00, stock_quantity: 3, low_stock_threshold: 10, unit: 'Units' }
];

let mockMovements = [
  { id: 1, product_name: 'Enterprise Cloud Gateway Terminal', movement_type: 'IN', quantity: 50, reference: 'PO-2026-081', notes: 'Received initial manufacturer shipment', created_at: '2026-08-01T10:00:00Z' },
  { id: 2, product_name: 'Smart Thermal Invoice Printer', movement_type: 'OUT', quantity: 6, reference: 'INV-2026-101', notes: 'Dispatched to TechSolutions India', created_at: '2026-08-04T15:20:00Z' },
  { id: 3, product_name: 'Wireless Barcode Scanner 2D', movement_type: 'OUT', quantity: 4, reference: 'INV-2026-102', notes: 'Dispatched to Kaveri Logistics', created_at: '2026-08-06T11:45:00Z' },
  { id: 4, product_name: 'IoT Warehouse Tracking Hub', movement_type: 'ADJUSTMENT', quantity: -2, reference: 'AUDIT-08', notes: 'Damaged in transit audit', created_at: '2026-08-08T16:00:00Z' }
];

// GET /api/inventory/products
router.get('/products', async (req, res) => {
  try {
    try {
      const rows = await query(`SELECT * FROM products ORDER BY stock_quantity ASC`);
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    } catch (e) {
      console.log('⚠️ DB fallback to mock products');
    }
    res.json({ success: true, data: mockProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/inventory/products
router.post('/products', (req, res) => {
  const { name, category, price, stock_quantity, low_stock_threshold, unit } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const sku = `SKU-NEX-${Math.floor(100 + Math.random() * 900)}`;
  const newProduct = {
    id: Date.now(),
    sku,
    name,
    category: category || 'General',
    price: parseFloat(price),
    stock_quantity: parseInt(stock_quantity || 0),
    low_stock_threshold: parseInt(low_stock_threshold || 10),
    unit: unit || 'Pcs'
  };

  mockProducts.unshift(newProduct);

  res.status(201).json({ success: true, data: newProduct });
});

// GET /api/inventory/movements
router.get('/movements', (req, res) => {
  res.json({ success: true, data: mockMovements });
});

// POST /api/inventory/movements - Record Stock Adjustment
router.post('/movements', (req, res) => {
  const { product_id, movement_type, quantity, reference, notes } = req.body;
  const product = mockProducts.find(p => p.id == product_id);

  if (!product) {
    return res.status(404).json({ error: 'Product SKU not found' });
  }

  const qty = parseInt(quantity || 0);

  if (movement_type === 'IN') {
    product.stock_quantity += qty;
  } else if (movement_type === 'OUT') {
    product.stock_quantity = Math.max(0, product.stock_quantity - qty);
  } else if (movement_type === 'ADJUSTMENT') {
    product.stock_quantity = Math.max(0, product.stock_quantity + qty);
  }

  const movementEntry = {
    id: Date.now(),
    product_name: product.name,
    movement_type,
    quantity: qty,
    reference: reference || 'MANUAL-LOG',
    notes: notes || 'Stock manual update',
    created_at: new Date().toISOString()
  };

  mockMovements.unshift(movementEntry);

  res.json({
    success: true,
    message: `Stock movement logged for ${product.name}. New quantity: ${product.stock_quantity}`,
    product,
    movement: movementEntry
  });
});

module.exports = router;
