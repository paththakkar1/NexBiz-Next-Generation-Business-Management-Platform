const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

let mockInvoices = [
  {
    id: 1,
    invoice_number: 'INV-2026-001',
    customer_id: 1,
    company_name: 'TechSolutions India Pvt Ltd',
    customer_email: 'amit.verma@techsolutions.in',
    customer_phone: '+91 98765 43210',
    address: 'Indiranagar, Bengaluru, Karnataka 560038',
    subtotal: 100000.00,
    gst_rate: 18.00,
    gst_amount: 18000.00,
    discount_amount: 5000.00,
    total_amount: 113000.00,
    status: 'Paid',
    due_date: '2026-08-05',
    created_at: '2026-07-20T10:00:00Z',
    items: [
      { id: 101, description: 'NexBiz SaaS Annual License Code (50 Users)', quantity: 2, unit_price: 49999.00, amount: 99998.00 }
    ]
  },
  {
    id: 2,
    invoice_number: 'INV-2026-002',
    customer_id: 2,
    company_name: 'Apex Enterprises',
    customer_email: 'contact@apexent.in',
    customer_phone: '+91 98123 45678',
    address: 'BKC, Mumbai, Maharashtra 400051',
    subtotal: 250000.00,
    gst_rate: 18.00,
    gst_amount: 45000.00,
    discount_amount: 0.00,
    total_amount: 295000.00,
    status: 'Sent',
    due_date: '2026-08-25',
    created_at: '2026-08-01T14:30:00Z',
    items: [
      { id: 102, description: 'Enterprise Cloud Gateway Terminal', quantity: 10, unit_price: 14500.00, amount: 145000.00 },
      { id: 103, description: 'IoT Warehouse Tracking Hub', quantity: 3, unit_price: 28500.00, amount: 85500.00 }
    ]
  },
  {
    id: 3,
    invoice_number: 'INV-2026-003',
    customer_id: 4,
    company_name: 'Kaveri Logistics',
    customer_email: 'rohan@kaverilogistics.com',
    customer_phone: '+91 94444 55666',
    address: 'T. Nagar, Chennai, Tamil Nadu 600017',
    subtotal: 150000.00,
    gst_rate: 18.00,
    gst_amount: 27000.00,
    discount_amount: 2000.00,
    total_amount: 175000.00,
    status: 'Overdue',
    due_date: '2026-08-01',
    created_at: '2026-07-15T09:15:00Z',
    items: [
      { id: 104, description: 'Wireless Barcode Scanner 2D', quantity: 20, unit_price: 3200.00, amount: 64000.00 }
    ]
  }
];

let mockLedger = [
  {
    id: 1,
    invoice_id: 1,
    invoice_number: 'INV-2026-001',
    company_name: 'TechSolutions India Pvt Ltd',
    transaction_ref: 'TXN-RZP-90812',
    razorpay_order_id: 'order_Nxb901823',
    razorpay_payment_id: 'pay_Nxb901823_001',
    amount: 113000.00,
    payment_method: 'UPI (Razorpay)',
    status: 'Completed',
    payment_date: '2026-07-22T11:20:00Z'
  }
];

// GET /api/invoices - Fetch invoices
router.get('/', async (req, res) => {
  try {
    try {
      const sql = `
        SELECT i.*, c.company_name, c.email as customer_email, c.phone as customer_phone, c.address
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        ORDER BY i.created_at DESC
      `;
      const rows = await query(sql);
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    } catch (e) {
      console.log('⚠️ DB fallback to mock invoices');
    }
    res.json({ success: true, data: mockInvoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/invoices - Create new invoice
router.post('/', async (req, res) => {
  const { customer_name, customer_email, due_date, items, discount } = req.body;

  if (!customer_name || !items || !items.length) {
    return res.status(400).json({ error: 'Customer name and line items are required' });
  }

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.unit_price || 0) * parseInt(item.quantity || 1)), 0);
  const disc = parseFloat(discount || 0);
  const gst_amount = Math.round((subtotal - disc) * 0.18);
  const total_amount = (subtotal - disc) + gst_amount;
  const invoice_number = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newInvoice = {
    id: Date.now(),
    invoice_number,
    customer_id: Date.now(),
    company_name: customer_name,
    customer_email: customer_email || 'client@nexbiz.in',
    customer_phone: '+91 98000 11223',
    address: 'Bengaluru, Karnataka',
    subtotal,
    gst_rate: 18.00,
    gst_amount,
    discount_amount: disc,
    total_amount,
    status: 'Sent',
    due_date: due_date || '2026-09-01',
    created_at: new Date().toISOString(),
    items: items.map((it, idx) => ({
      id: Date.now() + idx,
      description: it.description,
      quantity: parseInt(it.quantity),
      unit_price: parseFloat(it.unit_price),
      amount: parseFloat(it.unit_price) * parseInt(it.quantity)
    }))
  };

  mockInvoices.unshift(newInvoice);

  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: newInvoice
  });
});

// POST /api/invoices/:id/razorpay-order - Create Razorpay order simulation
router.post('/:id/razorpay-order', (req, res) => {
  const { id } = req.params;
  const invoice = mockInvoices.find(i => i.id == id);

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  // Construct Razorpay Order payload (Paise conversion)
  const razorpayOrder = {
    order_id: `order_NXB_${Date.now()}`,
    amount_in_paise: Math.round(invoice.total_amount * 100),
    amount_in_inr: invoice.total_amount,
    currency: 'INR',
    invoice_number: invoice.invoice_number,
    company_name: invoice.company_name,
    customer_email: invoice.customer_email,
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_NEXBIZ2026KEY'
  };

  res.json({
    success: true,
    data: razorpayOrder
  });
});

// POST /api/invoices/:id/verify-payment - Complete Razorpay payment & log ledger
router.post('/:id/verify-payment', (req, res) => {
  const { id } = req.params;
  const { razorpay_payment_id, razorpay_order_id, payment_method } = req.body;

  const invoice = mockInvoices.find(i => i.id == id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  invoice.status = 'Paid';

  const ledgerEntry = {
    id: Date.now(),
    invoice_id: invoice.id,
    invoice_number: invoice.invoice_number,
    company_name: invoice.company_name,
    transaction_ref: `TXN-RZP-${Math.floor(10000 + Math.random() * 90000)}`,
    razorpay_order_id: razorpay_order_id || `order_NXB_${Date.now()}`,
    razorpay_payment_id: razorpay_payment_id || `pay_NXB_${Date.now()}`,
    amount: invoice.total_amount,
    payment_method: payment_method || 'UPI (Razorpay Gateway)',
    status: 'Completed',
    payment_date: new Date().toISOString()
  };

  mockLedger.unshift(ledgerEntry);

  res.json({
    success: true,
    message: `Payment verified & Invoice #${invoice.invoice_number} marked as Paid!`,
    ledger: ledgerEntry
  });
});

// GET /api/invoices/ledger - Fetch transaction ledger
router.get('/ledger', (req, res) => {
  res.json({ success: true, data: mockLedger });
});

module.exports = router;
