import React, { useState } from 'react';
import {
  LayoutGrid,
  UtensilsCrossed,
  Tag,
  QrCode,
  BarChart3,
  Landmark,
  Store,
  ShieldCheck,
  RotateCcw,
  Percent,
  Check,
} from 'lucide-react';
import { useRestaurant, NavTab } from '../context/RestaurantContext';
import { StoreStatus } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    storeStatus,
    setStoreStatus,
    triggerLiveVisit,
    resetAllData,
  } = useRestaurant();

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutGrid size={18} strokeWidth={2} />,
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: <UtensilsCrossed size={18} strokeWidth={2} />,
    },
    {
      id: 'offers',
      label: 'Offers & Promos',
      icon: <Tag size={18} strokeWidth={2} />,
    },
    {
      id: 'tables',
      label: 'Table QR Standees',
      icon: <QrCode size={18} strokeWidth={2} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reviews',
      icon: <BarChart3 size={18} strokeWidth={2} />,
    },
    {
      id: 'settlement',
      label: '0% Settlements',
      icon: <Landmark size={18} strokeWidth={2} />,
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: <Store size={18} strokeWidth={2} />,
    },
  ];

  const statusOptions: { value: StoreStatus; label: string }[] = [
    { value: 'open', label: 'Open for Orders' },
    { value: 'busy', label: 'Busy / Rush Hour' },
    { value: 'closed', label: 'Store Closed' },
  ];

  return (
    <aside className="w-[260px] min-w-[260px] max-w-[260px] bg-white text-slate-800 flex flex-col h-screen border-r border-slate-100 flex-shrink-0 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A1F] flex items-center justify-center text-white font-black text-xl shadow-xs flex-shrink-0">
            R
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Restrofe</span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-orange-50 text-[#FF5A1F] border border-orange-200">
                PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
              {profile.name}
            </p>
          </div>
        </div>

        {/* Live Status Row */}
        <div className="relative mt-3 pt-1">
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition group py-1"
          >
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                storeStatus === 'open'
                  ? 'bg-emerald-500 pulse-dot'
                  : storeStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="font-medium text-slate-800">
              {storeStatus === 'open' ? 'Open for Orders' : storeStatus === 'busy' ? 'Busy / Rush' : 'Store Closed'}
            </span>
          </button>

          {/* Quick status dropdown */}
          {isStatusMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStoreStatus(opt.value);
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>{opt.label}</span>
                  {storeStatus === opt.value && <Check size={13} className="text-[#FF5A1F]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        <div className="px-3 pt-3 pb-1 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          MAIN MENU
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#FFF2EB] text-[#FF5A1F] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={isActive ? 'text-[#FF5A1F]' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Partner Tools */}
        <div className="px-3 pt-5 pb-1 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          PARTNER TOOLS
        </div>

        <button
          onClick={triggerLiveVisit}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          <ShieldCheck size={18} strokeWidth={2} className="text-slate-500 flex-shrink-0" />
          <span className="truncate">Simulate Table Scan</span>
        </button>

        <button
          onClick={resetAllData}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          <RotateCcw size={18} strokeWidth={2} className="text-slate-500 flex-shrink-0" />
          <span className="truncate">Reset Demo Catalog</span>
        </button>
      </nav>

      {/* Bottom 0% Commission Card */}
      <div className="p-3 m-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Percent size={11} strokeWidth={3} />
            </div>
            <span className="text-xs font-bold text-slate-900">0% Commission</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug font-medium">
          Direct peer-to-merchant UPI payouts.
        </p>
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium">HDFC Settlement</span>
          <span className="font-bold text-[#FF5A1F]">24 Days Left</span>
        </div>
      </div>
    </aside>
  );
};
