# NexBiz - Next-Generation Business Management Platform

NexBiz is an enterprise-grade, monorepo-structured Business Management Platform designed to streamline customer relationship management (CRM), inventory tracking, invoicing, and analytics.

---

## 🏗️ Monorepo Architecture

The repository is structured as a decoupled monorepo containing three core services:

```text
nexbiz-platform/
├── .github/
│   └── workflows/          # CI/CD pipeline definitions
├── client/                 # React.js Frontend (SPA)
├── server/                 # Node.js Express Core REST API
├── ai-service/             # Python Flask Analytics Engine
├── docs/                   # SRS, Architecture, & ER schemas
├── .gitignore
└── README.md
```

- **Frontend (`client/`)**: Built with React.js using standard Routing and Axios integration.
- **Backend (`server/`)**: Express API with database integrations via `mysql2/promise` and token-based JWT authentication.
- **AI Analytics Service (`ai-service/`)**: Flask-based REST microservice for business predictive analysis.

---

## 🌿 Git Branching Strategy

We follow a structured branching system to ensure high code quality and stable releases:

- **`main`**: Production-ready code only. Fully tested and stable.
- **`staging`**: Pre-production integration testing environment.
- **`development`**: Active integration branch where feature branches are merged.
- **`feature/<feature-name>`**: Dedicated branches for individual tasks or bug fixes, branched off `development` and merged via reviewed Pull Requests (PRs).

---

## 🛢️ Database Setup (MySQL)

Ensure MySQL is running on your machine.
1. Run the database initialization DDL script located at `docs/schema.sql`:
   ```bash
   mysql -u root -p < docs/schema.sql
   ```
2. The schema creates:
   - `users`: Core account information, authorization, and RBAC support (`Admin`, `Employee`, `Customer`).
   - `customers`: Sales leads and customer records.
   - `products`: Product catalogs with reorder alert support.
   - `invoices`: Sales transactions and invoicing data.
   - Optimized indexes for search and relation keys.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18+ & npm v9+
- **Python**: v3.9+
- **MySQL**: v8.0+

### 1. Server Setup (Express Core)
```bash
cd server
npm install
cp .env.example .env  # Update the environment variables in .env
npm run dev           # Starts server on port 5000 using nodemon
```

### 2. Client Setup (React)
```bash
cd client
npm install
npm start             # Starts webpack dev server on port 3000
```

### 3. AI Analytics Engine Setup (Flask)
```bash
cd ai-service
# It is recommended to create a virtual environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py             # Starts Flask server on port 8000
```
