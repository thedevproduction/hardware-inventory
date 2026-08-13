import React, { useState } from 'react';
import { X, Settings, Save, Building, CreditCard, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, storeInfo, setStoreInfo }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({ ...storeInfo });

  const handleSave = (e) => {
    e.preventDefault();
    setStoreInfo(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-bg bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Configure Sudama Hardware Store Settings
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Shop Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 border-b border-slate-800 pb-1">
              <Building className="w-3.5 h-3.5" /> Shop Profile & Contact
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Store / Firm Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Business Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Full Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Phone Numbers</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email ID</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* GST & Tax Registration */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 border-b border-slate-800 pb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> GST & Tax Registration
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Store GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono uppercase outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">PAN Number</label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono uppercase outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Bank & UPI Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 border-b border-slate-800 pb-1">
              <CreditCard className="w-3.5 h-3.5" /> Bank & UPI Details (for Invoice Printing)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNo}
                  onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono uppercase outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">UPI VPA Handle</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
