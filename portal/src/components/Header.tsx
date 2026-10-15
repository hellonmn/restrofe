import React from 'react';
import {
  Bell,
  ChevronDown,
  ArrowUpRight,
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
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px 18px 32px',
        backgroundColor: '#F8FAFC',
        flexShrink: 0,
      }}
    >
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.2 }}>
          {TITLES[activeTab].title}
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, margin: '4px 0 0 0' }}>
          {TITLES[activeTab].subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Live occupancy pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 16px',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            fontSize: '12.5px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 600, color: '#334155' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '9999px',
                backgroundColor: '#10B981',
                display: 'inline-block',
              }}
            />
            <span>{activeTablesCount} / {tables.length} Tables Active</span>
          </div>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <div style={{ fontWeight: 600, color: '#334155' }}>
            Today: <span style={{ color: '#FF5A1F', fontWeight: 800 }}>₹{todayRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Store Status Toggle Pill */}
        <div style={{ position: 'relative' }} className="group">
          <button
            onClick={() => setStoreStatus(storeStatus === 'open' ? 'busy' : storeStatus === 'busy' ? 'closed' : 'open')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: 700,
              backgroundColor: storeStatus === 'open' ? '#ECFDF5' : storeStatus === 'busy' ? '#FFFBEB' : '#FEF2F2',
              color: storeStatus === 'open' ? '#047857' : storeStatus === 'busy' ? '#B45309' : '#B91C1C',
              border: `1px solid ${storeStatus === 'open' ? '#A7F3D0' : storeStatus === 'busy' ? '#FDE68A' : '#FECACA'}`,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '9999px',
                backgroundColor: storeStatus === 'open' ? '#10B981' : storeStatus === 'busy' ? '#F59E0B' : '#EF4444',
                display: 'inline-block',
              }}
            />
            <span>{storeStatus === 'open' ? 'Accepting Orders' : storeStatus === 'busy' ? 'Rush Hour' : 'Closed'}</span>
            <ChevronDown size={13} style={{ opacity: 0.7 }} />
          </button>
        </div>

        {/* Notifications Bell */}
        <button
          title="Notifications"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '9px',
              right: '9px',
              width: '6px',
              height: '6px',
              backgroundColor: '#FF5A1F',
              borderRadius: '9999px',
            }}
          />
        </button>

        {/* Manager Avatar Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '9999px',
              backgroundColor: '#FFEDD5',
              border: '1px solid #FED7AA',
              color: '#EA580C',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            BH
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '2px', lineHeight: 1.1 }}>
              <span>Manager</span>
              <ArrowUpRight size={12} color="#FF5A1F" />
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.upiVpa || 'burgerhouse@hdf...'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
