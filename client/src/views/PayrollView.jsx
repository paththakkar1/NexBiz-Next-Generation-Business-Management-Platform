import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  Users, 
  FileText, 
  Printer, 
  Calendar 
} from 'lucide-react';

export default function PayrollView() {
  const [employees, setEmployees] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('employees'); // 'employees' or 'history'
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  // Form state
  const [newEmp, setNewEmp] = useState({
    name: '', email: '', department: 'Engineering', designation: 'Software Engineer', base_salary: '70000', bank_account_no: '918000111222', ifsc_code: 'HDFC0000123'
  });

  const fetchPayrollData = () => {
    fetch('/api/payroll/employees')
      .then(res => res.json())
      .then(res => { if (res.data) setEmployees(res.data); });

    fetch('/api/payroll/history')
      .then(res => res.json())
      .then(res => { if (res.data) setPayrollHistory(res.data); });
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    fetch('/api/payroll/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmp)
    })
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setEmployees([...employees, res.data]);
          setShowAddEmpModal(false);
        }
      });
  };

  const handleProcessPayroll = () => {
    fetch('/api/payroll/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month: 'August', year: 2026 })
    })
      .then(res => res.json())
      .then(res => {
        fetchPayrollData();
        setActiveSubTab('history');
      });
  };

  const handleGeneratePayslip = (runItem) => {
    setSelectedPayslip(runItem);
    setShowPayslipModal(true);
  };

  const triggerDownloadPayslip = () => {
    const element = document.getElementById('printable-payslip-content');
    if (window.html2pdf) {
      const opt = {
        margin: 10,
        filename: `Payslip_${selectedPayslip.employee_name}_${selectedPayslip.month}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + parseFloat(e.base_salary || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" /> Employee Directory & Payroll System
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Total Monthly Base Salary: <span className="text-emerald-400 font-bold font-mono">₹{totalMonthlyPayroll.toLocaleString('en-IN')}</span> for {employees.length} employees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('employees')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'employees' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Employee Roster ({employees.length})
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeSubTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Payroll History
            </button>
          </div>

          <button
            onClick={handleProcessPayroll}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Run August Payroll
          </button>

          <button
            onClick={() => setShowAddEmpModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Employee Roster Table */}
      {activeSubTab === 'employees' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Emp Code</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Base Salary (INR)</th>
                  <th className="p-3">Bank Details</th>
                  <th className="p-3">Joining Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-mono font-bold text-indigo-400">{emp.employee_code}</td>
                    <td className="p-3 font-semibold text-slate-100">{emp.name}</td>
                    <td className="p-3 text-slate-400">{emp.department}</td>
                    <td className="p-3 text-slate-300">{emp.designation}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{parseFloat(emp.base_salary).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-slate-400">{emp.ifsc_code} • {emp.bank_account_no}</td>
                    <td className="p-3 text-slate-500">{emp.joining_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll History & Payslip Generator View */}
      {activeSubTab === 'history' && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Month / Year</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Base Salary</th>
                  <th className="p-3">Bonus</th>
                  <th className="p-3">Deductions</th>
                  <th className="p-3">Net Salary</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payrollHistory.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-semibold text-slate-200">{run.month} {run.year}</td>
                    <td className="p-3 font-semibold text-slate-100">{run.employee_name}</td>
                    <td className="p-3 font-mono">₹{parseFloat(run.base_salary).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-emerald-400">+₹{parseFloat(run.bonus).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-red-400">-₹{parseFloat(run.deductions).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">₹{parseFloat(run.net_salary).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {run.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleGeneratePayslip(run)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Payslip PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white">Add New Employee Profile</h3>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Employee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={newEmp.department}
                    onChange={e => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newEmp.designation}
                    onChange={e => setNewEmp({ ...newEmp, designation: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Base Salary (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newEmp.base_salary}
                    onChange={e => setNewEmp({ ...newEmp, base_salary: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={newEmp.ifsc_code}
                    onChange={e => setNewEmp({ ...newEmp, ifsc_code: e.target.value })}
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddEmpModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30">
                  Save Employee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Generator Modal */}
      {showPayslipModal && selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-xl w-full rounded-2xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="font-bold text-sm text-indigo-900">Digital Salary Slip Preview</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={triggerDownloadPayslip}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Download / Print Payslip
                </button>
                <button onClick={() => setShowPayslipModal(false)} className="text-slate-500 text-sm font-bold">✕</button>
              </div>
            </div>

            <div id="printable-payslip-content" className="p-4 space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-indigo-900">NexBiz SaaS Pvt Ltd</h2>
                  <p className="text-xs text-slate-500">Bengaluru, Karnataka 560038</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-slate-800">SALARY SLIP</h3>
                  <p className="text-xs text-slate-500">{selectedPayslip.month} {selectedPayslip.year}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-900">{selectedPayslip.employee_name}</p>
                <p className="text-slate-600">Designation: {selectedPayslip.designation}</p>
                <p className="text-slate-600">Status: {selectedPayslip.status}</p>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="p-2">Earnings Component</th>
                    <th className="p-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  <tr><td className="p-2">Basic Salary</td><td className="p-2 text-right font-mono">₹{parseFloat(selectedPayslip.base_salary).toLocaleString('en-IN')}</td></tr>
                  <tr><td className="p-2">Performance Bonus / Allowance</td><td className="p-2 text-right font-mono text-emerald-600">+₹{parseFloat(selectedPayslip.bonus).toLocaleString('en-IN')}</td></tr>
                  <tr><td className="p-2">PF & Tax Deductions</td><td className="p-2 text-right font-mono text-red-600">-₹{parseFloat(selectedPayslip.deductions).toLocaleString('en-IN')}</td></tr>
                  <tr className="font-bold text-slate-900 border-t"><td className="p-2">Net Disbursed Salary</td><td className="p-2 text-right font-mono text-indigo-600">₹{parseFloat(selectedPayslip.net_salary).toLocaleString('en-IN')}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
