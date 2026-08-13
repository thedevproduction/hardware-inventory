import React from 'react';
import { 
  Wrench, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Upload, 
  Plus, 
  Search, 
  History, 
  Settings, 
  Sparkles,
  LayoutTemplate
} from 'lucide-react';

export default function Header({
  storeInfo,
  onNewInvoice,
  onOpenCatalog,
  onImportExcel,
  onExportExcel,
  onPrintPreview,
  onOpenHistory,
  onOpenSettings,
  onOpenTemplates,
  invoiceNumber,
  savedInvoicesCount
}) {
  return (
    <header className="app-header-bar bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Store Details */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-wide font-heading">
                {storeInfo.name}
              </h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
                Excel Billing
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-md">
              GSTIN: <span className="text-slate-300 font-mono">{storeInfo.gstin}</span> • Phone: {storeInfo.phone}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Add Item Catalog */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Browse Sudama Hardware Product Catalog"
          >
            <Search className="w-4 h-4 text-amber-400" />
            Catalog
          </button>

          {/* Excel Templates */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            title="Choose Excel Invoice Layout Template"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-400" />
            Templates
          </button>

          {/* Import Excel */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold border border-emerald-800/80 cursor-pointer transition">
            <Upload className="w-4 h-4 text-emerald-400" />
            Import .xlsx
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={onImportExcel}
              className="hidden"
            />
          </label>

          {/* Export to Excel */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition"
            title="Export Current Bill to Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>

          {/* Print Invoice */}
          <button
            onClick={onPrintPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition"
            title="Print GST Invoice / Thermal Receipt"
          >
            <Printer className="w-4 h-4" />
            Print Bill
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <History className="w-4 h-4 text-cyan-400" />
            Invoices
            {savedInvoicesCount > 0 && (
              <span className="ml-1 bg-cyan-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {savedInvoicesCount}
              </span>
            )}
          </button>

          {/* Store Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            title="Configure Store & Bank Details"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* New Invoice */}
          <button
            onClick={onNewInvoice}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
            title="Create Clean New Invoice"
          >
            <Plus className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
