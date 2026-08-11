import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export default function InventoryView() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('products'); // 'products' or 'movements'
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Hardware', price: '', stock_quantity: '10', low_stock_threshold: '5', unit: 'Pcs'
  });

  const [movementForm, setMovementForm] = useState({
    product_id: '', movement_type: 'IN', quantity: '10', reference: 'PO-2026-IN', notes: 'Warehouse intake'
  });

  const fetchInventoryData = () => {
    fetch('/api/inventory/products')
      .then(res => res.json())
      .then(res => { if (res.data) setProducts(res.data); });

    fetch('/api/inventory/movements')
      .then(res => res.json())
      .then(res => { if (res.data) setMovements(res.data); });
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    fetch('/api/inventory/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setProducts([res.data, ...products]);
          setShowAddProductModal(false);
        }
      });
  };

  const handleRecordMovement = (e) => {
    e.preventDefault();
    fetch('/api/inventory/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movementForm)
    })
      .then(res => res.json())
      .then(res => {
        fetchInventoryData();
        setShowMovementModal(false);
      });
  };

  const lowStockItems = products.filter(p => p.stock_quantity <= p.low_stock_threshold);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" /> Inventory & Stock Monitoring
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time stock tracking, threshold alert indicators, and incoming/outgoing shipment logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('products')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              SKU Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'movements' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Stock Logs ({movements.length})
            </button>
          </div>

          <button
            onClick={() => setShowMovementModal(true)}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Adjust Stock
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Product SKU
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-300">Low Stock Threshold Warning</h4>
              <p className="text-xs text-slate-400">
                {lowStockItems.length} product(s) have fallen below their safety threshold (e.g. {lowStockItems.map(p => p.name).join(', ')}).
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowMovementModal(true)}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow hover:bg-amber-400 transition shrink-0"
          >
            Log Intake Shipment
          </button>
        </div>
      )}

      {/* Products Table View */}
      {activeSubTab === 'products' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Stock Quantity</th>
                  <th className="p-3">Min Threshold</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map((p) => {
                  const isLow = p.stock_quantity <= p.low_stock_threshold;
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-mono font-bold text-indigo-400">{p.sku}</td>
                      <td className="p-3 font-semibold text-slate-100">{p.name}</td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3 font-mono">₹{parseFloat(p.price).toLocaleString('en-IN')}</td>
                      <td className={`p-3 font-mono font-bold text-sm ${isLow ? 'text-amber-400' : 'text-slate-100'}`}>
                        {p.stock_quantity} {p.unit}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{p.low_stock_threshold} {p.unit}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isLow ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movements Table View */}
      {activeSubTab === 'movements' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Movement Type</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 text-slate-400">{m.created_at?.split('T')[0] || '2026-08-08'}</td>
                    <td className="p-3 font-semibold text-slate-100">{m.product_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.movement_type === 'IN' ? 'bg-emerald-500/10 text-emerald-400' :
                        m.movement_type === 'OUT' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {m.movement_type}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">{m.quantity}</td>
                    <td className="p-3 font-mono text-slate-400">{m.reference}</td>
                    <td className="p-3 text-slate-400">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product SKU Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white">Create New Product SKU</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Scanner 2D"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Hardware / Peripherals"
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={e => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={newProduct.low_stock_threshold}
                    onChange={e => setNewProduct({ ...newProduct, low_stock_threshold: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30">
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white">Record Stock Movement</h3>
              <button onClick={() => setShowMovementModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordMovement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Product *</label>
                <select
                  required
                  value={movementForm.product_id}
                  onChange={e => setMovementForm({ ...movementForm, product_id: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Movement Type</label>
                  <select
                    value={movementForm.movement_type}
                    onChange={e => setMovementForm({ ...movementForm, movement_type: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  >
                    <option value="IN">IN (Shipment Intake)</option>
                    <option value="OUT">OUT (Dispatched Sale)</option>
                    <option value="ADJUSTMENT">ADJUSTMENT (Audit/Damage)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    value={movementForm.quantity}
                    onChange={e => setMovementForm({ ...movementForm, quantity: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowMovementModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30">
                  Log Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
