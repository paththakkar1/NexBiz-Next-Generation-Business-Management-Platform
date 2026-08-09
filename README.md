# 🚀 NexBiz - Next-Generation Business Management Platform

NexBiz is a comprehensive, production-grade Business Management SaaS platform engineered specifically for the Indian enterprise & SMB market context. It combines CRM, Invoicing (GST-compliant), Inventory Management, and HR directory operations into a unified monorepo system.

---

## 🏗️ Tech Stack & Architecture

- **Monorepo Structure**: Concurrent client-server architecture managed via root `package.json`.
- **Frontend Client (`/client`)**: React 18 + Vite + Tailwind CSS + Lucide React + React Router DOM.
- **Backend API (`/server`)**: Node.js + Express.js + CORS + Helmet + Morgan logging + Dotenv.
- **Database**: MySQL 8.0+ using `mysql2/promise` connection pool with foreign key integrity, index optimization, and audit timestamps.

---

## 📂 Repository Layout

```text
NexBiz-Next-Generation-Business-Management-Platform/
├── client/                      # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/          # Header, Dashboard, Module Cards
│   │   ├── App.jsx              # Main Application Container
│   │   ├── main.jsx             # React DOM Entry
│   │   └── index.css            # Tailwind & Glassmorphism Design System
│   ├── index.html               # Web HTML Shell
│   ├── vite.config.js           # Vite Server & API Proxy Rules
│   ├── tailwind.config.js       # Custom SaaS Theme Configuration
│   └── package.json             # Frontend Dependencies
│
├── server/                      # Backend API Server (Node + Express)
│   ├── config/
│   │   ├── db.js                # MySQL2 Connection Pool Utility
│   │   └── schema.sql           # Production Database DDL Script (7 Tables)
│   ├── index.js                 # Express Application Entry Point
│   ├── .env.example             # Server Environment Template
│   └── package.json             # Backend Dependencies
│
├── .env.example                 # Root Environment Variables Template
├── .gitignore                   # Version Control Rules
├── package.json                 # Monorepo Root Script Runner (Concurrently)
└── README.md                    # Project Documentation
```

---

## 🗄️ Database Schema & DDL (`server/config/schema.sql`)

The MySQL database schema contains 7 tables designed for foreign key integrity, cascade options, indexing, and auditing:

1. **`roles`**: System RBAC permissions (`Admin`, `Employee`, `Customer`).
2. **`users`**: User login accounts (`email` indexed, `password_hash`, `role_id` FK).
3. **`customers`**: Customer profiles (`status` & `company_name` indexed, `user_id` FK).
4. **`leads`**: CRM pipeline opportunities (`status` & `follow_up_date` indexed, `customer_id` FK with `ON DELETE CASCADE`).
5. **`products`**: Inventory items (`sku` indexed UNIQUE, low stock threshold triggers).
6. **`invoices`**: Billing transactions (`invoice_number` UNIQUE, `customer_id` FK, `gst_amount` calculation support).
7. **`employees`**: HR records (`user_id` UNIQUE FK, `department` indexed).

### Running Database Migrations:
```bash
# 1. Access MySQL CLI or MySQL Workbench
mysql -u root -p

# 2. Execute the DDL schema script
source /path/to/server/config/schema.sql;
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the `/server` directory (or copy from `.env.example`):

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# MySQL Connection Details
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nexbiz_db
DB_PORT=3306

# Security & CORS
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=nexbiz_super_secret_jwt_key_2026
```

---

## ⚡ Installation & Getting Started

### 1. Install Dependencies Across Monorepo
From the repository root directory, run:
```bash
npm run install:all
```

### 2. Running in Development Mode
Launch both backend Express server and frontend Vite server concurrently:
```bash
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Individual Component Execution
- **Run Server Only**: `npm run dev:server`
- **Run Client Only**: `npm run dev:client`

---

## 🛡️ Key Features & Architectural Highlights

- **Security Hardening**: Express configured with `helmet` HTTP header protections, CORS origin restrictions, and error isolation.
- **Connection Resilience**: `mysql2/promise` connection pool featuring connection validation on server startup.
- **Modern Design System**: Dynamic dark theme with custom glassmorphism panels, responsive grid cards, typography hierarchy (Outfit & Inter fonts), and real-time backend connection status indicators.

---

## 📜 License
ISC License © NexBiz Engineering Team.
