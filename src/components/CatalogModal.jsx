import React, { useState } from 'react';
import { X, Search, Plus, Wrench, Check } from 'lucide-react';
import { HARDWARE_PRODUCT_CATALOG } from '../data/hardwareProducts';

const CATEGORIES = ["All", "Plumbing", "Electrical", "Tools", "Fasteners", "Paints", "Hardware"];

export default function CatalogModal({ isOpen, onClose, onAddItem }) {
  if (!isOpen) return null;

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [addedIds, setAddedIds] = useState([]);

  const filtered = HARDWARE_PRODUCT_CATALOG.filter(p => {
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.hsn.includes(search) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAdd = (product) => {
    onAddItem(product);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-bg bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Sudama Hardware Product Catalog
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/90">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search CPVC pipe, drill machine, wire, screws, HSN code..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition ${
                  selectedCat === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Catalog List */}
        <div className="p-4 overflow-y-auto divide-y divide-slate-800/80 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No items matching "{search}" in catalog.
            </div>
          ) : (
            filtered.map((item) => {
              const isAdded = addedIds.includes(item.id);

              return (
                <div 
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/40 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-xs">{item.name}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        HSN: {item.hsn}
                      </span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Rate: <span className="text-slate-200 font-mono font-bold">₹{item.rate}</span> per {item.unit} • GST {item.gst}%
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isAdded
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Bill
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs text-center">
          Click "Add to Bill" to instantly insert item into active Excel invoice grid.
        </div>

      </div>
    </div>
  );
}
