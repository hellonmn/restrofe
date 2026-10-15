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
      label: 'Live Dashboard',
      icon: <LayoutDashboard size={19} />,
      badge: 'Live',
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: <UtensilsCrossed size={19} />,
    },
    {
      id: 'offers',
      label: 'Stacked Offers',
      icon: <Tag size={19} />,
      badge: '30%+20%',
    },
    {
      id: 'tables',
      label: 'Table QR Standees',
      icon: <QrCode size={19} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reviews',
      icon: <BarChart3 size={19} />,
    },
    {
      id: 'settlement',
      label: '0% Settlements',
      icon: <Landmark size={19} />,
      badge: '0% Fee',
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: <Building2 size={19} />,
    },
  ];

  return (
    <aside className="w-72 bg-[#0F1115] text-slate-300 flex flex-col h-screen border-r border-[#1F232D] select-none flex-shrink-0 sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1F232D]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF8A50] flex items-center justify-center shadow-lg shadow-[#FF5A1F]/30 text-white font-black text-xl">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">Restrofe</span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30">
                PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[170px]">
              {profile.name}
            </p>
          </div>
        </div>

        {/* Live Status Selector */}
        <div className="mt-4 p-2.5 rounded-xl bg-[#171A21] border border-[#242A36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                storeStatus === 'open'
                  ? 'bg-emerald-500 shadow-md shadow-emerald-500/50 pulse-dot'
                  : storeStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-semibold text-white capitalize">
              {storeStatus === 'open' ? 'Accepting Diners' : storeStatus === 'busy' ? 'High Rush Hour' : 'Store Closed'}
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setStoreStatus(storeStatus === 'open' ? 'busy' : storeStatus === 'busy' ? 'closed' : 'open')}
              className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-[#202530] hover:bg-[#2A3140] transition"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500">
          Management
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/25 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1D24]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-black/30 text-white'
                      : 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Simulator & Actions */}
        <div className="pt-5 px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500">
          Partner Tools
        </div>

        <button
          onClick={triggerLiveVisit}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 hover:bg-emerald-900/40 transition"
        >
          <Zap size={16} className="text-emerald-400" />
          <span>Simulate Table Visit</span>
        </button>

        <button
          onClick={resetAllData}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#1A1D24] transition mt-1"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Subscription Banner (Pitch deck Slide 08 & 10) */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#1C1F28] to-[#14161D] border border-[#2B313E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={14} className="text-[#FF5A1F]" />
          <span className="text-xs font-black text-white uppercase tracking-wider">
            1-Month Free Trial
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          <span className="text-emerald-400 font-bold">0% commission</span> forever on all table orders. 24 days remaining.
        </p>
        <div className="w-full bg-[#272D3B] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#FF5A1F] h-full w-[20%]" />
        </div>
        <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
          <span>Day 6 / 30</span>
          <span className="text-[#FF5A1F] font-bold">Free Forever</span>
        </div>
      </div>
    </aside>
  );
};
