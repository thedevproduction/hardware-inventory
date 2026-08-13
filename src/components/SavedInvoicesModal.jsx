import React, { useState } from 'react';
import { X, Search, History, FileSpreadsheet, Trash2, Edit3, IndianRupee, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { exportInvoiceToExcel } from '../utils/excelUtils';

export default function SavedInvoicesModal({
  isOpen,
  onClose,
  savedInvoices,
  onLoadInvoice,
  onDeleteInvoice,
  storeInfo
}) {
  if (!isOpen) return null;

  const [search, setSearch] = useState("");

  const filteredInvoices = savedInvoices.filter(inv => {
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customer.name.toLowerCase().includes(q) ||
      inv.customer.phone.includes(q)
    );
  });

  // Calculate statistics
  const totalSales = savedInvoices.reduce((acc, curr) => acc + (curr.summary.grandTotal || 0), 0);
  const pendingCredit = savedInvoices
    .filter(inv => inv.paymentMode.includes("Credit"))
    .reduce((acc, curr) => acc + (curr.summary.grandTotal || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-bg bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Sudama Hardware Saved Invoices History
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="p-4 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/90">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Sales Generated</div>
            <div className="text-xl font-bold text-amber-400 font-mono-num mt-0.5 flex items-center">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{savedInvoices.length} Total Invoices</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Pending Udhar / Credit</div>
            <div className="text-xl font-bold text-rose-400 font-mono-num mt-0.5 flex items-center">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {pendingCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Outstanding Balance</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Hardware Store Register</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">Ready & Active</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number, customer name, phone..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="overflow-y-auto p-4 flex-1">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No saved invoices found.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-2.5">Inv No</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Payment Mode</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                  <th className="p-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-mono font-bold text-amber-400">{inv.invoiceNumber}</td>
                    <td className="p-2.5 font-mono text-slate-300">{inv.invoiceDate}</td>
                    <td className="p-2.5">
                      <div className="font-semibold text-slate-100">{inv.customer.name || "Counter Cash"}</div>
                      {inv.customer.phone && <div className="text-[10px] text-slate-400">{inv.customer.phone}</div>}
                    </td>
                    <td className="p-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        inv.paymentMode.includes("Credit")
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {inv.paymentMode}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-100">
                      ₹{(inv.summary.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            onLoadInvoice(inv);
                            onClose();
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition"
                          title="Edit / Load Invoice"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => exportInvoiceToExcel(inv, storeInfo)}
                          className="p-1 rounded bg-slate-800 hover:bg-emerald-950 text-emerald-400 transition"
                          title="Export to Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-400 transition"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
