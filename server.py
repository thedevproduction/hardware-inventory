import http.server
import socketserver
import json
import os
from urllib.parse import urlparse

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Ensure data directory exists on disk
os.makedirs(DATA_DIR, exist_ok=True)

INVOICES_FILE = os.path.join(DATA_DIR, 'invoices.json')
CATALOG_FILE = os.path.join(DATA_DIR, 'catalog.json')
STORE_FILE = os.path.join(DATA_DIR, 'store_info.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
CUSTOMERS_FILE = os.path.join(DATA_DIR, 'customers.json')
VENDORS_FILE = os.path.join(DATA_DIR, 'vendors.json')
PURCHASES_FILE = os.path.join(DATA_DIR, 'vendor_purchases.json')

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
        if parsed.path == '/api/data':
            data = {
                'invoices': load_json(INVOICES_FILE, []),
                'catalog': load_json(CATALOG_FILE, None),
                'storeInfo': load_json(STORE_FILE, None),
                'users': load_json(USERS_FILE, DEFAULT_USERS),
                'customers': load_json(CUSTOMERS_FILE, DEFAULT_CUSTOMERS),
                'vendors': load_json(VENDORS_FILE, DEFAULT_VENDORS),
                'vendorPurchases': load_json(PURCHASES_FILE, DEFAULT_VENDOR_PURCHASES)
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

        elif parsed.path == '/api/vendor_purchases':
            save_json(PURCHASES_FILE, payload)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'message': 'Vendor purchases saved to disk'}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    print(f"Sudama Hardware Disk Server running on http://localhost:{PORT}")
    print(f"Data directory on disk: {DATA_DIR}")
    with ThreadingTCPServer(("", PORT), CustomHandler) as httpd:
        httpd.serve_forever()
