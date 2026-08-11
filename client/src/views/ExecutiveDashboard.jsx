import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Package, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon
} from 'lucide-react';

export default function ExecutiveDashboard({ onNavigate }) {
  const [overview, setOverview] = useState({
    totalRevenue: '₹5,83,000',
    activeLeadsCount: 4,
    lowStockCount: 2,
    pendingPayroll: '₹3,17,500'
  });
  const [insights, setInsights] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard/overview')
      .then(res => res.json())
      .then(res => { if (res.data) setOverview(res.data); })
      .catch(() => console.log('Using static overview metrics'));

    fetch('/api/dashboard/insights')
      .then(res => res.json())
      .then(res => { if (res.data) setInsights(res.data); })
      .catch(() => console.log('Using default insights dataset'));
  }, []);

  const monthlySales = [
    { month: 'Jan', revenue: 240000, target: 200000 },
    { month: 'Feb', revenue: 310000, target: 250000 },
    { month: 'Mar', revenue: 280000, target: 250000 },
    { month: 'Apr', revenue: 420000, target: 350000 },
    { month: 'May', revenue: 390000, target: 350000 },
    { month: 'Jun', revenue: 510000, target: 450000 },
    { month: 'Jul', revenue: 583000, target: 500000 }
  ];

  const pipelineStages = [
    { stage: 'Lead', value: 320000, color: 'bg-indigo-500' },
    { stage: 'Contacted', value: 820000, color: 'bg-blue-500' },
    { stage: 'Qualified', value: 450000, color: 'bg-purple-500' },
    { stage: 'Won', value: 650000, color: 'bg-emerald-500' },
    { stage: 'Lost', value: 180000, color: 'bg-red-500' }
  ];

  const maxRevenue = Math.max(...monthlySales.map(s => s.revenue));
  const maxPipelineVal = Math.max(...pipelineStages.map(s => s.value));

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-indigo-950 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Live Operating Environment
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Indian SaaS Context
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Centralized Executive Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Real-time operating analytics across sales pipeline, GST invoicing ledger, inventory threshold alerts, and payroll disbursements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('invoices')}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 shrink-0"
            >
              + Create Invoice <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold text-white tracking-tight">{overview.totalRevenue}</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +16.4% vs last month
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Leads</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400"><Users className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold text-white tracking-tight">{overview.activeLeadsCount} Deals</p>
            <p className="text-xs text-slate-400 mt-1">₹24.2L Pipeline Opportunity</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400"><Package className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold text-amber-400 tracking-tight">{overview.lowStockCount} SKUs Low</p>
            <p className="text-xs text-slate-400 mt-1">Below safety threshold</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Payroll</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400"><Briefcase className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold text-white tracking-tight">{overview.pendingPayroll}</p>
            <p className="text-xs text-slate-400 mt-1">3 Active Employees</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart SVG Component */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <LineIcon className="w-5 h-5 text-indigo-400" /> Monthly Revenue & Sales Target Trend
              </h3>
              <p className="text-xs text-slate-400">Comparison of actual revenue collected vs set targets (INR)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              2026 YTD
            </span>
          </div>

          {/* SVG Visual Graph Container */}
          <div className="relative pt-6 pb-2 px-2">
            <div className="h-60 w-full flex items-end justify-between gap-2 border-b border-slate-800 pb-2 relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
              </div>

              {monthlySales.map((item, index) => {
                const heightPct = (item.revenue / maxRevenue) * 100;
                const targetPct = (item.target / maxRevenue) * 100;
                return (
                  <div 
                    key={item.month}
                    className="flex-1 flex flex-col items-center gap-2 group relative z-10"
                    onMouseEnter={() => setHoveredPoint(item)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Tooltip Hover */}
                    {hoveredPoint?.month === item.month && (
                      <div className="absolute -top-12 bg-slate-900 border border-slate-700 p-2 rounded-xl text-center shadow-xl z-20 pointer-events-none text-xs whitespace-nowrap">
                        <p className="font-bold text-indigo-300">{item.month}: ₹{item.revenue.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-emerald-400">Target: ₹{item.target.toLocaleString('en-IN')}</p>
                      </div>
                    )}

                    <div className="w-full flex items-end justify-center gap-1.5 h-48 relative">
                      {/* Target Pill Bar */}
                      <div 
                        style={{ height: `${targetPct}%` }} 
                        className="w-1.5 bg-emerald-500/30 rounded-t transition-all" 
                        title={`Target: ₹${item.target}`} 
                      />
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: `${heightPct}%` }} 
                        className="w-4 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t shadow-lg shadow-indigo-500/20 group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all" 
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition">{item.month}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-500" />
                <span>Actual Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/40" />
                <span>Target Goal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Bar Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Pipeline Stage Value
            </h3>
            <p className="text-xs text-slate-400">Total deal value aggregated by stage</p>
          </div>

          <div className="space-y-4 pt-4">
            {pipelineStages.map((item) => {
              const widthPct = (item.value / maxPipelineVal) * 100;
              return (
                <div key={item.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item.stage}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ₹{item.value.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      style={{ width: `${widthPct}%` }} 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Smart Business Insights Section */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                Smart Business Recommendations (AI Engine)
              </h3>
              <p className="text-xs text-slate-400">Data-driven automated suggestions to optimize operating cash flow & stock levels</p>
            </div>
          </div>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            Real-Time Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {insights.map((item) => (
            <div 
              key={item.id}
              className="p-4 rounded-xl glass-card border border-slate-800 hover:border-indigo-500/40 flex flex-col justify-between space-y-3 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{item.impact}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.message}</p>
              </div>

              <button
                onClick={() => onNavigate(item.targetModule)}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 text-xs font-semibold flex items-center justify-between transition group"
              >
                <span>{item.actionText}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
