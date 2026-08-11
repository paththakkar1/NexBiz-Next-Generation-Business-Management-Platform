# 🚀 NexBiz – Next-Generation Business Management Platform

NexBiz is a full-stack, cloud-based SaaS business management platform engineered specifically for the Indian enterprise & SMB market context. It unifies Executive Analytics, CRM Kanban Pipelines, Invoicing with 18% GST and Razorpay Online Payments, Inventory Monitoring, and HR Payroll processing into a single monorepo architecture.

---

## 🌟 Core Platform Modules & Features

### 1. 📊 Centralized Executive Dashboard
- **Real-Time Operational Widgets**: Total revenue collected, active leads count, low-stock threshold warnings, and pending payroll expenses.
- **Visual Analytics (Recharts)**: Interactive YTD revenue vs target performance line graph, sales pipeline stage bar breakdown, and product category distribution.
- **AI Smart Business Insights**: Data-driven recommendation engine suggesting real-time operational advice (e.g. stock intake recommendations, high-value lead follow-ups, overdue payment notices).

### 2. 👥 Customer Relationship Management (CRM)
- **Interactive Kanban Pipeline**: Drag/click deal stage progression (`Lead` ➔ `Contacted` ➔ `Qualified` ➔ `Won` ➔ `Lost`).
- **Pipeline Value Aggregates**: Real-time total pipeline revenue calculations per stage column.
- **Client Accounts Directory**: Directory table storing contact persons, phones, emails, status, and lead acquisition sources.

### 3. 🧾 Invoicing & Razorpay Payment Integration
- **GST Invoice Generator**: Itemized line items builder with automatic 18% GST calculation, discounts, and custom payment terms.
- **1-Click PDF Export & Download**: Instant printable/exportable tax invoices powered by client-side PDF rendering.
- **Razorpay Payment Gateway**: Integrated online checkout workflow launching Razorpay Payment SDK for direct online payments.
- **Automated Ledger**: Automatically updates invoice statuses (`Paid`/`Sent`/`Overdue`) and records transaction logs upon payment verification.

### 4. 📦 Inventory Management Module
- **Stock Monitoring**: Real-time SKU tracking with category pricing and safety threshold indicators (`Optimal` vs `Low Stock Alert`).
- **Movement Logs**: Historical record tracking incoming shipments (`IN`), sales dispatches (`OUT`), and audit adjustments (`ADJUSTMENT`).

### 5. 💼 Employee Management & Payroll System
- **Employee Directory**: Centralized roster recording employee codes, departments, designations, base salaries, and bank account/IFSC details.
- **Automated Payroll Runner**: Process monthly batch disbursements calculating bonuses, PF/tax deductions, and net salary.
- **Digital Salary Slips**: 1-click printable PDF payslips for employees.

---

## 🛠️ Tech Stack & System Architecture

- **Frontend Client (`/client`)**: React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts + Razorpay SDK + html2pdf.js.
- **Backend API (`/server`)**: Node.js + Express.js + CORS + Helmet + Morgan + MySQL2 connection pool.
- **Database (`server/config/schema.sql`)**: Production-grade MySQL DDL schema with 11 relational tables (`roles`, `users`, `customers`, `leads`, `products`, `stock_movements`, `invoices`, `invoice_items`, `transactions_ledger`, `employees`, `payroll_runs`) featuring foreign key constraints and indexed search fields.

---

## ⚡ Quick Start Guide

### 1. Install Monorepo Dependencies
From the repository root directory:
```bash
npm run install:all
```

### 2. Initialize MySQL Database
Make sure your local MySQL service is running on port `3306`. Update `DB_PASSWORD` in `server/.env` if needed, then run:
```bash
npm run init-db
```
*(Alternative manual CLI import: `cmd /c "mysql -u root -p < server/config/schema.sql"`)*

### 3. Launch Development Environment
```bash
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📜 License
ISC License © 2026 NexBiz Engineering Team. Built for High-Growth SaaS Enterprises.
