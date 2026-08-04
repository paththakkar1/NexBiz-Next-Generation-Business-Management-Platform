# NexBiz – Next-Generation Business Management Platform

NexBiz is a comprehensive, multi-tenant cloud-based SaaS Business Management Platform that integrates Customer Relationship Management (CRM), Inventory Management, Invoice & Billing, Razorpay Payments, Employee & Payroll Management, Business Analytics, and AI-powered Business Recommendations into a single, intuitive dashboard.

Designed for scalability, security, and high performance, NexBiz serves as the operational engine for modern businesses.

---

## 🚀 Key Features

- **Decoupled Multi-Tenancy**: Shared database, shared schema model isolating tenant accounts via a `business_id` query filter.
- **Robust Role-Based Access Control (RBAC)**: Fine-grained user permission validation (Super Admin, Business Owner, Manager, Employee, Customer).
- **Core CRM**: End-to-end sales pipelines, lead capturing, customer tracking, and account management.
- **Automated Inventory**: Product stock management with automated transaction decrements, low-stock triggers, and supplier restock logs.
- **Invoice & Online Payments**: Instant invoice generation with customizable tax calculations and card/UPI payment processing via **Razorpay API** with automated Webhook payment state updates.
- **HR & Payroll Ledger**: Monthly payroll computation with attendance integrations, base salaries, deductions, taxes, and downloadable payslips.
- **Data Visualizations**: Dashboard analytics tracking sales volumes and financial distributions using **Chart.js**.
- **AI Recommendation Engine**: Python Flask machine learning service leveraging **Scikit-Learn** to forecast sales and predict inventory reorder frequencies.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Chart.js, React Router
- **Backend**: Node.js, Express.js, JWT, bcrypt, mysql2 (Connection Pooling)
- **Database**: MySQL Server (v8.0+)
- **AI Module**: Python Flask (v3.0+), Scikit-Learn, Pandas, NumPy
- **Payment Gateway**: Razorpay REST API & Webhooks
- **Version Control**: Git & GitHub

---

## 📂 Folder Structure

The project repository is structured for clean separation of concerns:

```
NexBiz-Next-Generation-Business-Management-Platform/
├── .env.example              # Environment variables template
├── .gitignore                # Root gitignore rules
├── LICENSE                   # MIT License
├── README.md                 # Project main documentation
├── database/
│   └── schema.sql            # MySQL schema script
├── docs/
│   ├── architecture.md       # Architecture specification
│   ├── requirements.md       # Requirements specification
│   ├── database_design.md    # Data dictionary & ER diagram
│   ├── api_documentation.md  # REST API specification
│   └── setup_guide.md        # Installation & setup guide
├── frontend/                 # Client React Application
│   ├── public/
│   └── src/
│       ├── assets/           # Global styles and static images
│       ├── components/       # Reusable UI components
│       ├── context/          # Global Context state providers
│       ├── hooks/            # Custom React hooks (useAuth, useFetch)
│       ├── layouts/          # Page layouts (Sidebar, Header, Footer)
│       ├── pages/            # Full page views (Dashboard, CRM, Invoices)
│       ├── services/         # API abstraction layers (Axios instances)
│       └── utils/            # Shared helper functions
├── backend/                  # Server Node/Express Application
│   ├── config/               # DB connection and Razorpay credentials
│   ├── controllers/          # Endpoint controllers handling business logic
│   ├── middleware/           # Auth, RBAC, Rate-limiter, Error handler
│   ├── models/               # Direct DB queries and schemas
│   ├── routes/               # Express routing tables
│   ├── services/             # Integrations (Razorpay, Email, Ws)
│   ├── utils/                # Backend helper utilities
│   └── uploads/              # File storage directory
└── ai-service/               # Python ML Recommendation Microservice
    ├── app/                  # Flask routes and predictors
    ├── models/               # Pickled Scikit-Learn models
    ├── utils/                # DB queries & data transformation logic
    └── scripts/              # ML training and evaluation scripts
```

---

## 🗄️ Database Design

NexBiz features 19 normalized relational tables designed for transactional integrity:

1. **Access**: `roles`, `permissions`, `role_permissions`, `users`
2. **CRM**: `customers`, `leads`
3. **Inventory**: `categories`, `suppliers`, `products`, `inventory`
4. **Sales & Payments**: `sales`, `invoices`, `invoice_items`, `payments`
5. **Staff Management**: `employees`, `payroll`, `attendance`
6. **Platform Services**: `notifications`, `analytics`, `recommendations`

For details on relationships and keys, review the [Database Design Document](file:///c:/USELESS%20THINGS%202/INTERSHIP%F0%9F%97%91%EF%B8%8F/NexBiz-Next-Generation-Business-Management-Platform/docs/database_design.md) and the [MySQL Schema SQL script](file:///c:/USELESS%20THINGS%202/INTERSHIP%F0%9F%97%91%EF%B8%8F/NexBiz-Next-Generation-Business-Management-Platform/database/schema.sql).

---

## 📈 Development Roadmap

### 🏁 Phase 1: Planning, Architecture & DB Design (Week 1)
- [x] Analyze requirements, roles, & permissions matrix.
- [x] Establish system architecture & workflows (JWT auth, payments, and AI).
- [x] Database schemas modeled to 3NF & SQL initialization script.
- [x] Standard environment configs & directory setup.

### 💻 Phase 2: Core Server & UI Foundation (Weeks 2-3)
- [ ] Initialize Express.js backend & setup database connections pool.
- [ ] Implement JWT auth, RBAC routes, and error logging.
- [ ] Initialize React frontend, design component design system & global layout.
- [ ] Build CRM page (Customer registers, lead stages) & Product catalog UI.

### 💰 Phase 3: Transactions, Payments & Payroll (Weeks 4-5)
- [ ] Implement Invoice generator engine.
- [ ] Integrate Razorpay payments with secure cryptographic webhook verifiers.
- [ ] Construct staff directories, shift attendance logs, and payroll builders.
- [ ] Add real-time event updates using notifications channel.

### 🤖 Phase 4: AI Recommendations & Charts (Weeks 6-7)
- [ ] Spawn Flask service, ingest sales data, and train predictive models.
- [ ] Expose predictive endpoints to supply replenishment recommendations.
- [ ] Integrate responsive Chart.js widgets to frontend analytics boards.
- [ ] Perform comprehensive end-to-end security audits & cloud deployments.

---

## 🛠️ Getting Started

To launch the project locally, please review the complete [Setup Guide](file:///c:/USELESS%20THINGS%202/INTERSHIP%F0%9F%97%91%EF%B8%8F/NexBiz-Next-Generation-Business-Management-Platform/docs/setup_guide.md).

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/NexBiz-Next-Generation-Business-Management-Platform.git
   cd NexBiz-Next-Generation-Business-Management-Platform
   ```
2. Initialize MySQL database using `database/schema.sql`.
3. Set up environment variables in both `backend/` and `frontend/` directories.
4. Launch backend:
   ```bash
   cd backend && npm run dev
   ```
5. Launch frontend:
   ```bash
   cd frontend && npm run dev
   ```
6. Launch Flask AI service:
   ```bash
   cd ai-service && .\venv\Scripts\activate && python app.py
   ```

---

## 🖼️ Screenshots
*(Screenshots showing Dashboard, CRM pipelines, and Invoice generators will be added during UI construction in Phase 2)*

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](file:///c:/USELESS%20THINGS%202/INTERSHIP%F0%9F%97%91%EF%B8%8F/NexBiz-Next-Generation-Business-Management-Platform/LICENSE) file for details.
