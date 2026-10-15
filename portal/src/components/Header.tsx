import React from 'react';
import {
  Bell,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useRestaurant, NavTab } from '../context/RestaurantContext';

const TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Operations Dashboard',
    subtitle: 'Real-time overview of diner visits, table orders, and direct settlements',
  },
  menu: {
    title: 'Menu Management',
    subtitle: 'Control dish pricing, stock availability, preparation times, and dietary tags',
  },
  offers: {
    title: 'Offers & Promotions',
    subtitle: 'Configure Restrofe stacked discounts (Store discount + Restrofe coin boost)',
  },
  tables: {
    title: 'Table QR Standees',
    subtitle: 'Generate and print table-specific standees mapped to your direct merchant UPI',
  },
  analytics: {
    title: 'Guest Analytics & Reviews',
    subtitle: 'Monitor peak dining hours, customer retention, and reply to verified diner reviews',
  },
  settlement: {
    title: '0% Commission Settlements',
    subtitle: 'Track direct peer-to-merchant UPI bank settlements with zero platform cut',
  },
  account: {
    title: 'Store Profile & Compliance',
    subtitle: 'Manage FSSAI license, GSTIN, store address, and bank payout configuration',
  },
};

export const Header: React.FC = () => {
  const { activeTab, profile, storeStatus, setStoreStatus, tables, visits } = useRestaurant();

  const activeTablesCount = tables.filter((t) => t.status !== 'vacant').length;
  const todayRevenue = visits.reduce((acc, v) => acc + v.amount, 0);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
      {/* Title */}
      <div>
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
          {TITLES[activeTab].title}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {TITLES[activeTab].subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3.5">
        {/* Live occupancy pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span>{activeTablesCount} / {tables.length} Tables Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="font-semibold text-slate-700">
            Today: <span className="text-[#FF5A1F] font-bold">₹{todayRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Store Status Toggle Dropdown */}
        <div className="relative group">
          <button className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
            storeStatus === 'open'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : storeStatus === 'busy'
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              storeStatus === 'open' ? 'bg-emerald-500' : storeStatus === 'busy' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <span className="capitalize">{storeStatus === 'open' ? 'Accepting Orders' : storeStatus === 'busy' ? 'Rush Hour' : 'Closed'}</span>
            <ChevronDown size={13} className="opacity-60" />
          </button>

          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 hidden group-hover:block z-30">
            <button
              onClick={() => setStoreStatus('open')}
              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Accepting Orders</span>
            </button>
            <button
              onClick={() => setStoreStatus('busy')}
              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Rush Hour / Busy</span>
            </button>
            <button
              onClick={() => setStoreStatus('closed')}
              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Store Closed</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <button
          title="Notifications"
          className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition relative"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF5A1F] rounded-full" />
        </button>

        {/* Manager Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-xs text-[#FF5A1F]">
            BH
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1 leading-tight">
              <span>Manager</span>
              <Sparkles size={11} className="text-[#FF5A1F]" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
              {profile.upiVpa}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
