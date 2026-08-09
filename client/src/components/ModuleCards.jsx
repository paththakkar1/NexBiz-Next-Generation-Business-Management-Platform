import React from 'react';
import { Users, Target, FileSpreadsheet, PackageCheck, Briefcase, ChevronRight, Database, Shield } from 'lucide-react';

export default function ModuleCards() {
  const modules = [
    {
      id: 'crm',
      name: 'Customer Relationship (CRM)',
      description: 'Manage lead pipelines, customer accounts, follow-up dates, and conversion statuses.',
      icon: Users,
      table: 'customers, leads',
      badge: 'Active Module',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'invoicing',
      name: 'Invoicing & GST Billing',
      description: 'Generate tax compliant invoices with automatic CGST/SGST/IGST calculation support.',
      icon: FileSpreadsheet,
      table: 'invoices',
      badge: 'GST Enabled',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'inventory',
      name: 'Inventory & Products',
      description: 'Track stock quantities, low-stock threshold triggers, SKUs, and item category pricing.',
      icon: PackageCheck,
      table: 'products',
      badge: 'Stock Alerts',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'hr',
      name: 'HR & Employee Directory',
      description: 'Departmental categorization, designation records, salary logs, and user profile binding.',
      icon: Briefcase,
      table: 'employees, users',
      badge: 'RBAC Bound',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" /> Platform Architecture Roadmap
          </h2>
          <p className="text-xs text-slate-400">Core database tables and business modules linked via foreign key constraints</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-100 group-hover:text-indigo-300 transition">
                        {mod.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">Tables: {mod.table}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 group-hover:text-indigo-400 font-medium">
                <span>Explore Schema & Endpoints</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
