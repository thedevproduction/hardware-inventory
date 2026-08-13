import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  DEFAULT_STORE_INFO, 
  INITIAL_INVOICE_ROW,
  HARDWARE_PRODUCT_CATALOG 
} from './data/hardwareProducts';
import { exportInvoiceToExcel, importExcelToInvoice } from './utils/excelUtils';
import { calculateRowTotals } from './components/ExcelGrid';

import Header from './components/Header';
import CustomerDetailsForm from './components/CustomerDetailsForm';
import ExcelGrid from './components/ExcelGrid';
import InvoiceSummary from './components/InvoiceSummary';
import CatalogModal from './components/CatalogModal';
import PrintInvoiceModal from './components/PrintInvoiceModal';
import SavedInvoicesModal from './components/SavedInvoicesModal';
import SettingsModal from './components/SettingsModal';
import ExcelTemplateSelectorModal from './components/ExcelTemplateSelectorModal';

export default function App() {
  // Store details state
  const [storeInfo, setStoreInfo] = useState(() => {
    const saved = localStorage.getItem('sudama_store_info');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.name = "Sudama Hardware";
      return parsed;
    }
    return DEFAULT_STORE_INFO;
  });

  // Customer state
  const [customer, setCustomer] = useState({
    name: "Ramesh Sharma (Contractor)",
    phone: "+91 98270 44551",
    gstin: "22BKPPS9910A1Z2",
    address: "Site No. 4, Shankar Nagar, Raipur, CG",
    placeOfSupply: "Raipur (22)"
  });

  // Invoice Meta
  const [invoiceNumber, setInvoiceNumber] = useState(() => `SH/2026-27/${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [paymentMode, setPaymentMode] = useState("Cash Paid");
  const [customerType, setCustomerType] = useState("Contractor");
  const [isIgst, setIsIgst] = useState(false);

  // Invoice Rows
  const [rows, setRows] = useState([
    INITIAL_INVOICE_ROW,
    {
      id: "row-2",
      itemName: "Modular Copper Wire 2.5 sq mm (90m Roll)",
      hsn: "8544",
      qty: 2,
      unit: "Roll",
      rate: 2680,
      discountPercent: 10,
      gstPercent: 18
    },
    {
      id: "row-3",
      itemName: "Professional Impact Drill Machine 13mm",
      hsn: "8467",
      qty: 1,
      unit: "Set",
      rate: 2450,
      discountPercent: 5,
      gstPercent: 18
    }
  ]);

  // Saved Invoices History
  const [savedInvoices, setSavedInvoices] = useState(() => {
    const saved = localStorage.getItem('sudama_saved_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal States
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Save Store Info to LocalStorage
  useEffect(() => {
    localStorage.setItem('sudama_store_info', JSON.stringify(storeInfo));
  }, [storeInfo]);

  // Save Invoices History to LocalStorage
  useEffect(() => {
    localStorage.setItem('sudama_saved_invoices', JSON.stringify(savedInvoices));
  }, [savedInvoices]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsPrintOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveInvoice();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExportExcel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customer, rows, invoiceNumber, storeInfo]);

  // Calculate Overall Financial Summary
  const calculateSummary = () => {
    let grossSubtotal = 0;
    let discountTotal = 0;
    let taxableSubtotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    rows.forEach(row => {
      const totals = calculateRowTotals(row);
      grossSubtotal += totals.gross;
      discountTotal += totals.discAmount;
      taxableSubtotal += totals.taxable;

      if (!isIgst) {
        cgstTotal += totals.cgst;
        sgstTotal += totals.sgst;
      } else {
        igstTotal += totals.totalGst;
      }
    });

    const unroundedTotal = taxableSubtotal + cgstTotal + sgstTotal + igstTotal;
    const grandTotal = Math.round(unroundedTotal);
    const roundOff = grandTotal - unroundedTotal;

    return {
      grossSubtotal,
      discountTotal,
      taxableSubtotal,
      cgstTotal,
      sgstTotal,
      igstTotal,
      unroundedTotal,
      grandTotal,
      roundOff
    };
  };

  const summary = calculateSummary();

  const currentInvoiceData = {
    customer,
    rows,
    summary,
    invoiceNumber,
    invoiceDate,
    dueDate,
    paymentMode,
    customerType,
    isIgst
  };

  // Actions
  const handleNewInvoice = () => {
    setCustomer({ name: "", phone: "", gstin: "", address: "", placeOfSupply: "Raipur (22)" });
    setInvoiceNumber(`SH/2026-27/${Math.floor(1000 + Math.random() * 9000)}`);
    setRows([
      {
        id: `row-${Date.now()}`,
        itemName: "",
        hsn: "3917",
        qty: 1,
        unit: "Pcs",
        rate: 0,
        discountPercent: 0,
        gstPercent: 18
      }
    ]);
  };

  const handleSaveInvoice = () => {
    const newRecord = {
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...currentInvoiceData
    };

    // Filter out duplicates if editing existing invoice
    const filtered = savedInvoices.filter(i => i.invoiceNumber !== invoiceNumber);
    setSavedInvoices([newRecord, ...filtered]);

    // Fire Confetti animation for hardware store clerk feedback
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981', '#6366F1']
    });

    alert(`Invoice ${invoiceNumber} saved successfully to store register!`);
  };

  const handleAddItemFromCatalog = (catalogItem) => {
    const newRow = {
      id: `row-${Date.now()}`,
      itemName: catalogItem.name,
      hsn: catalogItem.hsn,
      qty: 1,
      unit: catalogItem.unit,
      rate: catalogItem.rate,
      discountPercent: 0,
      gstPercent: catalogItem.gst
    };

    // If first row is empty, replace it
    if (rows.length === 1 && (!rows[0].itemName || rows[0].itemName.trim() === "") && rows[0].rate === 0) {
      setRows([newRow]);
    } else {
      setRows([...rows, newRow]);
    }
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (file) {
      importExcelToInvoice(file, (importedRows) => {
        setRows(importedRows);
        confetti({ particleCount: 35, spread: 40 });
        alert(`Successfully imported ${importedRows.length} items into Excel grid!`);
      });
    }
  };

  const handleExportExcel = () => {
    exportInvoiceToExcel(currentInvoiceData, storeInfo);
  };

  const handleLoadSavedInvoice = (savedInv) => {
    setCustomer(savedInv.customer);
    setInvoiceNumber(savedInv.invoiceNumber);
    setInvoiceDate(savedInv.invoiceDate);
    setDueDate(savedInv.dueDate || "");
    setPaymentMode(savedInv.paymentMode);
    setRows(savedInv.rows);
    if (savedInv.isIgst !== undefined) setIsIgst(savedInv.isIgst);
  };

  const handleDeleteSavedInvoice = (id) => {
    if (confirm("Are you sure you want to delete this saved invoice?")) {
      setSavedInvoices(savedInvoices.filter(i => i.id !== id));
    }
  };

  const handleApplyTemplate = (templateRows) => {
    setRows(templateRows);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Application Header */}
      <Header
        storeInfo={storeInfo}
        onNewInvoice={handleNewInvoice}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onImportExcel={handleImportExcel}
        onExportExcel={handleExportExcel}
        onPrintPreview={() => setIsPrintOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        invoiceNumber={invoiceNumber}
        savedInvoicesCount={savedInvoices.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Customer & Bill Details Card */}
        <CustomerDetailsForm
          customer={customer}
          setCustomer={setCustomer}
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          customerType={customerType}
          setCustomerType={setCustomerType}
        />

        {/* Interactive Excel Grid Spreadsheet */}
        <ExcelGrid
          rows={rows}
          setRows={setRows}
          onOpenCatalog={() => setIsCatalogOpen(true)}
        />

        {/* Invoice Summary & Tax Totals */}
        <InvoiceSummary
          summary={summary}
          isIgst={isIgst}
          setIsIgst={setIsIgst}
          onSaveInvoice={handleSaveInvoice}
          onPrintPreview={() => setIsPrintOpen(true)}
          onExportExcel={handleExportExcel}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 py-4 bg-slate-950 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <span className="text-amber-400 font-bold">{storeInfo.name}</span> • Excel Billing & GST Suite
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Press <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+P</kbd> to Print</span>
            <span>•</span>
            <span><kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+S</kbd> to Save</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onAddItem={handleAddItemFromCatalog}
      />

      <PrintInvoiceModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        invoiceData={currentInvoiceData}
        storeInfo={storeInfo}
      />

      <SavedInvoicesModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedInvoices={savedInvoices}
        onLoadInvoice={handleLoadSavedInvoice}
        onDeleteInvoice={handleDeleteSavedInvoice}
        storeInfo={storeInfo}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        storeInfo={storeInfo}
        setStoreInfo={setStoreInfo}
      />

      <ExcelTemplateSelectorModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

    </div>
  );
}
