const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

let mockEmployees = [
  { id: 1, employee_code: 'NEX-EMP-001', name: 'Rajesh Sharma', email: 'admin@nexbiz.in', department: 'Executive', designation: 'Chief Executive Officer', base_salary: 185000.00, joining_date: '2024-01-15', bank_account_no: '91800012345678', ifsc_code: 'HDFC0000123' },
  { id: 2, employee_code: 'NEX-EMP-002', name: 'Priya Patel', email: 'priya.patel@nexbiz.in', department: 'Sales & CRM', designation: 'Senior Account Executive', base_salary: 75000.00, joining_date: '2024-06-01', bank_account_no: '91800098765432', ifsc_code: 'ICIC0000456' },
  { id: 3, employee_code: 'NEX-EMP-003', name: 'Sneha Rao', email: 'sneha.rao@nexbiz.in', department: 'Customer Success', designation: 'Technical Support Lead', base_salary: 65000.00, joining_date: '2025-02-10', bank_account_no: '91800055544433', ifsc_code: 'SBIN0000789' }
];

let mockPayrollRuns = [
  { id: 101, employee_id: 1, employee_name: 'Rajesh Sharma', designation: 'Chief Executive Officer', month: 'July', year: 2026, base_salary: 185000.00, bonus: 15000.00, deductions: 18500.00, net_salary: 181500.00, status: 'Paid', payment_date: '2026-07-31' },
  { id: 102, employee_id: 2, employee_name: 'Priya Patel', designation: 'Senior Account Executive', month: 'July', year: 2026, base_salary: 75000.00, bonus: 8000.00, deductions: 7500.00, net_salary: 75500.00, status: 'Paid', payment_date: '2026-07-31' },
  { id: 103, employee_id: 3, employee_name: 'Sneha Rao', designation: 'Technical Support Lead', month: 'July', year: 2026, base_salary: 65000.00, bonus: 2000.00, deductions: 6500.00, net_salary: 60500.00, status: 'Paid', payment_date: '2026-07-31' }
];

// GET /api/payroll/employees - Directory
router.get('/employees', async (req, res) => {
  try {
    try {
      const sql = `
        SELECT e.*, u.name, u.email 
        FROM employees e 
        JOIN users u ON e.user_id = u.id 
        ORDER BY e.created_at DESC
      `;
      const rows = await query(sql);
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    } catch (e) {
      console.log('⚠️ DB fallback to mock employees');
    }
    res.json({ success: true, data: mockEmployees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payroll/employees - Add new employee
router.post('/employees', (req, res) => {
  const { name, email, department, designation, base_salary, joining_date, bank_account_no, ifsc_code } = req.body;
  if (!name || !department || !base_salary) {
    return res.status(400).json({ error: 'Name, Department, and Base Salary are required' });
  }

  const employee_code = `NEX-EMP-00${mockEmployees.length + 1}`;
  const newEmp = {
    id: Date.now(),
    employee_code,
    name,
    email: email || `${name.toLowerCase().replace(' ', '.')}@nexbiz.in`,
    department,
    designation: designation || 'Staff Specialist',
    base_salary: parseFloat(base_salary),
    joining_date: joining_date || new Date().toISOString().split('T')[0],
    bank_account_no: bank_account_no || '9180000000000',
    ifsc_code: ifsc_code || 'HDFC0000123'
  };

  mockEmployees.push(newEmp);
  res.status(201).json({ success: true, data: newEmp });
});

// GET /api/payroll/history - Payroll runs log
router.get('/history', (req, res) => {
  res.json({ success: true, data: mockPayrollRuns });
});

// POST /api/payroll/process - Run batch monthly payroll
router.post('/process', (req, res) => {
  const { month, year } = req.body;
  const currentMonth = month || 'August';
  const currentYear = year || 2026;

  const newRuns = mockEmployees.map((emp) => {
    const bonus = Math.round(emp.base_salary * 0.05);
    const deductions = Math.round(emp.base_salary * 0.10); // PF & Tax deduction
    const net_salary = emp.base_salary + bonus - deductions;

    return {
      id: Date.now() + emp.id,
      employee_id: emp.id,
      employee_name: emp.name,
      designation: emp.designation,
      month: currentMonth,
      year: currentYear,
      base_salary: emp.base_salary,
      bonus,
      deductions,
      net_salary,
      status: 'Paid',
      payment_date: new Date().toISOString().split('T')[0]
    };
  });

  mockPayrollRuns = [...newRuns, ...mockPayrollRuns];

  res.json({
    success: true,
    message: `Payroll batch processed successfully for ${currentMonth} ${currentYear}!`,
    processedCount: newRuns.length,
    totalDisbursed: newRuns.reduce((sum, r) => sum + r.net_salary, 0),
    data: newRuns
  });
});

module.exports = router;
