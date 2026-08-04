# NexBiz - Requirements Specification Document

This document outlines the detailed functional and non-functional requirements of the NexBiz Business Management Platform, including roles, permissions, modules, and systems specifications.

---

## 1. User Roles & Permissions

NexBiz employs a Role-Based Access Control (RBAC) model. Below are the five defined user roles and their associated system privileges.

### Role Definitions

1. **Super Admin**: System-level administrator responsible for managing SaaS tenant accounts (businesses), platform settings, billing plans, global logs, and database maintenance.
2. **Business Owner**: The tenant administrator who owns the specific business account. Full access to their business instance, including employee setups, payroll, accounting, CRM, and settings.
3. **Manager**: Department or team leader. Managing leads, sales pipelines, inventory, and reviewing employee attendance/payroll (without salary changing permissions unless granted).
4. **Employee**: Standard operational user. Can access inventory to log stock updates, record sales activities, manage CRM leads assigned to them, clock in/out, and view their own payroll slips.
5. **Customer**: End-user of the invoicing and payment services. Access to a dedicated portal to view outstanding invoices, complete payments via Razorpay, and download payment receipts.

### Roles & Permissions Matrix

| Module | Feature | Super Admin | Business Owner | Manager | Employee | Customer |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Tenant Mgmt** | Create/Suspend Businesses | **Yes** | No | No | No | No |
| **User Mgmt** | Add/Remove Users, Assign Roles | **Yes** | **Yes** | No | No | No |
| **Authentication** | Login, Update Profile, Reset Password | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| **CRM** | Manage Customers & Leads | No | **Yes** | **Yes** | **Yes (Assigned)** | No |
| **Sales Pipeline** | Move deal stages, log deals | No | **Yes** | **Yes** | **Yes** | No |
| **Inventory** | View Products & Stock | No | **Yes** | **Yes** | **Yes** | No |
| **Inventory** | Modify Product Info & Suppliers | No | **Yes** | **Yes** | No | No |
| **Invoice Generator**| Create, Edit, Delete Invoices | No | **Yes** | **Yes** | **Yes (Draft only)** | No |
| **Invoice Viewer** | View Invoices, Pay Online | No | **Yes** | **Yes** | **Yes** | **Yes** |
| **Razorpay Payment**| Setup Gateway Credentials | No | **Yes** | No | No | No |
| **Razorpay Payment**| Process/Verify Payments | No | **Yes** | **Yes** | **Yes** | **Yes** |
| **Reports & Charts**| View Financial / Sales Charts | **Yes (Global)**| **Yes** | **Yes (Read Only)**| No | No |
| **Employee Mgmt** | View/Manage Staff Records | No | **Yes** | **Yes (Read Only)**| No | No |
| **Payroll** | Process payroll, Approve salaries | No | **Yes** | No | No | No |
| **Payroll** | View own payslips | No | **Yes** | **Yes** | **Yes** | No |
| **Settings** | Modify Business Name, Currency | No | **Yes** | No | No | No |
| **AI Recommendation**| View AI Insights & Forecasts | No | **Yes** | **Yes** | No | No |

---

## 2. Functional Requirements (by Module)

### 2.1 Authentication & User Access
- **FR-AUTH-01**: The system must provide secure JWT-based authentication for users (Super Admin, Owner, Manager, Employee, Customer).
- **FR-AUTH-02**: Passwords must be hashed using `bcrypt` with a minimum work factor (salt rounds) of 10.
- **FR-AUTH-03**: The system must implement Role-Based Access Control (RBAC) middleware on all routes to verify authorization tokens before allowing execution.
- **FR-AUTH-04**: Session tokens must expire after 7 days, requiring re-authentication.

### 2.2 Dashboard
- **FR-DASH-01**: The frontend dashboard must customize widget layouts according to user role (e.g. Owner sees revenue charts; Employee sees task lists/leads).
- **FR-DASH-02**: The dashboard must query and display high-level KPIs: Total Revenue, Pending Invoices, Leads Converted, and Stock Alerts (low inventory).

### 2.3 Customer Relationship Management (CRM)
- **FR-CRM-01**: Users must be able to Create, Read, Update, and Delete (CRUD) customer records (name, email, phone, company, business_id).
- **FR-CRM-02**: The system must capture Leads with source channels (e.g. Organic, Cold Outreach, Referral) and statuses (New, Contacted, Qualified, Lost).
- **FR-CRM-03**: The Sales Pipeline must support custom Deal Stages (e.g. Pitch, Proposal Sent, Negotiation, Closed Won, Closed Lost) and allow dragging/updating stages.

### 2.4 Inventory & Product Management
- **FR-INV-01**: The system must support Product Management including details like SKU, name, description, unit price, category, reorder level, and stock quantity.
- **FR-INV-02**: Real-time stock counts must automatically decrement upon sales completion (invoice payment) and increment upon logging supplier restocking.
- **FR-INV-03**: Low stock notifications must trigger when the stock quantity falls below the specified product reorder level.
- **FR-INV-04**: The system must manage Suppliers (supplier name, email, contact person, phone, address).

### 2.5 Invoice & Billing Generator
- **FR-BILL-01**: The platform must support dynamic invoice generation with sequential numbering, custom tax rates (GST/VAT), discount parameters, and invoice line items.
- **FR-BILL-02**: Invoices must support status flows: `Draft`, `Sent`, `Paid`, `Overdue`, `Cancelled`.

