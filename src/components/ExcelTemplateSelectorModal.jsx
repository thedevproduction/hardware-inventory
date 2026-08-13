import React from 'react';
import { X, LayoutTemplate, FileSpreadsheet, Download, Check } from 'lucide-react';
import { downloadExcelTemplate } from '../utils/excelUtils';

export default function ExcelTemplateSelectorModal({
  isOpen,
  onClose,
  onApplyTemplate
}) {
  if (!isOpen) return null;

  const TEMPLATES = [
    {
      id: 'plumbing-electrical',
      title: 'Plumbing & Electrical Standard Invoice',
      desc: 'CPVC Pipes, fittings, modular switches, copper wires with 18% GST.',
      rows: [
        { id: 't1', itemName: 'CPVC Pipe 1" (3 Meter)', hsn: '3917', qty: 15, unit: 'Pcs', rate: 380, discountPercent: 5, gstPercent: 18 },
        { id: 't2', itemName: 'PVC Elbow 1" 90 Degree', hsn: '3917', qty: 25, unit: 'Pcs', rate: 28, discountPercent: 0, gstPercent: 18 },
        { id: 't3', itemName: 'Modular Copper Wire 2.5 sq mm (90m Roll)', hsn: '8544', qty: 2, unit: 'Roll', rate: 2680, discountPercent: 10, gstPercent: 18 },
        { id: 't4', itemName: 'Single Pole MCB 16A C-Curve', hsn: '8536', qty: 6, unit: 'Pcs', rate: 175, discountPercent: 0, gstPercent: 18 }
      ]
    },
    {
      id: 'contractor-bulk',
      title: 'Contractor Civil & Building Hardware Bill',
      desc: 'Cement, fasteners, dry-wall screws, tools for construction site.',
      rows: [
        { id: 'c1', itemName: 'Drywall Screws 35mm x 6 (1000 Box)', hsn: '7318', qty: 5, unit: 'Box', rate: 420, discountPercent: 8, gstPercent: 18 },
        { id: 'c2', itemName: 'Professional Impact Drill Machine 13mm', hsn: '8467', qty: 1, unit: 'Set', rate: 2450, discountPercent: 5, gstPercent: 18 },
        { id: 'c3', itemName: 'Acrylic Wall Primer Exterior 20L', hsn: '3209', qty: 3, unit: 'Bucket', rate: 2180, discountPercent: 0, gstPercent: 28 },
        { id: 'c4', itemName: 'Nylon Rawl Plugs 8mm (100 Pkt)', hsn: '3926', qty: 10, unit: 'Pkt', rate: 65, discountPercent: 0, gstPercent: 18 }
      ]
    },
    {
      id: 'power-tools',
      title: 'Power Tools & Safety Hardware Invoice',
      desc: 'Angle grinders, drill sets, door locks, measuring tapes.',
      rows: [
        { id: 'p1', itemName: 'Angle Grinder 4 Inch 850W', hsn: '8467', qty: 2, unit: 'Pcs', rate: 2150, discountPercent: 5, gstPercent: 18 },
        { id: 'p2', itemName: 'Double Cylinder Main Door Lock SS', hsn: '8301', qty: 2, unit: 'Set', rate: 1850, discountPercent: 0, gstPercent: 18 },
        { id: 'p3', itemName: 'Measuring Tape 5 Meter Steel', hsn: '9017', qty: 5, unit: 'Pcs', rate: 140, discountPercent: 0, gstPercent: 18 }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-bg bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Select Excel Invoice Layout Template
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          <div className="text-xs text-slate-400">
            Pick a pre-configured Excel layout template for instant hardware billing or download a blank sample sheet:
          </div>

          <div className="grid grid-cols-1 gap-3">
            {TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.id}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl flex items-center justify-between gap-4 transition group"
              >
                <div>
                  <div className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition">
                    {tmpl.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {tmpl.desc}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    {tmpl.rows.length} Pre-filled hardware items
                  </div>
                </div>

                <button
                  onClick={() => {
                    onApplyTemplate(tmpl.rows);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition whitespace-nowrap shadow-md shadow-indigo-900/30"
                >
                  Load Template
                </button>
              </div>
            ))}
          </div>

          {/* Download Blank XLSX File */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border">
            <div>
              <div className="font-bold text-emerald-400 text-xs">Blank Excel Sheet Template (.xlsx)</div>
              <div className="text-[11px] text-slate-400">Download formatted Excel file to fill offline and import back.</div>
            </div>
            <button
              onClick={downloadExcelTemplate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              <Download className="w-4 h-4" /> Download .xlsx
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
