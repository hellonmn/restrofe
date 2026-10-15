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
      icon: <LayoutGrid size={20} strokeWidth={2.2} />,
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: <UtensilsCrossed size={20} strokeWidth={1.8} />,
    },
    {
      id: 'offers',
      label: 'Offers & Promos',
      icon: <Tag size={20} strokeWidth={1.8} />,
    },
    {
      id: 'tables',
      label: 'Table QR Standees',
      icon: <QrCode size={20} strokeWidth={1.8} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reviews',
      icon: <BarChart3 size={20} strokeWidth={1.8} />,
    },
    {
      id: 'settlement',
      label: '0% Settlements',
      icon: <Landmark size={20} strokeWidth={1.8} />,
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: <Store size={20} strokeWidth={1.8} />,
    },
  ];

  const statusOptions: { value: StoreStatus; label: string }[] = [
    { value: 'open', label: 'Open for Orders' },
    { value: 'busy', label: 'Busy / Rush Hour' },
    { value: 'closed', label: 'Store Closed' },
  ];

  return (
    <aside className="w-72 min-w-[288px] max-w-[288px] bg-white text-slate-800 flex flex-col h-screen border-r border-slate-200/90 flex-shrink-0 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FF5A1F] flex items-center justify-center text-white font-black text-2xl shadow-xs flex-shrink-0">
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
        <div className="relative mt-3.5">
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition py-0.5 group"
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
            <span className="font-semibold text-slate-800">
              {storeStatus === 'open' ? 'Open for Orders' : storeStatus === 'busy' ? 'Busy / Rush' : 'Store Closed'}
            </span>
          </button>

          {/* Status dropdown */}
          {isStatusMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStoreStatus(opt.value);
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>{opt.label}</span>
                  {storeStatus === opt.value && <Check size={14} className="text-[#FF5A1F]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pt-3 pb-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          MAIN MENU
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all group ${
                isActive
                  ? 'bg-[#FFF4EE] text-[#FF5A1F] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <span className={isActive ? 'text-[#FF5A1F]' : 'text-slate-400 group-hover:text-slate-600'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Partner Tools */}
        <div className="px-3 pt-6 pb-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          PARTNER TOOLS
        </div>

        <button
          onClick={triggerLiveVisit}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition group"
        >
          <ShieldCheck size={20} strokeWidth={1.8} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
          <span className="truncate">Simulate Table Scan</span>
        </button>

        <button
          onClick={resetAllData}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition group"
        >
          <RotateCcw size={20} strokeWidth={1.8} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
          <span className="truncate">Reset Demo Catalog</span>
        </button>
      </nav>

      {/* Bottom 0% Commission Card */}
      <div className="p-4 m-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-100/70 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Percent size={12} strokeWidth={2.8} />
            </div>
            <span className="text-xs font-bold text-slate-900">0% Commission</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
            Active
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-snug font-medium">
          Direct peer-to-merchant UPI payouts.
        </p>
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">HDFC Settlement</span>
          <span className="font-bold text-[#FF5A1F]">24 Days Left</span>
        </div>
      </div>
    </aside>
  );
};
