import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Lightbulb, 
  Zap 
} from 'lucide-react';

export default function AiInsightsView({ onNavigate }) {
  const [insights, setInsights] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/dashboard/insights')
      .then(res => res.json())
      .then(res => { if (res.data) setInsights(res.data); });
  }, []);

  const categories = ['All', 'Sales CRM', 'Finance', 'Inventory', 'HR & Payroll'];

  const filteredInsights = filter === 'All' 
    ? insights 
    : insights.filter(i => i.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Smart Business Insights & AI Engine</h1>
            <p className="text-slate-400 text-xs mt-1">
              Automated operational advice synthesized from real-time sales pipeline, stock levels, and cash flow trends.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === cat
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInsights.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 space-y-4 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                {item.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> {item.impact}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-indigo-300 transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {item.message}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Status: Automated Action Available</span>
              <button
                onClick={() => onNavigate(item.targetModule)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
              >
                <span>{item.actionText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
