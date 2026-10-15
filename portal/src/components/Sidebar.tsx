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
  ChevronDown,
} from 'lucide-react';
import { useRestaurant, NavTab } from '../context/RestaurantContext';
import { StoreStatus } from '../types';
import { SidebarCoffeeDoodle } from './Doodles';

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

  const navItems: { id: NavTab; label: string; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (active) => <LayoutGrid size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: (active) => <UtensilsCrossed size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'offers',
      label: 'Offers & Promos',
      icon: (active) => <Tag size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'tables',
      label: 'Table QR Standees',
      icon: (active) => <QrCode size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reviews',
      icon: (active) => <BarChart3 size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'settlement',
      label: '0% Settlements',
      icon: (active) => <Landmark size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: (active) => <Store size={18} color={active ? '#FF7A45' : '#94A3B8'} strokeWidth={active ? 2.3 : 1.9} />,
    },
  ];

  const statusOptions: { value: StoreStatus; label: string }[] = [
    { value: 'open', label: 'Open for Orders' },
    { value: 'busy', label: 'Busy / Rush Hour' },
    { value: 'closed', label: 'Store Closed' },
  ];

  return (
    <aside
      className="restrofe-sidebar"
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        backgroundColor: '#0F172A',
        borderRight: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        className="sidebar-header"
        style={{
          padding: '22px 20px 16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/icon.png"
            alt="Restrofe"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              objectFit: 'cover',
              flexShrink: 0,
              boxShadow: '0 3px 8px rgba(255, 90, 31, 0.28)',
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '17px', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Restrofe
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 90, 31, 0.15)',
                  color: '#FF7A45',
                  border: '1px solid rgba(255, 90, 31, 0.35)',
                  lineHeight: 1,
                }}
              >
                PORTAL
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: '3px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.name}
            </p>
          </div>
        </div>

        {/* Live Status Button Container */}
        <div style={{ position: 'relative', marginTop: '14px' }}>
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#F8FAFC',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="pulse-dot"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: storeStatus === 'open' ? '#10B981' : storeStatus === 'busy' ? '#F59E0B' : '#EF4444',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span>
                {storeStatus === 'open' ? 'Open for Orders' : storeStatus === 'busy' ? 'Busy / Rush' : 'Store Closed'}
              </span>
            </div>
            <ChevronDown size={13} color="#64748B" />
          </button>

          {/* Status Dropdown */}
          {isStatusMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '6px',
                width: '100%',
                backgroundColor: '#1E293B',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                border: '1px solid #334155',
                padding: '4px',
                zIndex: 50,
              }}
            >
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStoreStatus(opt.value);
                    setIsStatusMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#F1F5F9',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>{opt.label}</span>
                  {storeStatus === opt.value && <Check size={13} color="#FF7A45" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        <div
          className="sidebar-section-title"
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748B',
            padding: '16px 20px 6px 20px',
          }}
        >
          MAIN MENU
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                margin: '2px 14px',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : '#CBD5E1',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255, 90, 31, 0.22) 0%, rgba(255, 90, 31, 0.12) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(255, 90, 31, 0.35)' : '1px solid transparent',
                width: 'calc(100% - 28px)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#CBD5E1';
                }
              }}
            >
              {item.icon(isActive)}
              <span style={{ fontSize: '13.5px' }}>{item.label}</span>
            </button>
          );
        })}

        {/* Partner Tools */}
        <div
          className="sidebar-section-title"
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748B',
            padding: '20px 20px 6px 20px',
          }}
        >
          PARTNER TOOLS
        </div>

        <button
          onClick={triggerLiveVisit}
          className="sidebar-nav-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            margin: '2px 14px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#CBD5E1',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            width: 'calc(100% - 28px)',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#CBD5E1';
          }}
        >
          <ShieldCheck size={18} color="#94A3B8" strokeWidth={1.9} />
          <span style={{ fontSize: '13.5px' }}>Simulate Table Scan</span>
        </button>

        <button
          onClick={resetAllData}
          className="sidebar-nav-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            margin: '2px 14px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#CBD5E1',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
            width: 'calc(100% - 28px)',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#CBD5E1';
          }}
        >
          <RotateCcw size={18} color="#94A3B8" strokeWidth={1.9} />
          <span style={{ fontSize: '13.5px' }}>Reset Demo Catalog</span>
        </button>
      </nav>

      {/* Artisanal Coffee & Leaves Doodle Accent */}
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          marginBottom: '-6px',
        }}
      >
        <SidebarCoffeeDoodle color="#E2A96B" style={{ opacity: 0.85, maxHeight: '90px' }} />
      </div>

      {/* Bottom 0% Commission Card */}
      <div
        className="bottom-commission-card"
        style={{
          margin: '16px',
          padding: '14px 16px',
          borderRadius: '16px',
          backgroundColor: '#151D2C',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Percent size={12} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>
              0% Commission
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#34D399',
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            Active
          </span>
        </div>

        <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, margin: '8px 0 0 0', lineHeight: 1.4 }}>
          Direct peer-to-merchant UPI payouts.
        </p>

        <div
          style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
          }}
        >
          <span style={{ color: '#64748B', fontWeight: 500 }}>HDFC Settlement</span>
          <span style={{ color: '#FF7A45', fontWeight: 700 }}>24 Days Left</span>
        </div>
      </div>
    </aside>
  );
};
