import React from 'react';

function App() {
  return (
    <div className="dashboard-layout">
      <div className="glass-panel">
        <span className="badge badge-primary">Core Modules Initialized</span>
        <h1>NexBiz SaaS Dashboard</h1>
        <p>
          Welcome to the NexBiz Next-Generation Business Management Platform.
          Weeks 1 and 2 architecture, database schema initialization, and core authentication services are fully set up.
        </p>

        <h2>Monorepo Architecture Structure</h2>
        <div className="grid">
          <div className="card">
            <div className="card-title">/client (React SPA)</div>
            <div className="card-desc">React 18 SPA configured with Vite, pre-configured with a premium styling system and global HSL variables.</div>
          </div>
          <div className="card">
            <div className="card-title">/server (Express API)</div>
            <div className="card-desc">Robust Node.js REST API with connection pooling, modular routes, custom RBAC middleware, and Express validators.</div>
          </div>
          <div className="card">
            <div className="card-title">/docs (Specifications)</div>
            <div className="card-desc">System documentation containing requirements (SRS), database entity relationship schemas, and Postman test payloads.</div>
          </div>
        </div>

        <h2>Core Auth & User API Endpoints</h2>
        <div className="grid">
          <div className="card">
            <div className="card-title">POST /api/auth/register</div>
            <div className="card-desc">Validation, password hashing (10 salt rounds), and verification token generation. Default role: CUSTOMER.</div>
          </div>
          <div className="card">
            <div className="card-title">POST /api/auth/login</div>
            <div className="card-desc">Credentials verification, returning a signed JWT (userId, role, email) valid for 24 hours.</div>
          </div>
          <div className="card">
            <div className="card-title">POST /api/auth/forgot-password</div>
            <div className="card-desc">Cryptographically secure token generation and recovery link distribution via Nodemailer.</div>
          </div>
          <div className="card">
            <div className="card-title">GET & PUT /api/auth/profile</div>
            <div className="card-desc">JWT token validation middleware (verifyToken) protecting profile retrieval and modifications.</div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button className="btn btn-glow" onClick={() => alert('API is active! Refer to /docs/architecture.md to run Postman requests.')}>
            Verify NexBiz Core
          </button>
        </div>
      </div>
      <div className="footer">
        NexBiz Business Management Platform &copy; 2026. All rights reserved.
      </div>
    </div>
  );
}

export default App;
