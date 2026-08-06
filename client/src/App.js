import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileSpreadsheet, 
  LogOut, 
  TrendingUp, 
  Bell, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Common Layout Component
function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="ambient-glow" style={{ top: '-10%', left: '-10%' }} />
      <div className="ambient-glow" style={{ bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)' }} />
      
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{ width: '260px', margin: '16px', marginRight: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>
            Nex<span style={{ color: 'var(--accent-primary)' }}>Biz</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise Monorepo v1.0</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link to="/" style={navLinkStyle}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/customers" style={navLinkStyle}>
            <Users size={18} /> Customers (CRM)
          </Link>
          <Link to="/products" style={navLinkStyle}>
            <Package size={18} /> Products (Inventory)
          </Link>
          <Link to="/invoices" style={navLinkStyle}>
            <FileSpreadsheet size={18} /> Invoices
          </Link>
        </nav>
        
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Demo Admin</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>admin@nexbiz.com</p>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Workstation</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: 'var(--color-danger)', borderRadius: '50%' }} />
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }} />
          </div>
        </header>
        
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  transition: 'var(--transition-smooth)'
};

// Pages
function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Leads</p>
          <h3 style={{ fontSize: '2rem', marginTop: '8px' }}>1,248</h3>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: '4px' }}><TrendingUp size={12} /> +12.4% this week</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Invoiced Revenue</p>
          <h3 style={{ fontSize: '2rem', marginTop: '8px' }}>$48,259.00</h3>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: '4px' }}><TrendingUp size={12} /> +8.2% this week</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Low Stock Items</p>
          <h3 style={{ fontSize: '2rem', marginTop: '8px', color: 'var(--color-warning)' }}>4 Products</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>Requires immediate reordering</p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Database & Service Health Check</h4>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> Node Express API: OK (Port 5000)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> MySQL Database: OK
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> Flask AI Engine: OK (Port 8000)
          </div>
        </div>
      </div>
    </div>
  );
}

function Customers() {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Customers & Leads Directory</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Company</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '12px' }}>John Doe</td>
            <td style={{ padding: '12px' }}>Acme Corp</td>
            <td style={{ padding: '12px' }}>john.doe@acme.com</td>
            <td style={{ padding: '12px' }}><span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Customer</span></td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '12px' }}>Jane Smith</td>
            <td style={{ padding: '12px' }}>Cyberdyne Systems</td>
            <td style={{ padding: '12px' }}>jane.smith@cyberdyne.co</td>
            <td style={{ padding: '12px' }}><span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Lead</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Products() {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Inventory Management</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '12px' }}>SKU</th>
            <th style={{ padding: '12px' }}>Product Name</th>
            <th style={{ padding: '12px' }}>Unit Price</th>
            <th style={{ padding: '12px' }}>Stock Qty</th>
            <th style={{ padding: '12px' }}>Reorder Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '12px' }}>PROD-SKU-001</td>
            <td style={{ padding: '12px' }}>Enterprise Cloud Node</td>
            <td style={{ padding: '12px' }}>$499.00</td>
            <td style={{ padding: '12px' }}>42</td>
            <td style={{ padding: '12px' }}><span style={{ color: 'var(--color-success)' }}>Healthy</span></td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '12px' }}>PROD-SKU-002</td>
            <td style={{ padding: '12px' }}>Local Server Array 5TB</td>
            <td style={{ padding: '12px' }}>$1,200.00</td>
            <td style={{ padding: '12px', color: 'var(--color-danger)' }}>4</td>
            <td style={{ padding: '12px' }}><span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> Reorder Alert</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Invoices() {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Invoices Ledger</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '12px' }}>Invoice #</th>
            <th style={{ padding: '12px' }}>Due Date</th>
            <th style={{ padding: '12px' }}>Total Amount</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '12px' }}>INV-2026-001</td>
            <td style={{ padding: '12px' }}>2026-08-30</td>
            <td style={{ padding: '12px' }}>$4,520.00</td>
            <td style={{ padding: '12px' }}><span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Paid</span></td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '12px' }}>INV-2026-002</td>
            <td style={{ padding: '12px' }}>2026-08-15</td>
            <td style={{ padding: '12px' }}>$12,480.00</td>
            <td style={{ padding: '12px' }}><span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Overdue</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
