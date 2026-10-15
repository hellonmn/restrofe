import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Users,
  Sparkles,
  X,
  CreditCard,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { TableQR, TableSection } from '../../types';

export const TablesView: React.FC = () => {
  const {
    tables,
    profile,
    addTable,
    updateTableUPI,
    setSelectedStandeeTable,
  } = useRestaurant();

  const [filterSection, setFilterSection] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCapacity, setNewCapacity] = useState('4');
  const [newSection, setNewSection] = useState<TableSection>('Indoor Main');

  // Edit UPI modal
  const [editingTableUPI, setEditingTableUPI] = useState<TableQR | null>(null);
  const [customUPI, setCustomUPI] = useState('');

  const sections: (TableSection | 'All')[] = [
    'All',
    'Indoor Main',
    'Patio Garden',
    'Rooftop Terrace',
    'Bar Counter',
  ];

  const filteredTables = tables.filter(
    (t) => filterSection === 'All' || t.section === filterSection
  );

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    addTable(parseInt(newCapacity, 10) || 4, newSection);
    setIsAddModalOpen(false);
  };

  const handleSaveUPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTableUPI && customUPI.trim()) {
      updateTableUPI(editingTableUPI.tableNumber, customUPI.trim());
      setEditingTableUPI(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-[#FF5A1F] border border-orange-500/30 flex items-center gap-1">
              <Sparkles size={12} /> Contactless Table QR & UPI
            </span>
            <span className="text-xs font-semibold text-slate-400">Direct Merchant Routing</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Print Acrylic Standees for All {tables.length} Tables
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Each standee embeds the table number and your direct UPI VPA (<code className="text-[#FF5A1F] font-bold">{profile.upiVpa}</code>). When guests scan, they view your digital menu, order, and pay directly into your bank without staff delays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-md shadow-[#FF5A1F]/30 transition"
          >
            <Plus size={16} />
            <span>Add New Table</span>
          </button>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setFilterSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterSection === sec
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sec} ({sec === 'All' ? tables.length : tables.filter((t) => t.section === sec).length})
          </button>
        ))}
      </div>

      {/* Tables Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <div
            key={table.tableNumber}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900">
                      Table {table.tableNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                      <Users size={12} /> {table.capacity} Seater
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-1 block">
                    {table.section}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    table.status === 'vacant'
                      ? 'bg-slate-100 text-slate-600'
                      : table.status === 'seated'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : table.status === 'bill_pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 pulse-dot'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  {table.status.replace('_', ' ')}
                </span>
              </div>

              {/* Status & Bill Details */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Occupancy:</span>
                  <span className="font-bold text-slate-800">
                    {table.status === 'vacant' ? 'Empty Table' : `${table.activeGuests || 2} Diners Dining`}
                  </span>
                </div>
                {table.status !== 'vacant' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Running Check:</span>
                    <span className="font-extrabold text-[#FF5A1F]">
                      ₹{table.currentBill || 0}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                  <span className="text-slate-400 font-medium">UPI VPA:</span>
                  <span className="font-mono text-slate-600 font-semibold truncate max-w-[130px]">
                    {table.upiVpa}
                  </span>
                </div>
              </div>
            </div>

            {/* Standee Preview & Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedStandeeTable(table)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-xs"
              >
                <Printer size={14} />
                <span>Print Standee</span>
              </button>

              <button
                onClick={() => {
                  setEditingTableUPI(table);
                  setCustomUPI(table.upiVpa);
                }}
                title="Edit Table UPI"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                <CreditCard size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Table to Floor</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Area</label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value as TableSection)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
                >
                  <option value="Indoor Main">Indoor Main</option>
                  <option value="Patio Garden">Patio Garden</option>
                  <option value="Rooftop Terrace">Rooftop Terrace</option>
                  <option value="Bar Counter">Bar Counter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seating Capacity</label>
                <select
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
                >
                  <option value="2">2 Seater (Couple / High Table)</option>
                  <option value="4">4 Seater (Standard Dining)</option>
                  <option value="6">6 Seater (Family Booth)</option>
                  <option value="8">8 Seater (Large Banquet)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912]"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table UPI Modal */}
      {editingTableUPI && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Map UPI for Table {editingTableUPI.tableNumber}
              </h3>
              <button
                onClick={() => setEditingTableUPI(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUPI} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merchant UPI VPA *</label>
                <input
                  type="text"
                  required
                  value={customUPI}
                  onChange={(e) => setCustomUPI(e.target.value)}
                  placeholder="e.g. burgerhouse@hdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5A1F]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  All dine-in payments made by scanning this table's QR will settle instantly into this VPA.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTableUPI(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912]"
                >
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
