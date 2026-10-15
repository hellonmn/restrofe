import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  QrCode,
  BarChart3,
  Landmark,
  Building2,
  Zap,
  RotateCcw,
  ChevronDown,
  Check,
  ShieldCheck,
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

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} strokeWidth={2} />,
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
      badge: 'Stacked',
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
      badge: '0% Fee',
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: <Building2 size={18} strokeWidth={2} />,
    },
  ];

  const statusOptions: { value: StoreStatus; label: string; desc: string; color: string }[] = [
    { value: 'open', label: 'Open for Orders', desc: 'Accepting table QR scans', color: 'bg-emerald-500' },
    { value: 'busy', label: 'High Rush Hour', desc: 'Kitchen operating at capacity', color: 'bg-amber-500' },
    { value: 'closed', label: 'Store Closed', desc: 'Not accepting diners right now', color: 'bg-rose-500' },
  ];

  return (
    <aside className="w-72 min-w-[288px] max-w-[288px] bg-white text-slate-800 flex flex-col h-screen border-r border-slate-200 flex-shrink-0 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF7A45] flex items-center justify-center text-white font-black text-xl shadow-sm flex-shrink-0">
            R
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Restrofe</span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5A1F] border border-orange-200">
                PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {profile.name}
            </p>
          </div>
        </div>

        {/* Store Live Status Selector */}
        <div className="relative mt-4">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  storeStatus === 'open'
                    ? 'bg-emerald-500 pulse-dot'
                    : storeStatus === 'busy'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-bold text-slate-800 truncate">
                {storeStatus === 'open' ? 'Open for Orders' : storeStatus === 'busy' ? 'High Rush' : 'Store Closed'}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition flex-shrink-0" />
          </button>

          {/* Status Dropdown */}
          {isStatusDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStoreStatus(opt.value);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-none">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{opt.desc}</div>
                    </div>
                  </div>
                  {storeStatus === opt.value && <Check size={14} className="text-[#FF5A1F]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Main Menu
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                isActive
                  ? 'bg-orange-50 text-[#FF5A1F] border border-orange-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={isActive ? 'text-[#FF5A1F]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    isActive
                      ? 'bg-white text-[#FF5A1F] border border-orange-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Partner Tools */}
        <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Partner Tools
        </div>

        <button
          onClick={triggerLiveVisit}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
        >
          <Zap size={15} className="text-[#FF5A1F] flex-shrink-0" />
          <span>Simulate Table Scan</span>
        </button>

        <button
          onClick={resetAllData}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition mt-1"
        >
          <RotateCcw size={14} className="flex-shrink-0" />
          <span>Reset Demo Catalog</span>
        </button>
      </nav>

      {/* Clean Bottom 0% Settlement Status Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-extrabold text-slate-900">
              0% Commission
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Direct peer-to-merchant UPI payouts.
        </p>
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
          <span>HDFC Settlement</span>
          <span className="text-[#FF5A1F] font-bold">24 Days Left</span>
        </div>
      </div>
    </aside>
  );
};
