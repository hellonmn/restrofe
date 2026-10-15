import React, { useState } from 'react';
import {
  Users,
  IndianRupee,
  QrCode,
  ArrowUpRight,
  Plus,
  Tag,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { HOURLY_TRAFFIC } from '../../data/mockData';

export const DashboardView: React.FC = () => {
  const {
    tables,
    visits,
    setActiveTab,
    setSelectedStandeeTable,
    updateTableStatus,
  } = useRestaurant();

  const [selectedSection, setSelectedSection] = useState<string>('All');

  const todayRevenue = visits.reduce((acc, v) => acc + v.amount, 0);
  const activeTables = tables.filter((t) => t.status !== 'vacant');
  const avgBill = visits.length ? Math.round(todayRevenue / visits.length) : 0;
  const commissionSaved = Math.round(todayRevenue * 0.22); // 22% typical aggregator commission

  const filteredTables = tables.filter(
    (t) => selectedSection === 'All' || t.section === selectedSection
  );

  const sections = ['All', 'Indoor Main', 'Patio Garden', 'Rooftop Terrace', 'Bar Counter'];

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight size={12} /> 18.4%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            Directly settled via table UPI
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Table Occupancy
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTables.length} <span className="text-base text-slate-400 font-normal">/ {tables.length}</span>
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {Math.round((activeTables.length / tables.length) * 100)}% Full
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {tables.filter((t) => t.status === 'bill_pending').length} bills waiting payment
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Table Bill
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{avgBill.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
              +₹140 vs avg
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            Driven by stacked coin offers
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Commission Saved
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{commissionSaved.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              0% Fee
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            Saved vs 22% aggregator cuts
          </p>
        </div>
      </div>

      {/* Main Floor Grid + Side Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Table Matrix */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          {/* Section Header & Area Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Live Table Floor Plan
              </h2>
              <p className="text-xs text-slate-500">
                Tap table actions to update dining status or print QR standee
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    selectedSection === sec
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredTables.map((table) => {
              const isOccupied = table.status !== 'vacant';
              return (
                <div
                  key={table.tableNumber}
                  className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    table.status === 'vacant'
                      ? 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                      : table.status === 'seated'
                      ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                      : table.status === 'bill_pending'
                      ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                      : 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Table number + Capacity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm">
                          T-{table.tableNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({table.capacity}p)
                        </span>
                      </div>

                      <span
                        className={`w-2 h-2 rounded-full ${
                          table.status === 'vacant'
                            ? 'bg-slate-300'
                            : table.status === 'seated'
                            ? 'bg-blue-500'
                            : table.status === 'bill_pending'
                            ? 'bg-amber-500 pulse-dot'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    <span className="text-[11px] font-medium text-slate-400 block truncate mt-0.5">
                      {table.section}
                    </span>

                    {/* Middle details */}
                    <div className="my-2.5">
                      {isOccupied ? (
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-800">
                            ₹{table.currentBill || 0}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {table.lastScannedTime || 'Dining'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Vacant</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => setSelectedStandeeTable(table)}
                      title="Print Standee"
                      className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-white transition"
                    >
                      <QrCode size={14} />
                    </button>

                    <button
                      onClick={() =>
                        updateTableStatus(
                          table.tableNumber,
                          table.status === 'vacant'
                            ? 'seated'
                            : table.status === 'seated'
                            ? 'bill_pending'
                            : table.status === 'bill_pending'
                            ? 'paid_verified'
                            : 'vacant'
                        )
                      }
                      className="text-[11px] font-bold text-[#FF5A1F] hover:text-[#E44912] px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
                    >
                      {table.status === 'vacant'
                        ? 'Seat'
                        : table.status === 'seated'
                        ? 'Bill'
                        : table.status === 'bill_pending'
                        ? 'Paid'
                        : 'Free'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Peak Hours Traffic Heatmap */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dining Rush Hours
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Peak: <strong className="text-slate-800">7:30 PM - 9:45 PM</strong>
              </span>
            </div>

            <div className="flex items-end gap-2 h-24 pt-2">
              {HOURLY_TRAFFIC.map((item) => {
                const max = 86;
                const heightPct = Math.round((item.diners / max) * 100);
                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <div className="w-full bg-slate-100 rounded-t h-16 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t transition-all group-hover:opacity-80 ${
                          item.isPeak
                            ? 'bg-[#FF5A1F]'
                            : 'bg-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-800">
                      {item.hour.replace(' ', '')}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition whitespace-nowrap z-20">
                      {item.diners} diners {item.isPeak ? '🔥 Peak' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('menu')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5A1F] flex items-center justify-center flex-shrink-0">
                  <Plus size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Add Dish</span>
                  <span className="text-[10px] text-slate-400">Menu catalog</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Tag size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">New Offer</span>
                  <span className="text-[10px] text-slate-400">Stacked deals</span>
                </div>
              </button>
            </div>
          </div>

          {/* Live Activity Stream */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Diner Activity
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Table QR Scans</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {visits.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">
                        Table {v.tableNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        • {v.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{v.timestamp}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600">{v.paymentMethod}</span>
                      {v.coinsEarned > 0 && (
                        <span className="text-[#FF5A1F] font-bold">+{v.coinsEarned} coins</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">
                      ₹{v.amount.toLocaleString('en-IN')}
                    </div>
                    {v.discountApplied > 0 && (
                      <div className="text-[10px] font-bold text-emerald-600">
                        -₹{v.discountApplied}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
