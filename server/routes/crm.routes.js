const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// In-memory fallback dataset for seamless trial if DB offline
let mockLeads = [
  {
    id: 1,
    customer_id: 1,
    title: 'Enterprise SaaS License Upgrade (500 users)',
    company_name: 'TechSolutions India Pvt Ltd',
    value: 450000.00,
    status: 'Qualified',
    contact_email: 'amit.verma@techsolutions.in',
    contact_phone: '+91 98765 43210',
    follow_up_date: '2026-08-15',
    notes: 'Negotiating annual billing terms.'
  },
  {
    id: 2,
    customer_id: 2,
    title: 'Cloud ERP Implementation Phase 2',
    company_name: 'Apex Enterprises',
    value: 820000.00,
    status: 'Contacted',
    contact_email: 'contact@apexent.in',
    contact_phone: '+91 98123 45678',
    follow_up_date: '2026-08-18',
    notes: 'Sent technical proposal.'
  },
  {
    id: 3,
    customer_id: 3,
    title: 'Retail POS & Inventory Software',
    company_name: 'Bharat Retail Chain',
    value: 320000.00,
    status: 'Lead',
    contact_email: 'procurement@bharatretail.co.in',
    contact_phone: '+91 97111 22334',
    follow_up_date: '2026-08-20',
    notes: 'Inbound inquiry from landing page.'
  },
  {
    id: 4,
    customer_id: 4,
    title: 'Logistics Tracking Portal Integration',
    company_name: 'Kaveri Logistics',
    value: 650000.00,
    status: 'Won',
    contact_email: 'rohan@kaverilogistics.com',
    contact_phone: '+91 94444 55666',
    follow_up_date: '2026-08-01',
    notes: 'Contract signed, invoice generated.'
  },
  {
    id: 5,
    customer_id: null,
    title: 'Smart Warehouse Sensors Trial',
    company_name: 'LogiSmart Solutions',
    value: 180000.00,
    status: 'Lost',
    contact_email: 'vendor@logismart.in',
    contact_phone: '+91 93333 44455',
    follow_up_date: '2026-07-25',
    notes: 'Budget frozen till Q4.'
  }
];

let mockCustomers = [
  { id: 1, company_name: 'TechSolutions India Pvt Ltd', contact_person: 'Amit Verma', phone: '+91 98765 43210', email: 'amit.verma@techsolutions.in', status: 'Active', lead_source: 'Website' },
  { id: 2, company_name: 'Apex Enterprises', contact_person: 'Sunil Mehta', phone: '+91 98123 45678', email: 'contact@apexent.in', status: 'Active', lead_source: 'Referral' },
  { id: 3, company_name: 'Bharat Retail Chain', contact_person: 'Deepak Gupta', phone: '+91 97111 22334', email: 'procurement@bharatretail.co.in', status: 'Lead', lead_source: 'LinkedIn' },
  { id: 4, company_name: 'Kaveri Logistics', contact_person: 'Rohan Kaveri', phone: '+91 94444 55666', email: 'rohan@kaverilogistics.com', status: 'Active', lead_source: 'Direct' }
];

// GET /api/crm/leads - Fetch all pipeline leads
router.get('/leads', async (req, res) => {
  try {
    try {
      const sql = `
        SELECT l.*, c.company_name 
        FROM leads l 
        LEFT JOIN customers c ON l.customer_id = c.id 
        ORDER BY l.created_at DESC
      `;
      const rows = await query(sql);
      if (rows && rows.length > 0) {
        return res.json({ success: true, data: rows });
      }
    } catch (e) {
      console.log('⚠️ DB query fallback to mock leads');
    }

    res.json({ success: true, data: mockLeads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/crm/leads/:id/stage - Update lead Kanban stage
router.get('/leads', (req, res) => {
  res.json({ success: true, data: mockLeads });
});

router.patch('/leads/:id/stage', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Lead', 'Contacted', 'Qualified', 'Won', 'Lost'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status stage' });
  }

  try {
    try {
      await query(`UPDATE leads SET status = ? WHERE id = ?`, [status, id]);
    } catch (e) {
      console.log('⚠️ Updating mock leads stage in memory');
    }

    const lead = mockLeads.find(l => l.id == id);
    if (lead) lead.status = status;

    res.json({
      success: true,
      message: `Lead #${id} stage updated to '${status}' successfully`,
      leadId: id,
      newStatus: status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/crm/leads - Add a new lead
router.post('/leads', async (req, res) => {
  const { title, company_name, value, status, contact_email, contact_phone, follow_up_date, notes } = req.body;

  if (!title || !company_name || !value) {
    return res.status(400).json({ error: 'Title, Company Name, and Value are required' });
  }

  try {
    const newLead = {
      id: Date.now(),
      customer_id: null,
      title,
      company_name,
      value: parseFloat(value),
      status: status || 'Lead',
      contact_email: contact_email || '',
      contact_phone: contact_phone || '',
      follow_up_date: follow_up_date || new Date().toISOString().split('T')[0],
      notes: notes || ''
    };

    try {
      const sql = `
        INSERT INTO leads (title, value, status, contact_email, contact_phone, follow_up_date, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await query(sql, [title, value, status || 'Lead', contact_email, contact_phone, follow_up_date, notes]);
      newLead.id = result.insertId;
    } catch (e) {
      console.log('⚠️ Added to mock leads dataset');
    }

    mockLeads.unshift(newLead);
    res.status(201).json({ success: true, data: newLead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/crm/customers - Fetch customer directory
router.get('/customers', async (req, res) => {
  try {
    try {
      const rows = await query(`SELECT * FROM customers ORDER BY created_at DESC`);
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    } catch (e) {
      console.log('⚠️ DB fallback to mock customers');
    }
    res.json({ success: true, data: mockCustomers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
