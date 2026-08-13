import React, { useState } from 'react';
import { Plus, Trash2, Copy, Sparkles, ArrowDown, ChevronDown, Percent } from 'lucide-react';
import { HARDWARE_PRODUCT_CATALOG } from '../data/hardwareProducts';

const UNITS = ["Pcs", "Box", "Kg", "Mtr", "Pkt", "Set", "Tin", "Bucket", "Roll", "Pair", "Bundle", "SqFt", "Ltr"];
const GST_RATES = [0, 5, 12, 18, 28];

export function calculateRowTotals(row) {
  const qty = parseFloat(row.qty) || 0;
  const rate = parseFloat(row.rate) || 0;
  const discPct = parseFloat(row.discountPercent) || 0;
  const gstPct = parseFloat(row.gstPercent) || 0;

  const gross = qty * rate;
  const discAmount = gross * (discPct / 100);
  const taxable = gross - discAmount;
  const totalGst = taxable * (gstPct / 100);
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const lineTotal = taxable + totalGst;

  return {
    gross,
    discAmount,
    taxable,
    totalGst,
    cgst,
    sgst,
    lineTotal
  };
}

export default function ExcelGrid({ rows, setRows, onOpenCatalog }) {
  const [activeCell, setActiveCell] = useState(null);

  const updateRowField = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const handleSelectProduct = (index, prodId) => {
    const prod = HARDWARE_PRODUCT_CATALOG.find(p => p.id === prodId);
    if (prod) {
      const updated = [...rows];
      updated[index] = {
        ...updated[index],
        itemName: prod.name,
        hsn: prod.hsn,
        rate: prod.rate,
        unit: prod.unit,
        gstPercent: prod.gst
      };
      setRows(updated);
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: `row-${Date.now()}`,
      itemName: "",
      hsn: "3917",
      qty: 1,
      unit: "Pcs",
      rate: 0,
      discountPercent: 0,
      gstPercent: 18
    };
    setRows([...rows, newRow]);
  };

  const handleDuplicateRow = (index) => {
    const target = rows[index];
    const newRow = {
      ...target,
      id: `row-${Date.now()}`
    };
    const updated = [...rows];
    updated.splice(index + 1, 0, newRow);
    setRows(updated);
  };

  const handleDeleteRow = (index) => {
    if (rows.length === 1) {
      alert("At least one row is required in the invoice.");
      return;
    }
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  const applyGlobalDiscount = (pct) => {
    const updated = rows.map(r => ({ ...r, discountPercent: pct }));
    setRows(updated);
  };

  const applyGlobalGst = (gstVal) => {
    const updated = rows.map(r => ({ ...r, gstPercent: gstVal }));
    setRows(updated);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl overflow-hidden mb-6">
      
      {/* Excel Sheet Header Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs px-2 py-0.5 rounded border border-emerald-500/30">
            SheetJS Grid
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Sudama Hardware Invoice Sheet ({rows.length} Items)
          </span>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center gap-3 text-xs">
          
          {/* Quick Add Discount Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">All Disc:</span>
            {[0, 5, 10, 15].map(d => (
              <button
                key={d}
                onClick={() => applyGlobalDiscount(d)}
                className="px-1.5 py-0.5 rounded hover:bg-slate-700 text-slate-200 hover:text-amber-400 font-mono transition"
              >
                {d}%
              </button>
            ))}
          </div>

          {/* Quick Add GST Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
            <span className="text-slate-400">Set All GST:</span>
            {[18, 28, 12, 5].map(g => (
              <button
                key={g}
                onClick={() => applyGlobalGst(g)}
                className="px-1.5 py-0.5 rounded hover:bg-slate-700 text-slate-200 hover:text-amber-400 font-mono transition"
              >
                {g}%
              </button>
            ))}
          </div>

          {/* Add Row Button */}
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1 rounded font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>
      </div>

      {/* Excel Sheet Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            
            {/* Excel Column Letters Header */}
            <tr className="bg-slate-950/80 text-slate-500 border-b border-slate-800 font-mono text-[11px]">
              <th className="excel-header-cell w-10 text-center">#</th>
              <th className="excel-header-cell text-center">A</th>
              <th className="excel-header-cell text-center">B</th>
              <th className="excel-header-cell text-center">C</th>
              <th className="excel-header-cell text-center">D</th>
              <th className="excel-header-cell text-center">E</th>
              <th className="excel-header-cell text-center">F</th>
              <th className="excel-header-cell text-center">G</th>
              <th className="excel-header-cell text-center">H</th>
              <th className="excel-header-cell text-center">I</th>
              <th className="excel-header-cell text-center">J</th>
              <th className="excel-header-cell text-center w-16">Act</th>
            </tr>

            {/* Column Label Titles */}
            <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-bold">
              <th className="p-2 text-center border-r border-slate-800 w-10">S.No</th>
              <th className="p-2 border-r border-slate-800 min-w-[260px]">
                Item Description / Hardware Name
              </th>
              <th className="p-2 border-r border-slate-800 w-24">HSN/SAC</th>
              <th className="p-2 border-r border-slate-800 w-20 text-center">Qty</th>
              <th className="p-2 border-r border-slate-800 w-20">Unit</th>
              <th className="p-2 border-r border-slate-800 w-24 text-right">Rate (₹)</th>
              <th className="p-2 border-r border-slate-800 w-20 text-right">Disc %</th>
              <th className="p-2 border-r border-slate-800 w-28 text-right">Taxable (₹)</th>
              <th className="p-2 border-r border-slate-800 w-20 text-center">GST %</th>
              <th className="p-2 border-r border-slate-800 w-24 text-right">CGST (₹)</th>
              <th className="p-2 border-r border-slate-800 w-24 text-right">SGST (₹)</th>
              <th className="p-2 border-r border-slate-800 w-32 text-right text-amber-400">
                Total (₹)
              </th>
              <th className="p-2 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row, index) => {
              const totals = calculateRowTotals(row);

              return (
                <tr 
                  key={row.id || index}
                  className="hover:bg-slate-800/40 transition group font-sans"
                >
                  {/* S.No / Row Index */}
                  <td className="p-2 text-center text-slate-500 font-mono bg-slate-950/40 border-r border-slate-800">
                    {index + 1}
                  </td>

                  {/* Item Description Cell with Hardware Dropdown Quick Picker */}
                  <td className="p-1 border-r border-slate-800 relative">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={row.itemName}
                        onChange={(e) => updateRowField(index, 'itemName', e.target.value)}
                        placeholder="Type hardware item or pick below..."
                        className="excel-cell-input text-slate-100 font-medium"
                      />
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleSelectProduct(index, e.target.value);
                        }}
                        defaultValue=""
                        className="bg-slate-950 text-slate-400 text-[10px] rounded px-1 py-1 border border-slate-700 outline-none w-6 hover:w-36 transition-all focus:w-48 cursor-pointer"
                        title="Pick from Sudama Catalog"
                      >
                        <option value="" disabled>⚡ Catalog</option>
                        {HARDWARE_PRODUCT_CATALOG.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₹{p.rate})
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* HSN Code */}
                  <td className="p-1 border-r border-slate-800">
                    <input
                      type="text"
                      value={row.hsn}
                      onChange={(e) => updateRowField(index, 'hsn', e.target.value)}
                      className="excel-cell-input font-mono text-center text-slate-300"
                    />
                  </td>

                  {/* Qty */}
                  <td className="p-1 border-r border-slate-800">
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={row.qty}
                      onChange={(e) => updateRowField(index, 'qty', e.target.value)}
                      className="excel-cell-input font-mono text-center text-amber-300 font-bold"
                    />
                  </td>

                  {/* Unit */}
                  <td className="p-1 border-r border-slate-800">
                    <select
                      value={row.unit}
                      onChange={(e) => updateRowField(index, 'unit', e.target.value)}
                      className="w-full bg-transparent border-none text-slate-300 text-xs px-1 py-1 outline-none cursor-pointer"
                    >
                      {UNITS.map(u => (
                        <option key={u} value={u} className="bg-slate-900 text-slate-200">
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Rate */}
                  <td className="p-1 border-r border-slate-800">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={row.rate}
                      onChange={(e) => updateRowField(index, 'rate', e.target.value)}
                      className="excel-cell-input font-mono text-right text-slate-200"
                    />
                  </td>

                  {/* Discount % */}
                  <td className="p-1 border-r border-slate-800">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.discountPercent}
                      onChange={(e) => updateRowField(index, 'discountPercent', e.target.value)}
                      className="excel-cell-input font-mono text-right text-slate-400"
                    />
                  </td>

                  {/* Taxable Amount (Calculated) */}
                  <td className="p-2 border-r border-slate-800 text-right font-mono text-slate-300 bg-slate-950/20">
                    ₹{totals.taxable.toFixed(2)}
                  </td>

                  {/* GST % Select */}
                  <td className="p-1 border-r border-slate-800">
                    <select
                      value={row.gstPercent}
                      onChange={(e) => updateRowField(index, 'gstPercent', parseFloat(e.target.value))}
                      className="w-full bg-transparent border-none text-center font-mono text-slate-300 text-xs py-1 outline-none cursor-pointer"
                    >
                      {GST_RATES.map(g => (
                        <option key={g} value={g} className="bg-slate-900 text-slate-200">
                          {g}%
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* CGST */}
                  <td className="p-2 border-r border-slate-800 text-right font-mono text-slate-400 bg-slate-950/20">
                    ₹{totals.cgst.toFixed(2)}
                  </td>

                  {/* SGST */}
                  <td className="p-2 border-r border-slate-800 text-right font-mono text-slate-400 bg-slate-950/20">
                    ₹{totals.sgst.toFixed(2)}
                  </td>

                  {/* Total Amount (Calculated) */}
                  <td className="p-2 border-r border-slate-800 text-right font-mono font-bold text-amber-400 bg-amber-500/5">
                    ₹{totals.lineTotal.toFixed(2)}
                  </td>

                  {/* Actions */}
                  <td className="p-1 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleDuplicateRow(index)}
                        className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                        title="Duplicate Row"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(index)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grid Footer Bar */}
      <div className="bg-slate-950/90 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold transition"
        >
          <Plus className="w-4 h-4" />
          Add New Item Row
        </button>

        <div className="flex items-center gap-4 text-slate-400">
          <span>
            Shortcut: <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono text-[10px]">Tab</kbd> to move cell
          </span>
          <button
            onClick={onOpenCatalog}
            className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quick Insert from Hardware Catalog
          </button>
        </div>
      </div>

    </div>
  );
}
