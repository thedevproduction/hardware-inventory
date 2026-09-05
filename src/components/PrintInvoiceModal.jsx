import React, { useState } from 'react';
import { X, Printer, Download, FileText, Receipt, Table, Check, QrCode } from 'lucide-react';
import { calculateRowTotals } from './ExcelGrid';
import { numberToWordsIndian } from '../utils/numberToWords';

export default function PrintInvoiceModal({
  isOpen,
  onClose,
  invoiceData,
  storeInfo
}) {
  if (!isOpen) return null;

  const [printFormat, setPrintFormat] = useState('a4'); // 'a4', 'thermal', 'excel'
  const { customer, rows, summary, invoiceNumber, invoiceDate, dueDate, paymentMode, isIgst } = invoiceData;

  const handlePrint = () => {
    window.print();
  };

  const amountInWords = numberToWordsIndian(summary.grandTotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-bg bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Control Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950 no-print">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white font-heading">
              Print & Preview Invoice ({invoiceNumber})
            </h3>
            
            {/* Format Selection Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPrintFormat('a4')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  printFormat === 'a4'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                GST A4 Bill
              </button>

              <button
                onClick={() => setPrintFormat('thermal')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  printFormat === 'thermal'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                80mm Receipt
              </button>

              <button
                onClick={() => setPrintFormat('excel')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  printFormat === 'excel'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Excel Grid Print
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Preview Container (Prints cleanly) */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex-1 flex justify-center">
          
          {/* ========================================================
              FORMAT 1: GST A4 TAX INVOICE (Formal Hardware Bill)
             ======================================================== */}
          {printFormat === 'a4' && (
            <div className="a4-print-page bg-white text-slate-900 shadow-2xl rounded-none w-full max-w-[210mm] min-h-[297mm] p-8 border border-slate-300 font-sans text-xs">
              
              {/* Invoice Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase font-heading">
                    {storeInfo.name}
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium max-w-md mt-0.5">
                    {storeInfo.tagline}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {storeInfo.address}
                  </p>
                  <p className="text-[10px] text-slate-700 font-semibold mt-0.5">
                    Phone: {storeInfo.phone} | Email: {storeInfo.email}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded uppercase tracking-wider mb-2">
                    TAX INVOICE
                  </span>
                  <div className="text-[11px] text-slate-800 font-mono">
                    <div>GSTIN: <span className="font-bold">{storeInfo.gstin}</span></div>
                    <div>STATE CODE: <span>22 (Chhattisgarh)</span></div>
                  </div>
                </div>
              </div>

              {/* Customer & Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-3 mb-4 bg-slate-50">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Billed To (Customer):</div>
                  <div className="font-bold text-slate-900 text-sm">{customer.name || "Counter Cash Sale"}</div>
                  {customer.phone && <div className="text-slate-600">Mob: {customer.phone}</div>}
                  {customer.address && <div className="text-slate-600">{customer.address}</div>}
                  {customer.gstin && <div className="font-mono text-slate-800 mt-0.5">GSTIN: {customer.gstin}</div>}
                </div>

                <div className="text-right space-y-0.5 text-slate-700">
                  <div>Invoice No: <span className="font-bold font-mono text-slate-950">{invoiceNumber}</span></div>
                  <div>Invoice Date: <span className="font-mono">{invoiceDate}</span></div>
                  {dueDate && <div>Due Date: <span className="font-mono">{dueDate}</span></div>}
                  <div>Payment Mode: <span className="font-semibold text-slate-900">{paymentMode}</span></div>
                </div>
              </div>

              {/* Items Table */}
              {(() => {
                const hasAnyHsn = (rows || []).some(r => r.hsn && String(r.hsn).trim().length > 0);
                return (
                  <table className="w-full border-collapse print-table text-left mb-4">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[10px] uppercase font-bold">
                        <th className="p-2 border border-slate-900 text-center w-8">#</th>
                        <th className="p-2 border border-slate-900">Description of Goods</th>
                        {hasAnyHsn && <th className="p-2 border border-slate-900 text-center">HSN</th>}
                        <th className="p-2 border border-slate-900 text-center">Qty</th>
                        <th className="p-2 border border-slate-900 text-center">Unit</th>
                        <th className="p-2 border border-slate-900 text-right">Rate</th>
                        <th className="p-2 border border-slate-900 text-right">Disc%</th>
                        <th className="p-2 border border-slate-900 text-right">Taxable</th>
                        <th className="p-2 border border-slate-900 text-center">GST</th>
                        <th className="p-2 border border-slate-900 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {rows.map((r, i) => {
                        const totals = calculateRowTotals(r);
                        return (
                          <tr key={r.id || i} className="text-[11px] text-slate-800">
                            <td className="p-1.5 border border-slate-300 text-center font-mono">{i + 1}</td>
                            <td className="p-1.5 border border-slate-300 font-semibold text-slate-900">{r.itemName}</td>
                            {hasAnyHsn && <td className="p-1.5 border border-slate-300 text-center font-mono">{r.hsn}</td>}
                            <td className="p-1.5 border border-slate-300 text-center font-bold">{r.qty}</td>
                            <td className="p-1.5 border border-slate-300 text-center">{r.unit}</td>
                            <td className="p-1.5 border border-slate-300 text-right font-mono">₹{parseFloat(r.rate).toFixed(2)}</td>
                            <td className="p-1.5 border border-slate-300 text-right font-mono">{r.discountPercent}%</td>
                            <td className="p-1.5 border border-slate-300 text-right font-mono">₹{totals.taxable.toFixed(2)}</td>
                            <td className="p-1.5 border border-slate-300 text-center font-mono">{r.gstPercent}%</td>
                            <td className="p-1.5 border border-slate-300 text-right font-bold font-mono text-slate-950">₹{totals.lineTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}

              {/* Invoice Calculations & Payment QR Section */}
              <div className="grid grid-cols-2 gap-4 items-start mb-6">
                
                {/* Left: UPI Details & QR Code */}
                <div className="border border-slate-300 rounded p-3 bg-slate-50 space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Bank & UPI Payment Details</div>
                  <div className="text-[11px] space-y-0.5 text-slate-800">
                    <div>Bank: <span className="font-semibold">{storeInfo.bankName}</span></div>
                    <div>A/c No: <span className="font-mono font-bold">{storeInfo.accountNo}</span></div>
                    <div>IFSC: <span className="font-mono">{storeInfo.ifsc}</span></div>
                    <div>UPI ID: <span className="font-mono font-bold text-slate-950">{storeInfo.upiId}</span></div>
                  </div>
                  
                  {/* Mock UPI QR Code Box */}
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                    <div className="w-14 h-14 bg-white border border-slate-400 p-1 flex items-center justify-center rounded">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Scan QR Code with GPay, PhonePe, Paytm or BHIM to pay total bill.
                    </div>
                  </div>
                </div>

                {/* Right: Tax Breakdown & Grand Total */}
                <div className="space-y-1 text-xs border border-slate-300 rounded p-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-semibold">₹{summary.taxableSubtotal.toFixed(2)}</span>
                  </div>
                  {!isIgst ? (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST Total:</span>
                        <span className="font-mono">₹{summary.cgstTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST Total:</span>
                        <span className="font-mono">₹{summary.sgstTotal.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-600">
                      <span>IGST Total:</span>
                      <span className="font-mono">₹{summary.igstTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Round Off:</span>
                    <span className="font-mono">₹{summary.roundOff.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-400">
                    <span>GRAND TOTAL:</span>
                    <span className="font-mono">₹{summary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Amount in Words */}
              <div className="border border-slate-300 rounded p-2 mb-6 bg-slate-50 text-[11px]">
                <span className="font-bold text-slate-700">Amount in Words: </span>
                <span className="italic font-semibold text-slate-900">{amountInWords}</span>
              </div>

              {/* Terms & Signatory */}
              <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-slate-300 text-[10px] text-slate-600">
                <div>
                  <div className="font-bold text-slate-800 uppercase mb-1">Terms & Conditions:</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {storeInfo.terms.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-right space-y-12">
                  <div className="font-bold text-slate-800">For {storeInfo.name}</div>
                  <div className="border-t border-slate-400 pt-1 font-semibold text-slate-900 inline-block px-8">
                    Authorized Signatory
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              FORMAT 2: 3-INCH (80mm) THERMAL POS RECEIPT
             ======================================================== */}
          {printFormat === 'thermal' && (
            <div className="thermal-print-page bg-white text-black p-4 w-[78mm] shadow-2xl font-mono text-[10px] border border-slate-400">
              <div className="text-center font-bold uppercase text-xs">
                {storeInfo.name}
              </div>
              <div className="text-center text-[9px] mt-0.5">
                {storeInfo.address}
              </div>
              <div className="text-center text-[9px]">
                Ph: {storeInfo.phone}
              </div>
              <div className="text-center font-bold text-[9px] mt-1">
                GSTIN: {storeInfo.gstin}
              </div>
              
              <div className="border-b border-dashed border-black my-2"></div>

              <div className="flex justify-between">
                <span>Inv: {invoiceNumber}</span>
                <span>{invoiceDate}</span>
              </div>
              <div>Cust: {customer.name || "Counter Cash"}</div>
              <div>Mode: {paymentMode}</div>

              <div className="border-b border-dashed border-black my-2"></div>

              <table className="w-full text-left text-[9px]">
                <thead>
                  <tr className="border-b border-black">
                    <th>ITEM</th>
                    <th className="text-center">QTY</th>
                    <th className="text-right">AMT</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const totals = calculateRowTotals(r);
                    return (
                      <tr key={idx}>
                        <td className="py-0.5">{r.itemName.substring(0, 16)}</td>
                        <td className="text-center py-0.5">{r.qty} {r.unit}</td>
                        <td className="text-right py-0.5">₹{totals.lineTotal.toFixed(0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="border-b border-dashed border-black my-2"></div>

              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{summary.taxableSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Total:</span>
                  <span>₹{(summary.cgstTotal + summary.sgstTotal + summary.igstTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-black">
                  <span>TOTAL:</span>
                  <span>₹{summary.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-black my-2"></div>

              <div className="text-center text-[8px]">
                Thank you for visiting Sudama Hardware!
              </div>
            </div>
          )}

          {/* ========================================================
              FORMAT 3: EXCEL SPREADSHEET STYLED PRINT
             ======================================================== */}
          {printFormat === 'excel' && (
            <div className="bg-white text-slate-900 p-6 w-full max-w-[210mm] font-sans text-xs border border-slate-300">
              <div className="bg-emerald-800 text-white font-bold px-3 py-2 text-sm flex items-center justify-between mb-4">
                <span>MICROSOFT EXCEL INVOICE SHEET - {storeInfo.name}</span>
                <span>{invoiceNumber}</span>
              </div>

              <table className="w-full border-collapse border border-slate-400 text-left font-mono text-[11px]">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-400">
                    <th className="p-1 border border-slate-400 text-center">A</th>
                    <th className="p-1 border border-slate-400">B (Item Description)</th>
                    <th className="p-1 border border-slate-400 text-center">C (HSN)</th>
                    <th className="p-1 border border-slate-400 text-center">D (Qty)</th>
                    <th className="p-1 border border-slate-400 text-right">E (Rate)</th>
                    <th className="p-1 border border-slate-400 text-right">F (Taxable)</th>
                    <th className="p-1 border border-slate-400 text-right">G (Total ₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const totals = calculateRowTotals(r);
                    return (
                      <tr key={i} className="hover:bg-slate-100">
                        <td className="p-1 border border-slate-400 text-center bg-slate-100">{i + 1}</td>
                        <td className="p-1 border border-slate-400 font-semibold">{r.itemName}</td>
                        <td className="p-1 border border-slate-400 text-center">{r.hsn}</td>
                        <td className="p-1 border border-slate-400 text-center">{r.qty} {r.unit}</td>
                        <td className="p-1 border border-slate-400 text-right">₹{r.rate}</td>
                        <td className="p-1 border border-slate-400 text-right">₹{totals.taxable.toFixed(2)}</td>
                        <td className="p-1 border border-slate-400 text-right font-bold text-emerald-900">₹{totals.lineTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-4 text-right font-mono font-bold text-sm bg-emerald-50 p-3 border border-emerald-300">
                EXCEL FORMULA GRAND TOTAL = ₹{summary.grandTotal.toFixed(2)}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
