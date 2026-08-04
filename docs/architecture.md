# NexBiz - Software Architecture Document

This document provides a comprehensive overview of the NexBiz architecture, mapping out the components, data flows, integration points, and overall system design.

---

## 1. System Architecture Overview

NexBiz is designed using a **decoupled three-tier client-server architecture** composed of a React Single Page Application (SPA), a stateless Express.js REST API server, and a specialized Python Flask microservice for machine learning capabilities, all backed by a normalized MySQL relational database.

```mermaid
graph TD
    %% Client Tier
    subgraph Client Tier [Client Tier - React + Vite + Tailwind CSS]
        Browser[Web Browser]
        ReactApp[React SPA Components]
        StateMgmt[Context API / Hooks]
        ChartJS[Chart.js View Engines]
        Browser --> ReactApp
        ReactApp --> StateMgmt
        ReactApp --> ChartJS
    end

    %% Web Gateway
    RazorpayGateway[Razorpay Payment Gateway API]

    %% Application Tier
    subgraph App Tier [Application Tier]
        NodeServer[Node.js / Express REST API]
        FlaskServer[Flask AI Microservice]
        
        %% Express Components
        AuthMW[JWT Auth Middleware]
        RBACMW[RBAC Middleware]
        Controllers[API Controllers]
        Models[Models & Query Builder]
        
        NodeServer --> AuthMW
        AuthMW --> RBACMW
        RBACMW --> Controllers
        Controllers --> Models
        
        %% Flask Components
        FlaskControllers[Flask API Handlers]
        PredictiveModel[Scikit-Learn ML Models]
        FlaskServer --> FlaskControllers
        FlaskControllers --> PredictiveModel
    end

    %% Database Tier
    subgraph DB Tier [Database Tier]
        MySQL[(MySQL RDBMS)]
    end

    %% Connections
    StateMgmt -- HTTPS/JSON Requests --> NodeServer
    RazorpayGateway -- Webhooks --> NodeServer
    StateMgmt -- Embed Checkout Script --> RazorpayGateway
    NodeServer -- REST Requests --> FlaskServer
    Models -- Connection Pool --> MySQL
    FlaskServer -- Read-Only Batch Query --> MySQL
```

---

## 2. Component Specifications

### 2.1 Frontend Architecture
- **Framework**: React.js structured as a Single Page Application (SPA) compiled using **Vite** for rapid hot-reloads and optimized tree-shaken builds.
- **Styling**: **Tailwind CSS** utilizing mobile-first grid and flexbox utility utility layers.
- **Routing**: `react-router-dom` handles client-side routing, protected routes based on auth state, and dynamic route loading.
- **State Management**: React Context API handles global states (user sessions, settings, theme controls) coupled with custom React Hooks (`useAuth`, `useFetch`) to coordinate backend API calls.
- **Data Visualizations**: Responsive charts generated dynamically via `chart.js` wrapping Canvas layouts.

### 2.2 Backend Architecture
- **Environment**: Node.js runtime hosting an Express.js web framework application.
- **Pattern**: Model-View-Controller (MVC) pattern (with the View handled in the frontend React tier).
  - **Routes**: Decouples URLs and matches endpoints to specific controller actions.
  - **Middleware**: Processes requests before route-handlers execute (e.g. rate-limiting, request sanitization, authentication, RBAC checks).
  - **Controllers**: Evaluates business logic, aggregates data, and returns standard JSON payloads.
  - **Models**: Defines database schemas, validation rules, and queries MySQL.
- **Database Connection**: `mysql2/promise` using connection pool configurations with limits (`connectionLimit: 10`, `queueLimit: 0`, `idleTimeout: 60000`).

### 2.3 AI Microservice Architecture
- **Environment**: Python Flask engine hosting machine learning inference APIs.
- **Toolkit**: Scikit-Learn for statistical calculations (regression for sales trend forecasting, classification/clustering for inventory item replenishment recommendations).
- **Integration**: The Node.js server communicates with the Flask microservice over internal HTTP REST APIs. The Flask server performs lightweight reads on the MySQL database when re-training models, or consumes payload data sent directly by Node.js.

---

## 3. Core System Data Flows

### 3.1 Authentication Flow (JWT + Cookies)
The platform uses signed JSON Web Tokens (JWT) stored in HTTP-Only, Secure cookies to prevent XSS-based token theft.

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Express as Express.js Server
    participant DB as MySQL DB

    User->>Express: POST /api/v1/auth/login {email, password}
    Express->>DB: Query user records by email
    DB-->>Express: Return user record (hashed password, role)
    Express->>Express: bcrypt.compare(password, hash)
    alt Password Matches
        Express->>Express: Generate JWT (signed with payload: userId, role, businessId)
        Express-->>User: Set HTTP-Only Cookie (token) + Return JSON {success: true, user}
    else Password Mismatch
        Express-->>User: Return HTTP 401 {success: false, error: 'Invalid credentials'}
    end
```

### 3.2 Invoice Payment Flow (Razorpay + Webhook)
Ensures payments are captured and verified asynchronously, making the transaction process secure and resilient to network dropouts.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer Browser
    participant React as React App
    participant Express as Express.js Server
    participant DB as MySQL DB
    participant Razorpay as Razorpay API

    Customer->>React: Click "Pay Invoice"
    React->>Express: POST /api/v1/payments/create-order {invoiceId}
    Express->>DB: Fetch invoice details (amount)
    DB-->>Express: Invoice details
    Express->>Razorpay: Create Order API request {amount, currency: "INR"}
    Razorpay-->>Express: Return Razorpay Order Object (id, amount)
    Express-->>React: Send Order Details + Key ID
    React->>Customer: Launch Razorpay Checkout Modal
    Customer->>Razorpay: Input credentials & Authorized Payment
    Razorpay-->>Customer: Capture successful payment
    alt Frontend Redirect
        Razorpay-->>React: Payment signature payloads
        React->>Express: POST /api/v1/payments/verify {signature, paymentId, orderId}
        Express->>Express: Cryptographically verify signature
        Express->>DB: Update Invoice status to "Paid"
        Express-->>React: Payment confirmed
    end
    
    %% Webhook Fallback
    note over Razorpay, Express: Webhook triggers asynchronously in parallel for reliability
    Razorpay->>Express: POST Webhook: payment.captured {payload}
    Express->>Express: Verify Webhook Signature using secret
    Express->>DB: Update Invoice status to "Paid" (if not already done)
    Express->>DB: Log Transaction Record inside `payments`
```

### 3.3 AI Recommendation Flow
Generates operational recommendations asynchronously based on business historical activity.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Business Owner
    participant React as React Dashboard
    participant Node as Express Backend
    participant Flask as Flask AI Service
    participant DB as MySQL DB

    Owner->>React: Navigate to Analytics / Recommendations tab
    React->>Node: GET /api/v1/recommendations/insights
    alt Cache Miss / Re-evaluation Required
        Node->>Flask: POST /predict/replenishment {businessId}
        Flask->>DB: Query sales velocity & stock logs
        DB-->>Flask: Transaction & Stock datasets
        Flask->>Flask: Execute ML pipeline (Predict Demand & Reorder Levels)
        Flask-->>Node: Return recommendation payload (JSON array)
        Node->>DB: Cache recommendations in `recommendations` table
    end
    Node-->>React: Send insights dataset (reorder products, sales trends)
    React->>Owner: Display formatted UI charts & checklist cards
```
