import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  QrCode,
  BarChart3,
  Landmark,
  Building2,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { useRestaurant, NavTab } from '../context/RestaurantContext';

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

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: <UtensilsCrossed size={18} />,
    },
    {
      id: 'offers',
      label: 'Offers & Promos',
      icon: <Tag size={18} />,
      badge: 'Stacked',
    },
    {
      id: 'tables',
      label: 'Table QR Standees',
      icon: <QrCode size={18} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reviews',
      icon: <BarChart3 size={18} />,
    },
    {
      id: 'settlement',
      label: '0% Settlements',
      icon: <Landmark size={18} />,
      badge: '0% Fee',
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: <Building2 size={18} />,
    },
  ];

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col h-screen border-r border-slate-200/80 flex-shrink-0 sticky top-0 z-30 select-none">
      {/* Brand & Restaurant Profile */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF5A1F] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">Restrofe</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-[#FF5A1F] border border-orange-200">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
              {profile.name}
            </p>
          </div>
        </div>

        {/* Live Status Pill & Quick Toggle */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                storeStatus === 'open'
                  ? 'bg-emerald-500 pulse-dot'
                  : storeStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-semibold text-slate-700 capitalize">
              {storeStatus === 'open' ? 'Open for Orders' : storeStatus === 'busy' ? 'Busy / Rush' : 'Store Closed'}
            </span>
          </div>

          <button
            onClick={() => setStoreStatus(storeStatus === 'open' ? 'busy' : storeStatus === 'busy' ? 'closed' : 'open')}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
          >
            Change
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          Main Menu
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#FF5A1F] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Partner Actions */}
        <div className="pt-5 px-3 pb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
          Partner Tools
        </div>

        <button
          onClick={triggerLiveVisit}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition"
        >
          <Zap size={15} className="text-[#FF5A1F]" />
          <span>Simulate Table Scan</span>
        </button>

        <button
          onClick={resetAllData}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Catalog</span>
        </button>
      </nav>

      {/* Trial / 0% Commission Badge */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 border border-orange-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles size={13} className="text-[#FF5A1F]" />
          <span className="text-xs font-extrabold text-slate-900">
            0% Commission Model
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Direct customer-to-bank settlements with zero platform cut.
        </p>
        <div className="mt-2.5 pt-2 border-t border-orange-200/60 flex items-center justify-between text-[10px] text-slate-600 font-semibold">
          <span>Free Forever</span>
          <span className="text-[#FF5A1F] font-bold">24 Days Trial Left</span>
        </div>
      </div>
    </aside>
  );
};
