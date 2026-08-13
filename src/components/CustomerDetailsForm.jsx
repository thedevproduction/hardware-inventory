import React from 'react';
import { User, Phone, MapPin, Hash, Calendar, CreditCard, ShieldCheck, Tag } from 'lucide-react';

export default function CustomerDetailsForm({
  customer,
  setCustomer,
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  paymentMode,
  setPaymentMode,
  customerType,
  setCustomerType
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-heading">
            Customer & Billing Details
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {['Walk-in', 'Contractor', 'Plumber/Electrician', 'Wholesale'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setCustomerType(type)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition ${
                customerType === type
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Customer Name */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            Customer / Contractor Name
          </label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder="e.g. Ramesh Construction / Cash Sale"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 outline-none transition"
          />
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            Phone / Mobile
          </label>
          <input
            type="text"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            placeholder="+91 98930 XXXXX"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 outline-none font-mono transition"
          />
        </div>

        {/* Customer GSTIN */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            Customer GSTIN (Optional)
          </label>
          <input
            type="text"
            value={customer.gstin}
            onChange={(e) => setCustomer({ ...customer, gstin: e.target.value.toUpperCase() })}
            placeholder="22ABCDE1234F1Z5"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 outline-none uppercase font-mono transition"
          />
        </div>

        {/* Invoice Number */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            Invoice No.
          </label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-amber-400 font-bold font-mono outline-none transition"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Billing / Delivery Address
          </label>
          <input
            type="text"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            placeholder="Site Location / Address (optional for counter sale)"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 outline-none transition"
          />
        </div>

        {/* Invoice Date & Due Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Bill Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2 py-2 text-slate-200 outline-none font-mono transition"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2 py-2 text-slate-200 outline-none font-mono transition"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            Payment Status / Mode
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3 py-2 text-slate-100 font-semibold outline-none transition"
          >
            <option value="Cash Paid">Cash (Paid)</option>
            <option value="UPI / Online">UPI / QR Code</option>
            <option value="Bank Transfer">Bank Transfer / NEFT</option>
            <option value="Card">Credit / Debit Card</option>
            <option value="Credit (Udhar)">Credit (Pending / Udhar)</option>
            <option value="Partial Paid">Partial Paid</option>
          </select>
        </div>

      </div>
    </div>
  );
}
