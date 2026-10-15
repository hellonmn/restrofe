import React from 'react';
import {
  TrendingUp,
  Users,
  IndianRupee,
  Coins,
  ShieldCheck,
  Plus,
  QrCode,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { HOURLY_TRAFFIC } from '../../data/mockData';

export const DashboardView: React.FC = () => {
  const {
    tables,
    visits,
    offers,
    menuItems,
    setActiveTab,
    setSelectedStandeeTable,
    updateTableStatus,
  } = useRestaurant();

  const todayRevenue = visits.reduce((acc, v) => acc + v.amount, 0);
  const totalDiscounts = visits.reduce((acc, v) => acc + v.discountApplied, 0);
  const activeTables = tables.filter((t) => t.status !== 'vacant');
  const avgBill = visits.length ? Math.round(todayRevenue / visits.length) : 0;
  // If this restaurant were on typical aggregators charging 20-25% commission:
  const commissionSaved = Math.round(todayRevenue * 0.22);

  return (
    <div className="space-y-8 pb-12">
      {/* Pitch Deck Banner Highlight: 0% Commission & Direct Settlement */}
      <div className="bg-gradient-to-r from-slate-950 via-[#1C1F28] to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FF5A1F]/20 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                0% Commission Model
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles size={13} className="text-[#FF5A1F]" /> Pitch Deck Slide 08
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Direct Diners. Zero Commission. Instant UPI Payouts.
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Customers scan your table QR, view your live menu, unlock stacked promotions, and pay directly to your merchant UPI. You save <span className="text-emerald-400 font-bold">₹{commissionSaved.toLocaleString('en-IN')}</span> today in platform deductions.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setActiveTab('tables')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-lg shadow-[#FF5A1F]/30 transition"
            >
              <QrCode size={16} />
              <span>Print Table Standees</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition"
            >
              <Tag size={16} />
              <span>Create Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's QR Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +18.4%
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% directly credited to Bank</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Tables
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTables.length} / {tables.length}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {Math.round((activeTables.length / tables.length) * 100)}% Occ.
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock size={14} className="text-indigo-600" />
            <span>{tables.filter((t) => t.status === 'bill_pending').length} bills waiting payment</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Check
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{avgBill.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-[#FF5A1F] bg-orange-50 px-1.5 py-0.5 rounded">
              +₹140 vs avg
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Boosted by stacked coin offers</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Aggregator Savings
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{commissionSaved.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              0% Taken
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Discounts passed: ₹{totalDiscounts}</span>
          </div>
        </div>
      </div>

      {/* Main Floor Grid & Live Visits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Live Table Floor Matrix (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Floor Plan & Table QR Status
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Click any table to view QR standee, update occupancy or verify payment
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tables')}
              className="text-xs font-bold text-[#FF5A1F] hover:underline"
            >
              Manage All Tables →
            </button>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {tables.map((table) => {
              const isOccupied = table.status !== 'vacant';
              return (
                <div
                  key={table.tableNumber}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    table.status === 'vacant'
                      ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      : table.status === 'seated'
                      ? 'bg-blue-50/40 border-blue-200'
                      : table.status === 'bill_pending'
                      ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                      : 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900 text-sm">
                          T-{table.tableNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          ({table.capacity}p)
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 block truncate">
                        {table.section}
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

                  <div className="my-2">
                    {isOccupied ? (
                      <div>
                        <div className="text-[11px] font-bold text-slate-700">
                          ₹{table.currentBill || 0}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {table.lastScannedTime || 'Active'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Available</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-1 border-t border-slate-200/60">
                    <button
                      onClick={() => setSelectedStandeeTable(table)}
                      title="Print Standee"
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white transition"
                    >
                      <QrCode size={13} />
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
                      className="text-[10px] font-bold text-slate-600 hover:text-[#FF5A1F] ml-auto px-1.5 py-0.5 rounded hover:bg-white"
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

          {/* Hourly Traffic Bar Chart */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Peak Dining Hours Heatmap
              </span>
              <span className="text-xs text-slate-500">
                Peak rush: <strong className="text-slate-800">7:30 PM - 9:45 PM</strong>
              </span>
            </div>

            <div className="flex items-end gap-2 h-28 pt-4">
              {HOURLY_TRAFFIC.map((item) => {
                const max = 86;
                const heightPct = Math.round((item.diners / max) * 100);
                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <div className="w-full bg-slate-100 rounded-t-md h-20 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-sm transition-all group-hover:opacity-80 ${
                          item.isPeak
                            ? 'bg-gradient-to-t from-[#FF5A1F] to-[#FF8A50]'
                            : 'bg-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-800">
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

        {/* Right Column: Live Diners Feed & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Quick Admin Controls
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('menu')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mb-2">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-800">Add Menu Item</span>
                <span className="text-[10px] text-slate-400 font-medium">{menuItems.length} active items</span>
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <Tag size={16} />
                </div>
                <span className="text-xs font-extrabold text-slate-800">New Promotion</span>
                <span className="text-[10px] text-slate-400 font-medium">{offers.filter(o => o.isActive).length} live deals</span>
              </button>
            </div>
          </div>

          {/* Real-Time Visit Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Live Activity Feed
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Direct QR Scans</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {visits.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800">Table {v.tableNumber}</span>
                      <span className="text-[10px] font-semibold text-slate-500">• {v.customerName}</span>
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
                    <div className="text-xs font-black text-slate-900">
                      ₹{v.amount.toLocaleString('en-IN')}
                    </div>
                    {v.discountApplied > 0 && (
                      <div className="text-[10px] font-bold text-emerald-600">
                        -₹{v.discountApplied} off
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
