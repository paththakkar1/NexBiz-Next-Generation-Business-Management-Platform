import React from 'react';
import { Users, TrendingUp, Receipt, Package, ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function DashboardOverview({ stats }) {
  const metrics = [
    {
      title: 'Active Customers',
      value: stats?.activeCustomers || '124',
      change: '+14% this month',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Leads & Pipeline',
      value: stats?.totalLeads || '48',
      change: '₹12,80,000 potential value',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Pending Invoices (GST)',
      value: stats?.pendingInvoicesAmount || '₹4,52,000',
      change: '18% GST Compliance Ready',
      icon: Receipt,
      color: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    },
    {
      title: 'Inventory Alert',
      value: `${stats?.lowStockItemsCount || 5} SKUs`,
      change: 'Low stock threshold triggered',
      icon: Package,
      color: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/80 border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              NexBiz Operating Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Indian SaaS Business Suite with relational MySQL schema & multi-tenant ready modular backend.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              GST Ready (HSN/SAC)
            </span>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2">
              New Transaction <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl glass-card border ${item.borderColor} bg-gradient-to-br ${item.color} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-900/80 ${item.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="font-display text-2xl font-bold text-white tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  {item.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
