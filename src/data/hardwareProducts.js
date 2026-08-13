export const DEFAULT_STORE_INFO = {
  name: "Sudama Hardware",
  tagline: "Dealers in Pipes, Power Tools, Sanitaryware, Electrical & Building Hardware",
  address: "Shop No. 12-14, Industrial Area Phase II, Station Road, Raipur, CG - 492001",
  phone: "+91 98271 88990 / +91 771 4059911",
  email: "billing@sudamahardware.com",
  gstin: "22AAACS8890A1Z5",
  pan: "AAACS8890A",
  bankName: "State Bank of India",
  accountNo: "39880199201",
  ifsc: "SBIN0001244",
  branch: "Raipur Main Branch",
  upiId: "sudamahardware@sbi",
  terms: [
    "1. Goods once sold will not be taken back or exchanged.",
    "2. Interest @ 18% p.a. will be charged if bill is not paid on due date.",
    "3. Subject to Raipur Jurisdiction only.",
    "4. Guarantee/Warranty as per manufacturer policies."
  ]
};

export const HARDWARE_PRODUCT_CATALOG = [
  // Plumbing & Fittings
  { id: "p1", name: 'CPVC Pipe 1" (3 Meter)', category: "Plumbing", hsn: "3917", rate: 380, unit: "Pcs", gst: 18 },
  { id: "p2", name: 'PVC Elbow 1" 90 Degree Heavy', category: "Plumbing", hsn: "3917", rate: 28, unit: "Pcs", gst: 18 },
  { id: "p3", name: 'Brass Tank Nipple 1"', category: "Plumbing", hsn: "7412", rate: 145, unit: "Pcs", gst: 18 },
  { id: "p4", name: 'Teflon Thread Seal Tape (12mm x 10m)', category: "Plumbing", hsn: "3919", rate: 15, unit: "Pcs", gst: 18 },
  { id: "p5", name: 'Solvent Cement CPVC 250ml Tin', category: "Plumbing", hsn: "3506", rate: 210, unit: "Tin", gst: 18 },
  { id: "p6", name: 'PTFE Ball Valve Brass 1" Heavy', category: "Plumbing", hsn: "8481", rate: 320, unit: "Pcs", gst: 18 },
  { id: "p7", name: 'SS 304 Kitchen Sink Strainer 4"', category: "Plumbing", hsn: "7324", rate: 180, unit: "Pcs", gst: 18 },

  // Electrical & Wires
  { id: "e1", name: "Modular Copper Wire 1.5 sq mm (90m Roll)", category: "Electrical", hsn: "8544", rate: 1650, unit: "Roll", gst: 18 },
  { id: "e2", name: "Modular Copper Wire 2.5 sq mm (90m Roll)", category: "Electrical", hsn: "8544", rate: 2680, unit: "Roll", gst: 18 },
  { id: "e3", name: "Single Pole MCB 16A C-Curve", category: "Electrical", hsn: "8536", rate: 175, unit: "Pcs", gst: 18 },
  { id: "e4", name: "Modular 6A 1-Way Switch Silver", category: "Electrical", hsn: "8536", rate: 42, unit: "Pcs", gst: 18 },
  { id: "e5", name: "LED Concealed Downlight 9W Warm White", category: "Electrical", hsn: "9405", rate: 210, unit: "Pcs", gst: 18 },
  { id: "e6", name: "Insulation Tape Black (Box of 10)", category: "Electrical", hsn: "3919", rate: 120, unit: "Box", gst: 18 },

  // Power Tools & Hand Tools
  { id: "t1", name: "Professional Impact Drill Machine 13mm 650W", category: "Tools", hsn: "8467", rate: 2450, unit: "Set", gst: 18 },
  { id: "t2", name: "Angle Grinder 4 Inch 850W", category: "Tools", hsn: "8467", rate: 2150, unit: "Pcs", gst: 18 },
  { id: "t3", name: "Claw Hammer 500g Fiber Handle", category: "Tools", hsn: "8205", rate: 280, unit: "Pcs", gst: 18 },
  { id: "t4", name: "Combination Pliers 8 Inch Insulated", category: "Tools", hsn: "8203", rate: 240, unit: "Pcs", gst: 18 },
  { id: "t5", name: "Screw Driver Set 8-Piece Magnetic", category: "Tools", hsn: "8205", rate: 390, unit: "Set", gst: 18 },
  { id: "t6", name: "Adjustable Wrench 12 Inch Chrome", category: "Tools", hsn: "8204", rate: 480, unit: "Pcs", gst: 18 },
  { id: "t7", name: "Measuring Tape 5 Meter Steel Lock", category: "Tools", hsn: "9017", rate: 140, unit: "Pcs", gst: 18 },

  // Fasteners & Screws
  { id: "f1", name: 'Drywall Screws 35mm x 6 (1000 Pcs Box)', category: "Fasteners", hsn: "7318", rate: 420, unit: "Box", gst: 18 },
  { id: "f2", name: "MS Hex Nut Bolt 10mm x 50mm (per kg)", category: "Fasteners", hsn: "7318", rate: 135, unit: "Kg", gst: 18 },
  { id: "f3", name: "Nylon Rawl Plugs 8mm (100 Pcs Pkt)", category: "Fasteners", hsn: "3926", rate: 65, unit: "Pkt", gst: 18 },
  { id: "f4", name: 'Self Drilling Tek Screws 1.5" (500 Box)', category: "Fasteners", hsn: "7318", rate: 580, unit: "Box", gst: 18 },
  { id: "f5", name: "SS Washers 8mm (100 Pcs)", category: "Fasteners", hsn: "7318", rate: 90, unit: "Pkt", gst: 18 },

  // Paints & Adhesives
  { id: "pt1", name: "Synthetic Enamel Paint Gloss White 4L", category: "Paints", hsn: "3208", rate: 1250, unit: "Bucket", gst: 28 },
  { id: "pt2", name: "Acrylic Wall Primer Exterior 20L", category: "Paints", hsn: "3209", rate: 2180, unit: "Bucket", gst: 28 },
  { id: "pt3", name: "Paint Roller 9 Inch Fine Synthetic", category: "Paints", hsn: "9603", rate: 145, unit: "Pcs", gst: 18 },
  { id: "pt4", name: "Emery Paper Sanding Sheet 120 Grit", category: "Paints", hsn: "6805", rate: 18, unit: "Sheet", gst: 18 },
  { id: "pt5", name: "Masking Tape 1 Inch 50 Meter", category: "Paints", hsn: "3919", rate: 55, unit: "Pcs", gst: 18 },

  // Locks, Door & Cabinet Fittings
  { id: "lk1", name: "Double Cylinder Main Door Lock SS", category: "Hardware", hsn: "8301", rate: 1850, unit: "Set", gst: 18 },
  { id: "lk2", name: "SS Mortise Handle Pair 8 Inch Satin", category: "Hardware", hsn: "8302", rate: 980, unit: "Pair", gst: 18 },
  { id: "lk3", name: "SS Soft Close Cabinet Hinge 3D (Pair)", category: "Hardware", hsn: "8302", rate: 160, unit: "Pair", gst: 18 },
  { id: "lk4", name: "Brass Padlock 65mm Triple Key", category: "Hardware", hsn: "8301", rate: 490, unit: "Pcs", gst: 18 },
  { id: "lk5", name: "Telescopic Drawer Channel 18 Inch (Pair)", category: "Hardware", hsn: "8302", rate: 320, unit: "Pair", gst: 18 }
];

export const INITIAL_INVOICE_ROW = {
  id: "row-1",
  itemName: 'CPVC Pipe 1" (3 Meter)',
  hsn: "3917",
  qty: 10,
  unit: "Pcs",
  rate: 380,
  discountPercent: 5,
  gstPercent: 18
};
