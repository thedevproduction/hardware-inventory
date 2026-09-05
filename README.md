# Sudama Hardware - Excel Invoice & GST Billing Suite (`hardware-inventory`)

A fast, interactive, web-based Microsoft Excel Invoice & GST Billing application tailored specifically for **Sudama Hardware**. It enables shop owners, managers, and cashiers to generate, edit, print, and export hardware invoices using an Excel-style spreadsheet interface with hard disk data persistence, staff authentication, customer directory, customer ledger accounting, quotation management, vendor inventory tracking, direct catalog purchase recording, profit margin calculations, and sales analytics.

---

## 📋 System Prerequisites (For New Machines)

To run this application on a completely new computer (**macOS**, **Windows**, or **Linux**), you only need:

1. **Python 3.x** 
   - Pre-installed on macOS and Linux.
   - On Windows, install Python 3 from [python.org](https://www.python.org/downloads/) or Microsoft Store.
2. **Any Modern Web Browser** (Google Chrome, Safari, Microsoft Edge, Brave, or Firefox).

> 💡 **NO Node.js, NPM, or `pip install` packages required!**
> The backend server (`server.py`) uses Python's built-in standard library (`http.server`, `json`, `os`), so it runs out-of-the-box on any new computer without installing any third-party dependencies.

---

## 🚀 How to Run the Application

### Method 1: Using Hard Disk Storage Server (100% Risk-Free Persistent Storage)
This is the **recommended method** to ensure all bills, quotations, customer ledgers, catalog items, customer records, vendor purchases, user accounts, and store settings are saved **directly as physical JSON files on your hard drive** (`data/invoices.json`, `data/quotations.json`, `data/customer_ledger.json`, `data/catalog.json`, `data/customers.json`, `data/vendors.json`, `data/vendor_purchases.json`, `data/store_info.json`, `data/users.json`).

1. Open Terminal / Command Prompt and navigate to the project folder:
   ```bash
   cd /Users/live4yashi/Projects/hardware-inventory
   ```
2. Start the disk server:
   ```bash
   python3 server.py      # macOS / Linux
   python server.py       # Windows
   ```
3. Open your browser and go to:
   👉 **`http://localhost:3000`**

- **Clearing browser cache or changing browsers will NEVER delete your billing data.**

---

### Method 2: Double-Click / Open directly in Web Browser (Browser Mode)
1. Open Finder at `/Users/live4yashi/Projects/hardware-inventory`
2. Double-click `index.html` to open in Chrome/Safari/Edge/Brave.

---

## ✨ Comprehensive Features Guide

### 1. 🔐 User Authentication & Glassmorphic Login Screen
- Requires username & password authentication before granting access to the billing counter.
- Session protection ensures unauthorized access is prevented.
- Header **`🔒 Logout`** button allows staff to quickly lock the counter when stepping away.

### 2. 👥 User Account & Password Management
- Access via **`⚙️ Settings`** -> **`👥 User Accounts`** tab.
- **Add New Staff User**: Register cashiers or store managers with full name, email/username, role (`Admin` or `Cashier`), and password.
- **Change Password**: Update passwords for any registered user account anytime.
- **Manage Active Users**: View active staff accounts, roles, and delete user accounts.

### 3. 📒 Customer Ledger & Statement of Account (New Feature)
- Access via **`👥 Customers`** -> **Browse Customer** tab.
- **`💳 Add Ledger` (Record Payment Received)**:
  - Record incoming customer payments with Date, Receive Type (`Cash`, `Cheque`, `UPI`, `Bank Transfer`), Credit Amount, and Reference Notes (e.g., Cheque No / Transaction ID).
  - **Cheque & Proof File Attachment**: Upload document/cheque attachment files (images/PDFs) linked to payment entries. Files are stored directly in `data/ledger/`.
- **`📊 Fetch Ledger` (Statement of Account)**:
  - View full chronological transaction ledger showing Opening Balance, Sales Invoices (`Type: Sale`), Received Payments (`Type: Received`), and Closing Balance.
  - **`📄 View Doc`**: 1-click preview of attached payment proofs and cheques.
  - **`✏️ Edit` & `🗑️ Delete` Action Controls**: Easily correct mistakes in past payment entries. Editing re-populates the form for adjustments, while deleting updates the customer's balance immediately on disk.
- **`🖨️ Print Ledger`**:
  - Generates a clean A4 Customer Account Statement for printing or issuing to customers.

### 4. 📝 Quotation Suite & 1-Click Bill Conversion (New Feature)
- Access via **`📝 New Quotation`** and **`📋 Quotation History`** tabs.
- **`📝 Create Quotation`**:
  - Issue formal price estimates/quotations with customizable validity period, terms, and default Payment Status pre-set to **Credit**.
- **`📋 Quotation History Register`**:
  - Track all created quotations with live counters (**Total**, **Active**, **Converted to Bill**).
  - Search and filter quotations by customer, quotation number, or date.
- **`🔄 1-Click Convert to Bill`**:
  - Converts active quotations directly into Tax Invoices. Opens a confirmation dialog and automatically transfers all line items, rates, and customer info into the live Billing Counter!
- **PDF Generation & Disk Persistence**:
  - Quotation registers are stored in `data/quotations.json` and saved as PDF files in `data/quotations_pdf/`.

### 5. 👥 Customers Catalog Manager & Auto-Fill
- Click **`👥 Customers`** in the top navigation bar or **`👥 Manage Customers`** in the billing box.
- **Customer Catalog**: Manage customer directory with Customer Name, Type (`Walk-in`, `Contractor`, `Plumber/Electrician`, `Wholesale`), Mobile/Phone, Customer GSTIN, and Site/Delivery Address.
- **Type Filters & Search**: Filter customers by type pills (`Walk-in`, `Contractor`, `Plumber/Electrician`, `Wholesale`) or search bar.
- **Instant Billing Auto-Fill**:
  - As soon as you type or select a customer name in **Customer & Billing Information**, the system automatically populates Mobile Number, GSTIN, Site Address, and Customer Type!
  - Clickable **`⚡ Fill {Name}`** chips appear below the customer input for 1-click filling.

### 6. 💾 100% Risk-Free Physical Hard Disk Storage & Sequential Counter
- Automatically persists all store data into dedicated JSON files in the `/data` folder on your computer's hard drive:
  - 📁 `data/invoices.json` (Stores all saved billing registers & sales history)
  - 📁 `data/quotations.json` (Stores all quotation records & conversion statuses)
  - 📁 `data/customer_ledger.json` (Stores customer ledger payments & balances)
  - 📁 `data/invoice_counter.json` (Stores persistent sequential invoice number sequence: `1001`, `1002`, `1003`...)
  - 📁 `data/catalog.json` (Stores your custom hardware catalog items)
  - 📁 `data/categories.json` (Stores hardware product categories)
  - 📁 `data/units.json` (Stores product measurement units)
  - 📁 `data/customers.json` (Stores registered customer directory)
  - 📁 `data/vendors.json` (Stores registered hardware suppliers)
  - 📁 `data/vendor_purchases.json` (Stores vendor purchase records & bill attachments)
  - 📁 `data/store_info.json` (Stores GSTIN, store address, bank & UPI handles)
  - 📁 `data/users.json` (Stores staff user accounts & credentials)
  - 📁 `data/ledger/` (Stores attached cheque and payment documents)
  - 📁 `data/quotations_pdf/` (Stores generated PDF quotation documents)
- Real-time automatic synchronization on every save, add, edit, or delete action.
- **Portability**: Copying the project folder to any other computer preserves all customer ledger records, quotations, catalog categories, units, and invoice sequences!

### 7. 📊 Interactive Excel Spreadsheet Grid with PP Margin Column
- Live Excel formula calculations: `Qty × (Rate × (1 + PP%/100)) - Discount % + CGST/SGST/IGST`.
- **`PP` Column (Profit Percentage)**: Placed right after `Rate (₹)` (Base/Default Rate) to apply custom profit margins (e.g. `2%`, `5%`, `10%`) at the time of sale. Named discreetly as **`PP`** on the UI so customers don't realize its purpose if viewed accidentally.
- Column letters (`A`–`L`) and line item row numbers (`1`–`N`).
- Tab key cell navigation, row additions (`+ Add Row`), row deletions, and line-item recomputations.
- **Direct Catalog Addition**: Unsourced items typed into the row show a 1-click **`➕ Save to Catalog`** button with strict validation for required fields (Name, HSN, Rate > 0, Unit).

### 8. 💰 Financial Totals, PP Profit Masking & Post-GST Costs
- **`💾 Save Register`**: Saves invoice to hard disk database and History register.
- **`🖨️ Print / PDF`**: Opens full A4 GST Tax Invoice print preview window.
- **`PP Total` (Profit Summary)**: Under **Financial Totals**, displays total profit calculated across all line items: `Sum of Qty × (Base Rate × (PP%/100))`.
  - **Masking**: Masked by default with `*****` for privacy on the counter.
  - **Toggle**: Includes an `👁️ Show` / `🙈 Hide` button to reveal the exact profit total.
  - **Print Privacy**: Completely **EXCLUDED** from print invoices and PDF exports.
- **`Misc. / Transport (₹)`**: Input field in Financial Totals to add post-GST costs (freight, transport, loading, packing). Automatically added to Net Payable and **INCLUDED** in printed invoices & PDF files.

### 9. ⚡ Live Product Catalog Autocomplete & Quick-Fill Chips
- Type any hardware name (e.g. `CPVC`, `Wire`, `Drill`, `Paint`), HSN code (`3917`, `8544`), or category in the `Item Description` field.
- **Native Browser Datalist**: Shows non-clipped suggestions directly below the input cell.
- **`⚡ Fill` Quick Chips**: Clickable amber suggestion chips pop up inside the line item cell for 1-click auto-filling of Item Name, HSN Code, Price (₹), Unit, and GST %.

### 10. 🛠️ Extended Product Catalog, Category & Unit Managers
- Click **`⚡ Catalog`** in the top navigation bar.
- **Search Bar & Category Filters**: Filter items by hardware name, HSN code, or category pills (`All`, `Plumbing`, `Electrical`, `Tools`, `Fasteners`, `Paints`, `Hardware`, `Sanitary`).
- **Manage Categories Tab**: Custom category manager to add, edit, or delete hardware categories. Persisted in `data/categories.json`.
- **Manage Units Tab**: Custom measurement unit manager to add, edit, or delete product units (`Pcs`, `Mtr`, `Kg`, `Box`, `Set`, `Roll`, etc.). Persisted in `data/units.json`.
- **Add Product**: Form to insert new products into the catalog with custom rate, unit, and GST %.
- **Edit (✏️) & Delete (🗑️)**: Modify prices or remove outdated hardware items permanently.
- **📦 Direct "Record Purchase" / "Stock In"**: Click **`📦 Record Purchase`** (in *Browse & Insert* tab) or **`📦 Stock In`** (in *Manage Catalog* tab) next to any product to instantly open the **Record Vendor Purchase Entry** overlay!

### 11. 🏭 Vendor Inventory, Direct Purchase Recording & Price Intelligence
- Access via **`🏭 Vendors`** in the top navigation bar.
- **Purchase Entry Tab**: Record incoming stock purchases from suppliers with Purchase Rate, Quantity, Bill Number, Purchase Date, Trade Discount Notes, and Attached Bill Documents.
- **📊 Real-Time Vendor Price Intelligence**:
  - Whenever recording a vendor purchase, the overlay modal automatically displays 3 live decision-support cards:
    - 🕒 **Last Purchase**: Cost price paid, date, and vendor name for the item.
    - 🟢 **Best Deal (Lowest Rate)**: Vendor who offered the lowest cost price historically.
    - 🔴 **Max Rate (Highest Rate)**: Vendor who charged the maximum cost price historically.
- **📎 Vendor Bill Document Attachment & Lightbox Preview**:
  - Attach PDF invoices (`.pdf`) or images (`.jpeg`, `.png`, `.webp`) when recording stock purchases.
  - Dedicated **`Bill Document`** column in the purchase records table with **`📄 View Bill`** / **`📎 + Attach`** buttons.
  - Opens a full-screen **Vendor Bill Document Preview** modal featuring an interactive HTML5 `<object>`/`<embed>` PDF viewer and image lightbox preview, complete with an **`📥 Download File`** button.

### 12. 📜 Sales Register Search & Date Quick-Filters
- Click **`Register`** (formerly *History*) in the top navigation bar.
- **Multi-Field Search Bar**: Instant search across Invoice Number, Customer Name, Phone, GSTIN, Payment Mode, or Line Items inside the bill.
- **Date Quick-Filter Pills**: 1-click filter by `All Time`, `Today`, `Yesterday`, `This Week`, `This Month`.
- **Graphical Calendar Date Picker**: Pick any specific date (`YYYY-MM-DD`) from an interactive calendar dropdown.
- **Real-Time Revenue Stats**: Displays live Total Bills count, Revenue Sum (₹), and Total Profit (PP) for filtered search results.
- **Register Actions**: `📋 Load` bill back into Excel grid for revisions, `📥 Excel` download, `🖨️ Print` tax invoice, or `🗑️ Delete`.

### 13. 🖨️ Automatic CAPITAL Goods Description & Multi-Format Printing
- **CAPITAL Letters Printing**: All product names in the *"Description of GOODS"* column automatically convert to **UPPERCASE** when printing Bills or Quotations!
- **Clean Blank Customer Printing**: If no customer details are typed, the printed invoice completely hides `BILLED TO:`, `Walk-in Cash Customer`, and `Counter Sale` text, producing a clean itemized receipt!
- **Staff User Audit (`Billed By`)**: Displays **`Billed By: {User Name}`** on the printed invoice header and footer so management can instantly track which cashier generated/printed each bill.
- **Single-Page GST A4 Tax Invoice**: Formal A4 tax invoice with store letterhead, Bank details, UPI QR code, line-item tax breakdown, Terms & Conditions, and Signatory box. Strictly constrained to 1 single page without extra blank pages.
- **Dynamic PDF Filename**: Saving as PDF automatically pre-fills filename with invoice number and date (e.g., `Sudama_Hardware_Invoice_SH-2026-27-9470_2026-09-05.pdf`).

### 14. ⌨️ Keyboard Shortcuts & Modal Escape Key
- Pressing the **`ESC`** key anywhere in the app instantly closes any active popup, dialog, or modal with a cross (`✕`) button.

### 15. 📦 1-Click Database Backup & Restore
- Click **`⚙️ Settings`** -> **`📥 Download JSON Backup`** to download a single backup file containing all invoices, quotations, customer ledgers, hardware catalog, customers, vendor purchases, user accounts, and settings.
- Click **`📤 Restore Backup File`** to upload and restore your entire store database anytime.

---

## 📁 Project Structure

```
hardware-inventory/
├── index.html                    # Main Single-Page Application (HTML + React + Tailwind + SheetJS)
├── server.py                     # Python 3 disk persistence server (API & Static File Server)
├── README.md                     # Application documentation and startup guide
├── package.json                  # Package dependencies manifest
├── vite.config.js                # Vite build configuration
├── data/                         # Hard disk database files directory
│   ├── invoices.json             # Saved billing registers
│   ├── quotations.json           # Saved quotation estimates & status records
│   ├── customer_ledger.json      # Customer ledger payments & balance history
│   ├── catalog.json              # Hardware product catalog
│   ├── categories.json           # Custom product categories
│   ├── units.json                # Measurement units directory
│   ├── customers.json            # Customer directory catalog
│   ├── vendors.json              # Hardware suppliers directory
│   ├── vendor_purchases.json     # Vendor purchase records & bill document attachments
│   ├── store_info.json           # Store settings & GSTIN profile
│   ├── users.json                # User accounts & credentials
│   ├── ledger/                   # Customer ledger cheque & payment proof attachments
│   ├── quotations_pdf/           # Generated PDF quotation files
│   └── bills/                    # Attached purchase bill documents
└── src/
    ├── App.jsx                   # Main React Application Component
    ├── main.jsx                  # React Entrypoint
    ├── index.css                 # Theme & @media print styles
    ├── data/
    │   └── hardwareProducts.js   # Preloaded Hardware Catalog & Store defaults
    └── utils/
        ├── excelUtils.js         # SheetJS (.xlsx) export utility functions
        └── numberToWords.js      # Indian Currency text converter (Rupees & Paise)
```

---

## 🔒 Security & Privacy Notice
All data is stored locally on your own computer (`/data` folder). No data is transmitted to external servers or cloud services, guaranteeing complete privacy and 100% offline availability.
