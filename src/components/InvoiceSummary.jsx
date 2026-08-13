import React from 'react';
import { IndianRupee, Save, Printer, FileSpreadsheet, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { numberToWordsIndian } from '../utils/numberToWords';

export default function InvoiceSummary({
  summary,
  isIgst,
  setIsIgst,
  onSaveInvoice,
  onPrintPreview,
  onExportExcel
}) {
  const amountInWords = numberToWordsIndian(summary.grandTotal);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Left 2 Columns: Amount in Words & Notes */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Amount in Words Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
            Total Amount in Words (Indian Rupees)
          </div>
          <div className="text-base font-bold text-amber-300 font-heading italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            "{amountInWords}"
          </div>
        </div>

        {/* Quick Tax Mode Toggle (CGST+SGST vs IGST) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-200">Inter-State Supply (IGST Mode)</div>
            <div className="text-xs text-slate-400">
              {isIgst 
                ? "Applying Integrated GST (IGST) for out-of-state billing." 
                : "Applying Intra-State CGST + SGST split for Chhattisgarh (22)."}
            </div>
          </div>
          <button
            onClick={() => setIsIgst(!isIgst)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              isIgst 
                ? 'bg-indigo-600 border-indigo-500 text-white' 
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {isIgst ? <ToggleRight className="w-5 h-5 text-indigo-300" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
            {isIgst ? "IGST Active" : "CGST + SGST"}
          </button>
        </div>

      </div>

      {/* Right Column: Financial Totals Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
        
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Invoice Financial Summary
          </h3>

          <div className="flex justify-between text-slate-400">
            <span>Gross Subtotal:</span>
            <span className="font-mono text-slate-200">₹{summary.grossSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Total Item Discount:</span>
            <span className="font-mono text-emerald-400">-₹{summary.discountTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-slate-800/80">
            <span>Taxable Amount:</span>
            <span className="font-mono text-slate-100">₹{summary.taxableSubtotal.toFixed(2)}</span>
          </div>

          {!isIgst ? (
            <>
              <div className="flex justify-between text-slate-400">
                <span>Central Tax (CGST):</span>
                <span className="font-mono text-slate-200">₹{summary.cgstTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>State Tax (SGST):</span>
                <span className="font-mono text-slate-200">₹{summary.sgstTotal.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-indigo-400 font-semibold">
              <span>Integrated Tax (IGST):</span>
              <span className="font-mono">₹{summary.igstTotal.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-400">
            <span>Round Off:</span>
            <span className="font-mono text-slate-300">
              {summary.roundOff >= 0 ? `+₹${summary.roundOff.toFixed(2)}` : `-₹${Math.abs(summary.roundOff).toFixed(2)}`}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Net Payable</div>
              <div className="text-[10px] text-amber-500 font-medium">Incl. all taxes</div>
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono-num flex items-center">
              <IndianRupee className="w-5 h-5 mr-0.5" />
              {summary.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-5 grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={onSaveInvoice}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg border border-slate-700 transition"
          >
            <Save className="w-4 h-4 text-cyan-400" />
            Save Invoice
          </button>

          <button
            onClick={onPrintPreview}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>

      </div>

    </div>
  );
}
