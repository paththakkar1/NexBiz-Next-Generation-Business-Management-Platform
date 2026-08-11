import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';

export default function InvoicesView() {
  const [invoices, setInvoices] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('invoices'); // 'invoices' or 'ledger'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);

  // Invoice Builder State
  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_email: '',
    due_date: '2026-08-30',
    discount: '0',
    items: [
      { description: 'NexBiz SaaS License Key', quantity: 1, unit_price: 49999 }
    ]
  });

  const fetchInvoices = () => {
    fetch('/api/invoices')
      .then(res => res.json())
      .then(res => { if (res.data) setInvoices(res.data); });

    fetch('/api/invoices/ledger')
      .then(res => res.json())
      .then(res => { if (res.data) setLedger(res.data); });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAddItemRow = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...newInvoice.items];
    updated[index][field] = value;
    setNewInvoice({ ...newInvoice, items: updated });
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice)
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setInvoices([res.data, ...invoices]);
          setShowCreateModal(false);
        }
      });
  };

  // Razorpay Gateway Checkout Launcher
  const handleRazorpayPayment = (invoice) => {
    fetch(`/api/invoices/${invoice.id}/razorpay-order`, { method: 'POST' })
      .then(res => res.json())
      .then(res => {
        const orderData = res.data;

        if (window.Razorpay) {
          const options = {
            key: orderData.key_id,
            amount: orderData.amount_in_paise,
            currency: 'INR',
            name: 'NexBiz Platform',
            description: `Payment for Invoice #${invoice.invoice_number}`,
            order_id: orderData.order_id,
            handler: function (response) {
              // Verify payment on backend
              fetch(`/api/invoices/${invoice.id}/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id || `pay_NXB_${Date.now()}`,
                  razorpay_order_id: response.razorpay_order_id || orderData.order_id,
                  payment_method: 'Razorpay Online Gateway'
                })
              })
                .then(r => r.json())
                .then(() => fetchInvoices());
            },
            prefill: {
              name: invoice.company_name,
              email: invoice.customer_email || 'client@nexbiz.in',
              contact: invoice.customer_phone || '+91 98000 11223'
            },
            theme: { color: '#4f46e5' }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback verification if script blocked in local preview
          fetch(`/api/invoices/${invoice.id}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_method: 'UPI (Razorpay Simulated)' })
          })
            .then(r => r.json())
            .then(() => fetchInvoices());
        }
      });
  };

  // Printable PDF Generator via html2pdf or window print
  const handleExportPDF = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPdfPreviewModal(true);
  };

  const triggerDownloadPdf = () => {
    const element = document.getElementById('printable-invoice-content');
    if (window.html2pdf) {
      const opt = {
        margin: 10,
        filename: `${selectedInvoice.invoice_number}_NexBiz.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-400" /> Invoicing & Razorpay Billing
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Automated 18% GST calculation, dynamic PDF exporting, and instant Razorpay online collection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('invoices')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'invoices' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Invoices List
            </button>
            <button
              onClick={() => setActiveSubTab('ledger')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'ledger' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Payment Ledger
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* Invoices List View */}
      {activeSubTab === 'invoices' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Client Company</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">GST (18%)</th>
                  <th className="p-3">Total (INR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-mono font-bold text-indigo-400">{inv.invoice_number}</td>
                    <td className="p-3 font-semibold text-slate-100">{inv.company_name}</td>
                    <td className="p-3 text-slate-400">{inv.due_date}</td>
                    <td className="p-3 font-mono">₹{parseFloat(inv.subtotal).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-slate-400">₹{parseFloat(inv.gst_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{parseFloat(inv.total_amount).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        inv.status === 'Overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => handleRazorpayPayment(inv)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1 shadow"
                        >
                          <CreditCard className="w-3 h-3" /> Pay Online
                        </button>
                      )}
                      <button
                        onClick={() => handleExportPDF(inv)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF Export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Ledger View */}
      {activeSubTab === 'ledger' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-sm text-white">Automated Transaction Ledger (Razorpay Log)</h3>
            <span className="text-xs text-slate-400">{ledger.length} Online Transactions Recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {ledger.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-mono text-indigo-400">{l.transaction_ref}</td>
                    <td className="p-3 font-mono">{l.invoice_number}</td>
                    <td className="p-3 font-semibold">{l.company_name}</td>
                    <td className="p-3 text-slate-400">{l.payment_method}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{parseFloat(l.amount).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white">Generate Itemized GST Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="TechSolutions India"
                    value={newInvoice.customer_name}
                    onChange={e => setNewInvoice({ ...newInvoice, customer_name: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Customer Email</label>
                  <input
                    type="email"
                    placeholder="finance@client.in"
                    value={newInvoice.customer_email}
                    onChange={e => setNewInvoice({ ...newInvoice, customer_email: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold">Itemized Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-[11px] text-indigo-400 hover:underline font-semibold"
                  >
                    + Add Item Row
                  </button>
                </div>

                {newInvoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="Item Description / SKU"
                      className="col-span-6 bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                      value={item.description}
                      onChange={e => handleItemChange(idx, 'description', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      className="col-span-2 bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                      value={item.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="col-span-4 bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800"
                      value={item.unit_price}
                      onChange={e => handleItemChange(idx, 'unit_price', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30">
                  Generate & Send Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Export & Print Modal */}
      {showPdfPreviewModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Download Action Top Bar */}
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="font-bold text-sm text-indigo-900">PDF Tax Invoice Preview</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={triggerDownloadPdf}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Download / Print PDF
                </button>
                <button onClick={() => setShowPdfPreviewModal(false)} className="text-slate-500 text-sm font-bold">✕</button>
              </div>
            </div>

            {/* Printable Content Template */}
            <div id="printable-invoice-content" className="p-4 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-indigo-900">NexBiz Platform</h2>
                  <p className="text-xs text-slate-500">GSTIN: 29AAAAA0000A1Z5</p>
                  <p className="text-xs text-slate-500">Bengaluru, Karnataka 560038</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-slate-800">TAX INVOICE</h3>
                  <p className="text-xs font-mono font-bold text-indigo-600">{selectedInvoice.invoice_number}</p>
                  <p className="text-xs text-slate-500">Date: {selectedInvoice.due_date}</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-800">Billed To:</p>
                <p className="font-semibold text-slate-900">{selectedInvoice.company_name}</p>
                <p className="text-slate-600">{selectedInvoice.address || 'India'}</p>
                <p className="text-slate-600">{selectedInvoice.customer_email}</p>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100 text-slate-700">
                    <th className="p-2">Description</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 font-medium">{it.description}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2">₹{parseFloat(it.unit_price).toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right font-mono">₹{parseFloat(it.amount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 text-slate-700">
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{parseFloat(selectedInvoice.subtotal).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>GST (18%):</span><span>₹{parseFloat(selectedInvoice.gst_amount).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 border-t pt-1"><span>Total Due:</span><span>₹{parseFloat(selectedInvoice.total_amount).toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
