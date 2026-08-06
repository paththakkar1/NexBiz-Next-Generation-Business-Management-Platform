# Software Requirements Specification (SRS) - NexBiz

NexBiz is a comprehensive business management system targeting SMEs. This document outlines the functional and non-functional requirements for the platform.

---

## 1. Functional Requirements

### 1.1 Authentication & Authorization (RBAC)
- **User Registration & Login**: Standard registration with email verification. Secure bcrypt password hashing.
- **Role-Based Access Control**:
  - `Admin`: Full system access, employee management, financial oversight.
  - `Employee`: Can manage leads, customers, inventory, and raise invoices.
  - `Customer`: View-only access to their own profile, order history, and assigned invoices.
- **Token Authorization**: Secure session handling using JSON Web Tokens (JWT).

### 1.2 Customer Relationship Management (CRM)
- **Lead Tracking**: Log new leads with details (company, contact, email, phone, status).
- **Status Lifecycle**: Transition customers through standard states: `Lead` ➡️ `Contacted` ➡️ `Qualified` ➡️ `Customer` ➡️ `Lost`.
- **Assignment**: Employees are assigned specific customers to manage follow-ups.

### 1.3 Inventory & Stock Management
- **Product Details**: Log products with SKU, category, unit price, stock quantity, and reorder levels.
- **Reorder Alerts**: Flag products whose `stock_quantity` falls below `reorder_level`.

### 1.4 Invoicing & Billing
- **Invoice Generation**: Generate standard invoices linked to customer accounts with computed total amounts and tax rates.
- **Payment Lifecycle**: Support statuses like `Unpaid`, `Paid`, `Overdue`, and `Cancelled`.
- **Relationship Integrity**: Deleting a customer automatically cascades and cleans up their associated invoices.

---

## 2. Non-Functional Requirements

### 2.1 Security & Compliance
- **Password Security**: Force hashing via `bcryptjs`.
- **Data Protection**: Implement HTTP headers security via `helmet`.
- **CORS Policies**: Explicit cross-origin request handling to prevent unauthorized client calls.

### 2.2 Performance & Scalability
- **Database Query Latency**: High-traffic search fields (email, SKU, status) are backed by custom MySQL B-Tree indices to ensure sub-millisecond retrieval.
- **Decoupled Architecture**: High-computational load (analytics & predictive modeling) is offloaded to a standalone Python Flask microservice to keep the core Node Express app responsive.

### 2.3 Reliability & Availability
- **Database Transactions**: InnoDB database engine ensures ACID transaction properties.
- **Error Handling**: Graceful error handling in controllers with descriptive API logs.
