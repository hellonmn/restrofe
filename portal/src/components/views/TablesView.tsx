import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Users,
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
    <div className="space-y-6 pb-16">
      {/* Clean Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Table QR Standees & Direct UPI Routing
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {tables.length} Tables Active
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Each table has a dedicated QR code mapped to your store's merchant UPI (<strong className="text-slate-800">{profile.upiVpa}</strong>). Diners scan to view your live menu and pay instantly.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-sm transition flex-shrink-0"
        >
          <Plus size={15} />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setFilterSection(sec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filterSection === sec
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sec} ({sec === 'All' ? tables.length : tables.filter((t) => t.section === sec).length})
          </button>
        ))}
      </div>

      {/* Tables Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <div
            key={table.tableNumber}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900">
                      Table {table.tableNumber}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                      <Users size={11} /> {table.capacity}p
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">
                    {table.section}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
              <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Occupancy:</span>
                  <span className="font-semibold text-slate-700">
                    {table.status === 'vacant' ? 'Empty' : `${table.activeGuests || 2} Guests`}
                  </span>
                </div>
                {table.status !== 'vacant' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Running Bill:</span>
                    <span className="font-bold text-[#FF5A1F]">
                      ₹{table.currentBill || 0}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 font-medium">UPI VPA:</span>
                  <span className="font-mono text-slate-600 font-semibold truncate max-w-[120px]">
                    {table.upiVpa}
                  </span>
                </div>
              </div>
            </div>

            {/* Standee Preview & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedStandeeTable(table)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-2xs"
              >
                <Printer size={13} />
                <span>Print Standee</span>
              </button>

              <button
                onClick={() => {
                  setEditingTableUPI(table);
                  setCustomUPI(table.upiVpa);
                }}
                title="Edit Table UPI"
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                <CreditCard size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Table</h3>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
                >
                  <option value="2">2 Seater</option>
                  <option value="4">4 Seater</option>
                  <option value="6">6 Seater</option>
                  <option value="8">8 Seater</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
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
