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

  const navItems: { id: NavTab; label: string; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (active) => <LayoutGrid size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'menu',
      label: 'Menu Catalog',
      icon: (active) => <UtensilsCrossed size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'offers',
      label: 'Offers & Promos',
      icon: (active) => <Tag size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'tables',
      label: 'Table QR Standees',
      icon: (active) => <QrCode size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reviews',
      icon: (active) => <BarChart3 size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'settlement',
      label: '0% Settlements',
      icon: (active) => <Landmark size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
    },
    {
      id: 'account',
      label: 'Store & Compliance',
      icon: (active) => <Store size={18} color={active ? '#FF5A1F' : '#64748B'} strokeWidth={active ? 2.3 : 1.9} />,
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
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
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
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#FF5A1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '20px',
              flexShrink: 0,
              boxShadow: '0 3px 8px rgba(255, 90, 31, 0.28)',
            }}
          >
            R
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '17px', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Restrofe
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  backgroundColor: '#FFF4EE',
                  color: '#FF5A1F',
                  border: '1px solid #FFE0D1',
                  lineHeight: 1,
                }}
              >
                PORTAL
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.name}
            </p>
          </div>
        </div>

        {/* Live Status Row */}
        <div style={{ position: 'relative', marginTop: '14px' }}>
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#1E293B',
              background: 'transparent',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
            }}
          >
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
          </button>

          {/* Status Dropdown */}
          {isStatusMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '6px',
                width: '180px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0',
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
                    color: '#334155',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>{opt.label}</span>
                  {storeStatus === opt.value && <Check size={13} color="#FF5A1F" />}
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
            color: '#94A3B8',
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
                color: isActive ? '#FF5A1F' : '#475569',
                backgroundColor: isActive ? '#FFF4EE' : 'transparent',
                border: 'none',
                width: 'calc(100% - 28px)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.color = '#0F172A';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#475569';
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
            color: '#94A3B8',
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
            color: '#475569',
            backgroundColor: 'transparent',
            border: 'none',
            width: 'calc(100% - 28px)',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <ShieldCheck size={18} color="#64748B" strokeWidth={1.9} />
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
            color: '#475569',
            backgroundColor: 'transparent',
            border: 'none',
            width: 'calc(100% - 28px)',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <RotateCcw size={18} color="#64748B" strokeWidth={1.9} />
          <span style={{ fontSize: '13.5px' }}>Reset Demo Catalog</span>
        </button>
      </nav>

      {/* Bottom 0% Commission Card */}
      <div
        className="bottom-commission-card"
        style={{
          margin: '16px',
          padding: '14px 16px',
          borderRadius: '16px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Percent size={12} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
              0% Commission
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#15803D',
              backgroundColor: '#DCFCE7',
              border: '1px solid #BBF7D0',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            Active
          </span>
        </div>

        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, margin: '8px 0 0 0', lineHeight: 1.4 }}>
          Direct peer-to-merchant UPI payouts.
        </p>

        <div
          style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
          }}
        >
          <span style={{ color: '#94A3B8', fontWeight: 500 }}>HDFC Settlement</span>
          <span style={{ color: '#FF5A1F', fontWeight: 700 }}>24 Days Left</span>
        </div>
      </div>
    </aside>
  );
};
