import React from 'react';
import {
  Bell,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useRestaurant, NavTab } from '../context/RestaurantContext';

const TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Restaurant Operations Dashboard',
    subtitle: 'Real-time table visits, QR UPI settlements & revenue overview',
  },
  menu: {
    title: 'Menu Catalog & Stock Control',
    subtitle: 'Live prices, preparation times, categories and instant 86/sold-out toggles',
  },
  offers: {
    title: 'Stacked Offers & Promotions',
    subtitle: 'Configure Restrofe stacked discounts (Store % + Coin Boost) and happy hours',
  },
  tables: {
    title: 'Table QR Standees & UPI Routing',
    subtitle: 'Generate and print table-specific standees mapped to your direct UPI VPA',
  },
  analytics: {
    title: 'Guest Analytics & Verified Reviews',
    subtitle: 'Peak hours traffic, revenue trends and diner review manager replies',
  },
  settlement: {
    title: '0% Commission & Settlements',
    subtitle: 'Direct customer-to-merchant UPI bank settlements with zero platform cut',
  },
  account: {
    title: 'Restaurant Profile & Compliance',
    subtitle: 'FSSAI license, GSTIN, operating hours and merchant settings',
  },
};

export const Header: React.FC = () => {
  const { activeTab, profile, storeStatus, setStoreStatus, tables, visits } = useRestaurant();

  const activeTablesCount = tables.filter((t) => t.status !== 'vacant').length;
  const todayRevenue = visits.reduce((acc, v) => acc + v.amount, 0);

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Section context */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {TITLES[activeTab].title}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {TITLES[activeTab].subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Live table occupancy pill */}
        <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span>{activeTablesCount} / {tables.length} Tables Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="font-semibold text-slate-700">
            Today: <span className="text-[#FF5A1F] font-bold">₹{todayRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Store Status Dropdown */}
        <div className="relative group">
          <button className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
            storeStatus === 'open'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : storeStatus === 'busy'
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              storeStatus === 'open' ? 'bg-emerald-500' : storeStatus === 'busy' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <span className="capitalize">{storeStatus === 'open' ? 'Open for Dine-In' : storeStatus === 'busy' ? 'High Rush' : 'Store Closed'}</span>
            <ChevronDown size={14} className="opacity-60" />
          </button>

          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 hidden group-hover:block z-30">
            <button
              onClick={() => setStoreStatus('open')}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Open for Dine-In</span>
            </button>
            <button
              onClick={() => setStoreStatus('busy')}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Rush / Busy</span>
            </button>
            <button
              onClick={() => setStoreStatus('closed')}
              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Closed for Day</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <button
          title="Notifications"
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition relative"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5A1F] rounded-full" />
        </button>

        {/* Restaurant Manager Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2EC] border border-[#FF5A1F]/30 flex items-center justify-center font-bold text-[#FF5A1F]">
            BH
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>Manager</span>
              <Sparkles size={12} className="text-[#FF5A1F]" />
            </div>
            <div className="text-[11px] text-slate-400 font-medium truncate max-w-[110px]">
              {profile.upiVpa}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
