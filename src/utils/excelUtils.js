import * as XLSX from 'xlsx';
import { numberToWordsIndian } from './numberToWords';

/**
 * Export current invoice state to a beautifully structured Microsoft Excel (.xlsx) file
 */
export function exportInvoiceToExcel(invoiceData, storeInfo) {
  const { customer, rows, summary, invoiceNumber, invoiceDate, paymentMode } = invoiceData;

  // Header rows
  const excelData = [
    [storeInfo.name.toUpperCase()],
    [storeInfo.tagline],
    [storeInfo.address],
    [`Phone: ${storeInfo.phone} | GSTIN: ${storeInfo.gstin}`],
    [],
    ["TAX INVOICE / HARDWARE BILL"],
    [],
    // Customer & Invoice Details
    ["Invoice No:", invoiceNumber, "", "Invoice Date:", invoiceDate],
    ["Customer Name:", customer.name, "", "Payment Terms:", paymentMode],
    ["Phone / Mobile:", customer.phone, "", "Customer GSTIN:", customer.gstin || "N/A"],
    ["Billing Address:", customer.address || "Counter Sale", "", "Place of Supply:", customer.placeOfSupply || "Raipur (22)"],
    [],
    // Table Headers
    [
      "S.No",
      "Item Description",
      "HSN/SAC",
      "Qty",
      "Unit",
      "Rate (₹)",
      "Discount (%)",
      "Taxable Value (₹)",
      "GST (%)",
      "CGST (₹)",
      "SGST (₹)",
      "Total Amount (₹)"
    ]
  ];

  // Populate line items
  rows.forEach((row, index) => {
    const qty = Number(row.qty) || 0;
    const rate = Number(row.rate) || 0;
    const disc = Number(row.discountPercent) || 0;
    const gstPct = Number(row.gstPercent) || 0;

    const gross = qty * rate;
    const discAmount = gross * (disc / 100);
    const taxable = gross - discAmount;
    const gstAmount = taxable * (gstPct / 100);
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const lineTotal = taxable + gstAmount;

    excelData.push([
      index + 1,
      row.itemName,
      row.hsn || "",
      qty,
      row.unit || "Pcs",
      rate,
      disc,
      taxable,
      gstPct,
      cgst,
      sgst,
      lineTotal
    ]);
  });

  // Empty spacer
  excelData.push([]);

  // Summary section
  excelData.push(["", "", "", "", "", "", "", "", "", "", "Subtotal:", summary.taxableSubtotal]);
  excelData.push(["", "", "", "", "", "", "", "", "", "", "CGST Total:", summary.cgstTotal]);
  excelData.push(["", "", "", "", "", "", "", "", "", "", "SGST Total:", summary.sgstTotal]);
  if (summary.igstTotal > 0) {
    excelData.push(["", "", "", "", "", "", "", "", "", "", "IGST Total:", summary.igstTotal]);
  }
  excelData.push(["", "", "", "", "", "", "", "", "", "", "Round Off:", summary.roundOff]);
  excelData.push(["", "", "", "", "", "", "", "", "", "", "NET PAYABLE (₹):", summary.grandTotal]);
  excelData.push([]);
  excelData.push(["Amount in Words:", numberToWordsIndian(summary.grandTotal)]);
  excelData.push([]);
  excelData.push(["Terms & Conditions:"]);
  storeInfo.terms.forEach(t => excelData.push([t]));
  excelData.push([]);
  excelData.push(["", "", "", "", "", "", "", "", "For " + storeInfo.name]);
  excelData.push(["", "", "", "", "", "", "", "", "Authorized Signatory"]);

  // Create Workbook
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths for polished Excel appearance
  worksheet['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 36 }, // Item Description
    { wch: 10 }, // HSN/SAC
    { wch: 8 },  // Qty
    { wch: 8 },  // Unit
    { wch: 12 }, // Rate
    { wch: 12 }, // Discount
    { wch: 16 }, // Taxable Value
    { wch: 10 }, // GST %
    { wch: 12 }, // CGST
    { wch: 12 }, // SGST
    { wch: 18 }  // Total Amount
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sudama_Hardware_Invoice");

  // Save File
  const filename = `Sudama_Hardware_Invoice_${invoiceNumber.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Import spreadsheet (.xlsx / .csv) into invoice rows
 */
export function importExcelToInvoice(file, onRowsLoaded) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (!jsonRows || jsonRows.length === 0) {
        alert("The selected Excel file appears to be empty.");
        return;
      }

      // Detect header row or map columns
      const parsedRows = [];
      let startProcessing = false;

      jsonRows.forEach((row, idx) => {
        if (!row || row.length === 0) return;
        
        // Find header row or process standard row
        const rowStr = row.join(" ").toLowerCase();
        if (rowStr.includes("item") || rowStr.includes("description") || rowStr.includes("qty") || rowStr.includes("rate")) {
          startProcessing = true;
          return;
        }

        if (startProcessing || idx >= 0) {
          // Check if row has at least an item name and rate/qty
          const name = row[1] || row[0];
          if (name && typeof name === 'string' && name.trim().length > 0 && !name.toLowerCase().includes("subtotal") && !name.toLowerCase().includes("terms")) {
            const qty = parseFloat(row[3]) || parseFloat(row[2]) || 1;
            const rate = parseFloat(row[5]) || parseFloat(row[4]) || 100;
            const hsn = row[2] ? String(row[2]) : "3917";
            const unit = row[4] ? String(row[4]) : "Pcs";
            const discount = parseFloat(row[6]) || 0;
            const gst = parseFloat(row[8]) || parseFloat(row[7]) || 18;

            parsedRows.push({
              id: `imported-${Date.now()}-${idx}`,
              itemName: name.trim(),
              hsn: hsn.trim(),
              qty: qty,
              unit: unit,
              rate: rate,
              discountPercent: discount,
              gstPercent: gst
            });
          }
        }
      });

      if (parsedRows.length > 0) {
        onRowsLoaded(parsedRows);
      } else {
        alert("Could not automatically parse items from the Excel sheet. Please ensure columns match: [Item Name, HSN, Qty, Unit, Rate, Discount %, GST %].");
      }
    } catch (err) {
      console.error("Excel import error:", err);
      alert("Failed to parse Excel file. Make sure it is a valid .xlsx or .csv document.");
    }
  };
  reader.readAsArrayBuffer(file);
}

/**
 * Generate blank Excel template for Sudama Hardware
 */
export function downloadExcelTemplate() {
  const headers = [
    ["S.No", "Item Description", "HSN Code", "Quantity", "Unit", "Rate (₹)", "Discount %", "GST %"]
  ];
  
  const sampleItems = [
    [1, 'CPVC Pipe 1" (3 Meter)', "3917", 10, "Pcs", 380, 5, 18],
    [2, "Modular Copper Wire 2.5 sq mm", "8544", 2, "Roll", 2680, 10, 18],
    [3, "Professional Impact Drill 13mm", "8467", 1, "Set", 2450, 0, 18],
    [4, "Synthetic Enamel Paint Gloss White 4L", "3208", 2, "Bucket", 1250, 0, 28]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...sampleItems]);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 35 },
    { wch: 12 },
    { wch: 10 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hardware_Items_Template");
  XLSX.writeFile(workbook, "Sudama_Hardware_Invoice_Template.xlsx");
}
