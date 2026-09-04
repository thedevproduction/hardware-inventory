import http.server
import socketserver
import json
import base64
import mimetypes
import os
import re
from urllib.parse import urlparse

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Ensure data directory exists on disk
os.makedirs(DATA_DIR, exist_ok=True)
BILLS_DIR = os.path.join(DATA_DIR, 'bills')
os.makedirs(BILLS_DIR, exist_ok=True)
QUOTATIONS_DIR = os.path.join(DATA_DIR, 'quotations_pdf')
os.makedirs(QUOTATIONS_DIR, exist_ok=True)

INVOICES_FILE = os.path.join(DATA_DIR, 'invoices.json')
QUOTATIONS_FILE = os.path.join(DATA_DIR, 'quotations.json')
CATALOG_FILE = os.path.join(DATA_DIR, 'catalog.json')
STORE_FILE = os.path.join(DATA_DIR, 'store_info.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
CUSTOMERS_FILE = os.path.join(DATA_DIR, 'customers.json')
VENDORS_FILE = os.path.join(DATA_DIR, 'vendors.json')
PURCHASES_FILE = os.path.join(DATA_DIR, 'vendor_purchases.json')
COUNTER_FILE = os.path.join(DATA_DIR, 'invoice_counter.json')
CATEGORIES_FILE = os.path.join(DATA_DIR, 'categories.json')
UNITS_FILE = os.path.join(DATA_DIR, 'units.json')

DEFAULT_CATEGORIES = ["Plumbing", "Electrical", "Fasteners", "Tools", "Paints", "Sanitary", "Pipes & Fittings", "General Hardware"]
DEFAULT_UNITS = ["Pcs", "Box", "Kg", "Mtr", "mtr", "Pkt", "Set", "Tin", "Bucket", "Roll", "Pair", "Bundle", "SqFt", "Ltr"]

DEFAULT_USERS = [
    {
        "id": "u1",
        "username": "hardware.sudama@gmail.com",
        "password": "sudama@deep",
        "name": "Sudama Owner (Admin)",
        "role": "Admin",
        "createdAt": "2026-01-01T00:00:00.000Z"
    }
]

DEFAULT_CUSTOMERS = [
    {
        "id": "c1",
        "name": "Ramesh Construction & Builders",
        "type": "Contractor",
        "phone": "+91 98270 44551",
        "gstin": "22BKPPS9910A1Z2",
        "address": "Site No. 4, Shankar Nagar, Raipur, CG"
    },
    {
        "id": "c2",
        "name": "Sharma Electrical Works",
        "type": "Plumber/Electrician",
        "phone": "+91 94255 12345",
        "gstin": "",
        "address": "Shop 12, Main Market, Raipur, CG"
    },
    {
        "id": "c3",
        "name": "Gupta Traders & Sanitary",
        "type": "Wholesale",
        "phone": "+91 98930 77889",
        "gstin": "22AAACG1122B1Z9",
        "address": "Fafadih Chowk, Raipur, CG"
    },
    {
        "id": "c4",
        "name": "Counter Walk-in Customer",
        "type": "Walk-in",
        "phone": "",
        "gstin": "",
        "address": "Local Cash Counter"
    }
]

DEFAULT_VENDORS = [
    {
        "id": "v1",
        "name": "Supreme Pipes & Fittings Ltd",
        "contactPerson": "Rajesh Sharma",
        "phone": "+91 98261 11223",
        "gstin": "22AAACS1234F1Z1",
        "email": "sales@supremepipes.com",
        "address": "Bhanpuri Industrial Area, Raipur, CG"
    },
    {
        "id": "v2",
        "name": "Havells India Pvt Ltd (Regional Distributor)",
        "contactPerson": "Vikram Patel",
        "phone": "+91 94252 88990",
        "gstin": "22AABCH5678G1Z5",
        "email": "raipur@havells.com",
        "address": "Transport Nagar, Tatibandh, Raipur, CG"
    },
    {
        "id": "v3",
        "name": "Jindal Hardware & Fasteners Agency",
        "contactPerson": "Amit Jindal",
        "phone": "+91 98931 44556",
        "gstin": "22AAACJ9988H1Z2",
        "email": "jindalhardware@gmail.com",
        "address": "Gudhiyari Main Road, Raipur, CG"
    },
    {
        "id": "v4",
        "name": "Asian Paints & Chemical Wholesale",
        "contactPerson": "Sanjay Verma",
        "phone": "+91 98271 66778",
        "gstin": "22AAACA3344J1Z9",
        "email": "asianpaints.raipur@gmail.com",
        "address": "Fafadih Industrial Estate, Raipur, CG"
    }
]

DEFAULT_VENDOR_PURCHASES = [
    {
        "id": "vp1",
        "vendorId": "v1",
        "vendorName": "Supreme Pipes & Fittings Ltd",
        "productId": "p1",
        "productName": "CPVC Pipe 1\" (3 Meter)",
        "hsn": "3917",
        "category": "Plumbing",
        "unit": "Pcs",
        "purchaseRate": 310.0,
        "quantity": 100,
        "purchaseDate": "2026-08-01",
        "billNumber": "SUP-INV-2026-881",
        "remarks": "Bulk Plumbing Lot Discount"
    },
    {
        "id": "vp2",
        "vendorId": "v3",
        "vendorName": "Jindal Hardware & Fasteners Agency",
        "productId": "p1",
        "productName": "CPVC Pipe 1\" (3 Meter)",
        "hsn": "3917",
        "category": "Plumbing",
        "unit": "Pcs",
        "purchaseRate": 340.0,
        "quantity": 50,
        "purchaseDate": "2026-08-05",
        "billNumber": "JIN-8891",
        "remarks": "Urgent Stock Replenishment"
    },
    {
        "id": "vp3",
        "vendorId": "v2",
        "vendorName": "Havells India Pvt Ltd (Regional Distributor)",
        "productId": "e1",
        "productName": "FR PVC Wire 1.5 sq mm (90m Roll)",
        "hsn": "8544",
        "category": "Electrical",
        "unit": "Roll",
        "purchaseRate": 2250.0,
        "quantity": 25,
        "purchaseDate": "2026-08-02",
        "billNumber": "HAV-2026-9041",
        "remarks": "Standard Trade Discount Rate"
    },
    {
        "id": "vp4",
        "vendorId": "v3",
        "vendorName": "Jindal Hardware & Fasteners Agency",
        "productId": "e1",
        "productName": "FR PVC Wire 1.5 sq mm (90m Roll)",
        "hsn": "8544",
        "category": "Electrical",
        "unit": "Roll",
        "purchaseRate": 2400.0,
        "quantity": 10,
        "purchaseDate": "2026-08-06",
        "billNumber": "JIN-9102",
        "remarks": "Small Order Quantity"
    }
]

def load_json(filepath, default):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
    return default


def get_last_invoice_seq():
    if os.path.exists(COUNTER_FILE):
        try:
            with open(COUNTER_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('lastSeq', 1000)
        except Exception:
            pass
    invoices = load_json(INVOICES_FILE, [])
    max_seq = 1000
    for inv in invoices:
        inv_no = inv.get('invoiceNumber', '')
        match = re.search(r'(\d+)$', inv_no)
        if match:
            seq = int(match.group(1))
            if seq > max_seq:
                max_seq = seq
    save_json(COUNTER_FILE, {'lastSeq': max_seq})
    return max_seq


def process_and_save_vendor_purchases(purchases_data):
    """
    Extracts binary Base64 files from vendor purchase records,
    saves them to data/bills/ physical files, and replaces inline Base64
    data with lightweight file path linkages in vendor_purchases.json.
    """
    if not isinstance(purchases_data, list):
        save_json(PURCHASES_FILE, purchases_data)
        return purchases_data

    cleaned_purchases = []
    for item in purchases_data:
        if isinstance(item, dict) and 'billFile' in item and isinstance(item['billFile'], dict):
            bill = item['billFile']
            data_str = bill.get('data', '')
            if isinstance(data_str, str) and data_str.startswith('data:'):
                try:
                    header, b64_content = data_str.split(';base64,')
                    mime_type = header.replace('data:', '')
                    
                    ext = '.pdf' if 'pdf' in mime_type else ('.png' if 'png' in mime_type else ('.jpg' if 'jpeg' in mime_type or 'jpg' in mime_type else '.bin'))
                    record_id = item.get('id', 'bill_' + str(int(os.path.getmtime(PURCHASES_FILE) if os.path.exists(PURCHASES_FILE) else 0)))
                    orig_name = bill.get('name', 'vendor_bill')
                    clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', orig_name)
                    if not clean_name.endswith(ext):
                        clean_name += ext

                    file_basename = f"{record_id}_{clean_name}"
                    file_path = os.path.join(BILLS_DIR, file_basename)
                    
                    binary_bytes = base64.b64decode(b64_content)
                    with open(file_path, 'wb') as bf:
                        bf.write(binary_bytes)

                    relative_path = f"data/bills/{file_basename}"
                    file_url = f"/api/bills/{file_basename}"

                    item['billFile'] = {
                        'name': orig_name,
                        'type': mime_type,
                        'size': len(binary_bytes),
                        'path': relative_path,
                        'url': file_url
                    }
                    print(f"[DISK STORAGE] Extracted & saved bill file: {relative_path} ({len(binary_bytes)} bytes)")
                except Exception as e:
                    print(f"Error extracting bill document: {e}")

        cleaned_purchases.append(item)

    save_json(PURCHASES_FILE, cleaned_purchases)
    return cleaned_purchases


def process_and_save_quotations(quotations_data):
    if not isinstance(quotations_data, list):
        save_json(QUOTATIONS_FILE, quotations_data)
        return quotations_data

    cleaned = []
    for item in quotations_data:
        if isinstance(item, dict) and 'quotationPdf' in item and isinstance(item['quotationPdf'], dict):
            q_file = item['quotationPdf']
            data_str = q_file.get('data', '')
            if isinstance(data_str, str) and data_str.startswith('data:'):
                try:
                    header, b64_content = data_str.split(';base64,')
                    mime_type = header.replace('data:', '')
                    ext = '.pdf' if 'pdf' in mime_type else '.bin'
                    orig_name = q_file.get('name', 'quotation.pdf')
                    clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', orig_name)
                    if not clean_name.endswith(ext):
                        clean_name += ext

                    file_basename = f"{item.get('id', 'qt')}_{clean_name}"
                    file_path = os.path.join(QUOTATIONS_DIR, file_basename)

                    binary_bytes = base64.b64decode(b64_content)
                    with open(file_path, 'wb') as qf:
                        qf.write(binary_bytes)

                    relative_path = f"data/quotations_pdf/{file_basename}"
                    file_url = f"/api/quotations_pdf/{file_basename}"

                    item['quotationPdf'] = {
                        'name': orig_name,
                        'type': mime_type,
                        'size': len(binary_bytes),
                        'path': relative_path,
                        'url': file_url
                    }
                    print(f"[DISK STORAGE] Saved quotation PDF file: {relative_path}")
                except Exception as e:
                    print(f"Error extracting quotation PDF: {e}")
        cleaned.append(item)

    save_json(QUOTATIONS_FILE, cleaned)
    return cleaned

def save_json(filepath, data):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith('/api/bills/'):
            filename = os.path.basename(parsed.path)
            filepath = os.path.join(BILLS_DIR, filename)
            if os.path.exists(filepath):
                mime_type, _ = mimetypes.guess_type(filepath)
                if not mime_type:
                    mime_type = 'application/pdf' if filename.endswith('.pdf') else 'application/octet-stream'
                self.send_response(200)
                self.send_header('Content-Type', mime_type)
                self.send_header('Content-Length', str(os.path.getsize(filepath)))
                self.end_headers()
                with open(filepath, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_response(404)
                self.end_headers()
                return

        if parsed.path == '/api/data':
            data = {
                'invoices': load_json(INVOICES_FILE, []),
                'quotations': load_json(QUOTATIONS_FILE, []),
                'catalog': load_json(CATALOG_FILE, None),
                'storeInfo': load_json(STORE_FILE, None),
                'users': load_json(USERS_FILE, DEFAULT_USERS),
                'customers': load_json(CUSTOMERS_FILE, DEFAULT_CUSTOMERS),
                'vendors': load_json(VENDORS_FILE, DEFAULT_VENDORS),
                'vendorPurchases': load_json(PURCHASES_FILE, DEFAULT_VENDOR_PURCHASES),
                'categories': load_json(CATEGORIES_FILE, DEFAULT_CATEGORIES),
                'units': load_json(UNITS_FILE, DEFAULT_UNITS),
                'lastInvoiceSeq': get_last_invoice_seq()
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('utf-8'))
            return
        
        # Serve static files (index.html, etc)
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        if parsed.path == '/api/invoices':
            save_json(INVOICES_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Invoices saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/quotations':
            process_and_save_quotations(payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Quotations saved to disk in data/quotations.json'}).encode('utf-8'))
            return

        elif parsed.path == '/api/save-quotation-pdf':
            filename = payload.get('filename', f"quotation_{int(os.path.getmtime(QUOTATIONS_FILE) if os.path.exists(QUOTATIONS_FILE) else 0)}.pdf")
            clean_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
            if not clean_filename.endswith('.pdf'):
                clean_filename += '.pdf'
            b64_content = payload.get('pdfBase64', '')
            if b64_content:
                if ';base64,' in b64_content:
                    _, b64_content = b64_content.split(';base64,')
                pdf_bytes = base64.b64decode(b64_content)
                file_path = os.path.join(QUOTATIONS_DIR, clean_filename)
                with open(file_path, 'wb') as pdf_file:
                    pdf_file.write(pdf_bytes)
                relative_path = f"data/quotations_pdf/{clean_filename}"
                file_url = f"/api/quotations_pdf/{clean_filename}"
                print(f"[DISK STORAGE] Saved quotation PDF file to data/quotations_pdf/: {relative_path} ({len(pdf_bytes)} bytes)")
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok', 'path': relative_path, 'url': file_url}).encode('utf-8'))
                return

        elif parsed.path == '/api/categories':
            save_json(CATEGORIES_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Categories saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/units':
            save_json(UNITS_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Units saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/catalog':
            save_json(CATALOG_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Catalog saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/store':
            save_json(STORE_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Store settings saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/users':
            save_json(USERS_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Users saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/customers':
            save_json(CUSTOMERS_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Customers saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/vendors':
            save_json(VENDORS_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Vendors saved to disk'}).encode('utf-8'))
            return

        
        elif parsed.path == '/api/counter':
            save_json(COUNTER_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Invoice counter saved to disk'}).encode('utf-8'))
            return

        elif parsed.path == '/api/vendor_purchases':
            cleaned_data = process_and_save_vendor_purchases(payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Vendor purchases saved to disk', 'vendorPurchases': cleaned_data}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

    # Automatic migration of existing Base64 bill documents in data/vendor_purchases.json
    if os.path.exists(PURCHASES_FILE):
        try:
            existing_vp = load_json(PURCHASES_FILE, [])
            has_b64 = any(isinstance(v, dict) and isinstance(v.get('billFile'), dict) and str(v['billFile'].get('data', '')).startswith('data:') for v in existing_vp)
            if has_b64:
                print("[DISK STORAGE] Migrating inline Base64 bill documents to physical files in data/bills/...")
                process_and_save_vendor_purchases(existing_vp)
        except Exception as err:
            print(f"Error during bill migration: {err}")

if not os.path.exists(CATEGORIES_FILE):
    save_json(CATEGORIES_FILE, DEFAULT_CATEGORIES)
if not os.path.exists(UNITS_FILE):
    save_json(UNITS_FILE, DEFAULT_UNITS)

if __name__ == '__main__':
    print(f"Sudama Hardware Disk Server running on http://localhost:{PORT}")
    print(f"Data directory on disk: {DATA_DIR}")
    with ThreadingTCPServer(("", PORT), CustomHandler) as httpd:
        httpd.serve_forever()