### 2.6 Razorpay Payments Integration
- **FR-PAY-01**: Customers must be able to securely pay outstanding invoices online using Razorpay payment gateway (supporting UPI, Cards, Netbanking).
- **FR-PAY-02**: The backend must handle Razorpay Webhooks to securely verify transactions (signature verification using Razorpay SDK) and update invoice status to `Paid` asynchronously.
- **FR-PAY-03**: The platform must log every transaction attempt in a dedicated `payments` ledger.

### 2.7 Reports & Business Analytics
- **FR-REP-01**: The frontend must display interactive, responsive charts (via Chart.js) depicting monthly sales revenue, invoice status distribution, and lead conversion rates.
- **FR-REP-02**: The system must support exporting reports to CSV or PDF (e.g. Sales Ledgers, Attendance Logs, Payroll Summaries).

### 2.8 Employee & Payroll Management
- **FR-EMP-01**: Business owners must be able to register employees, inputting contact information, job titles, department, salary rates, and tax identifiers.
- **FR-EMP-02**: The system must track Attendance (Check-in, Check-out, status: Present, Absent, Half-Day, Sick Leave) linked to payroll calculations.
- **FR-EMP-03**: The payroll module must generate monthly salary ledgers, computing base salary, bonuses, deductions, and tax withholdings, creating printable payslips.

### 2.9 Notifications
- **FR-NOT-01**: Real-time notifications must alert users of critical actions (e.g. low stock alerts, invoice payment confirmations, payroll releases).
- **FR-NOT-02**: The notification system must support push updates on the frontend (WebSockets/Polling) and log events in the database.

### 2.10 AI-Powered Recommendation Engine
- **FR-AI-01**: The Python Flask AI microservice must ingest transaction histories, inventory sales patterns, and customer interactions to generate business recommendations.
- **FR-AI-02**: The engine must forecast sales trends and predict when specific products are likely to require replenishment (demand forecasting).
- **FR-AI-03**: Recommendations must be served via REST APIs and displayed in the frontend dashboard.

---

## 3. Non-Functional Requirements

### 3.1 Security
- **NFR-SEC-01**: All data transmissions over network interfaces must be encrypted using TLS (HTTPS).
- **NFR-SEC-02**: Store passwords as one-way hashed values using the `bcrypt` algorithm. Plaintext passwords must never hit the database.
- **NFR-SEC-03**: Protect database credentials, API keys, and JWT secrets using environment variables; they must never be committed to repository codebases.

### 3.2 Scalability
- **NFR-SCA-01**: The Express backend must utilize MySQL Connection Pooling to handle concurrent queries efficiently.
- **NFR-SCA-02**: Implement horizontal scalability by designing the backend services to be stateless, enabling containerized scaling behind load balancers.
- **NFR-SCA-03**: The AI module must run as an independent microservice so that computationally expensive ML training or inference does not block Node.js event-loop operations.

### 3.3 Availability
- **NFR-AVA-01**: The system must expose `/health` check endpoints on all services (React, Node, Flask) to allow container orchestrators (like Kubernetes) or monitoring tools to monitor status.
- **NFR-AVA-02**: The platform target uptime is 99.9%, supported by database replication and automated service recovery.

### 3.4 Performance
- **NFR-PER-01**: All REST API responses (excluding complex analytics generating raw data) must resolve within less than 200ms under standard loads.
- **NFR-PER-02**: Heavy read operations (like inventory lists and product catalogs) should be indexed in MySQL on foreign keys and frequently filtered columns.
- **NFR-PER-03**: The frontend React app must implement code-splitting/lazy-loading for routes to keep initial bundle sizes below 2MB.

### 3.5 Backup & Disaster Recovery
- **NFR-BAC-01**: Database configurations must run automated daily snapshots with backups stored off-site in cloud storage (e.g. AWS S3) with a 30-day retention policy.
- **NFR-BAC-02**: Database recovery point objective (RPO) must be less than 24 hours, and recovery time objective (RTO) must be less than 4 hours.

### 3.6 Responsive Design
- **NFR-UI-01**: The user interface must utilize a mobile-first, responsive grid framework (Tailwind CSS) to support desktops (1920x1080), tablets (768x1024), and mobile smartphones (360x800).
- **NFR-UI-02**: Complex data tables must failover gracefully into card lists or scrollable responsive components on smaller viewports.

### 3.7 Cloud Ready & Deployment
- **NFR-CLD-01**: Configuration parameters must be externalized using standard 12-factor app principles via environments.
- **NFR-CLD-02**: Project structure must facilitate running services via Docker containers (`Dockerfile` and `docker-compose` prepared for future deployment phases).

### 3.8 API Security & Policies
- **NFR-API-01**: CORS policy must restrict API access exclusively to whitelisted frontend domain names.
- **NFR-API-02**: Implement Rate Limiting (`express-rate-limit`) on sensitive endpoints like `/api/v1/auth/login` (maximum 5 requests per minute per IP address) and general API endpoints (maximum 100 requests per 15 minutes).
- **NFR-API-03**: Sanitize inputs to protect against Cross-Site Scripting (XSS) and SQL Injection attacks using parameterization, helmet middleware, and validation libraries.
