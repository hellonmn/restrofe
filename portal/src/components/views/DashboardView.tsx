import React, { useState } from 'react';
import {
  Users,
  IndianRupee,
  QrCode,
  ArrowUpRight,
  Plus,
  Percent,
  TrendingUp,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  Home,
  Sun,
  Wine,
  Umbrella,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  TableDoodleRenderer,
  CoffeeSproutDoodle,
  CoffeeBeansPairDoodle,
  DiningTableIconBadge,
} from '../Doodles';

export const DashboardView: React.FC = () => {
  const {
    tables,
    visits,
    setActiveTab,
    setSelectedStandeeTable,
    updateTableStatus,
  } = useRestaurant();

  const [selectedSection, setSelectedSection] = useState<string>('Indoor Main');

  const todayRevenue = visits.reduce((acc, v) => acc + v.amount, 0);
  const avgBill = visits.length ? Math.round(todayRevenue / visits.length) : 0;
  const commissionSaved = Math.round(todayRevenue * 0.22); // 22% typical aggregator commission

  const sections = ['Indoor Main', 'Patio Garden', 'Rooftop Terrace', 'Bar Counter'];

  // 12 tables mapped directly for floor plan
  const sampleTables = [
    { tableNumber: 1, name: 'T-1', capacity: 2, section: 'Indoor Main', status: 'vacant', amount: 0, timeAgo: '' },
    { tableNumber: 2, name: 'T-2', capacity: 4, section: 'Indoor Main', status: 'occupied', amount: 890, timeAgo: '12m ago' },
    { tableNumber: 3, name: 'T-3', capacity: 4, section: 'Indoor Main', status: 'bill_pending', amount: 1420, timeAgo: '3m ago' },
    { tableNumber: 4, name: 'T-4', capacity: 6, section: 'Rooftop Terrace', status: 'occupied', amount: 2150, timeAgo: 'Just now' },
    { tableNumber: 5, name: 'T-5', capacity: 2, section: 'Patio Garden', status: 'vacant', amount: 0, timeAgo: '' },
    { tableNumber: 6, name: 'T-6', capacity: 4, section: 'Patio Garden', status: 'occupied', amount: 640, timeAgo: '18m ago' },
    { tableNumber: 7, name: 'T-7', capacity: 4, section: 'Patio Garden', status: 'vacant', amount: 0, timeAgo: '' },
    { tableNumber: 8, name: 'T-8', capacity: 6, section: 'Rooftop Terrace', status: 'occupied', amount: 2890, timeAgo: '5m ago' },
    { tableNumber: 9, name: 'T-9', capacity: 6, section: 'Rooftop Terrace', status: 'vacant', amount: 0, timeAgo: '' },
    { tableNumber: 10, name: 'T-10', capacity: 2, section: 'Bar Counter', status: 'vacant', amount: 0, timeAgo: '' },
    { tableNumber: 11, name: 'T-11', capacity: 2, section: 'Bar Counter', status: 'occupied', amount: 410, timeAgo: '8m ago' },
    { tableNumber: 12, name: 'T-12', capacity: 2, section: 'Bar Counter', status: 'vacant', amount: 0, timeAgo: '' },
  ];

  const dinerActivity = [
    { table: 'Table 4', diner: 'Aarav Mehta', time: '12m ago', method: 'UPI • +20 coins', amount: 2150 },
    { table: 'Table 8', diner: 'Priya Sharma & Friends', time: '5 mins ago', method: 'Direct QR', amount: 2890 },
    { table: 'Table 3', diner: 'Karan Verma', time: '14 mins ago', method: 'Restrofe Wallet • +40 coins', amount: 1420 },
    { table: 'Table 6', diner: 'Sneha Patil', time: '28 mins ago', method: 'UPI • +8 coins', amount: 980 },
    { table: 'Table 1', diner: 'Rohan Nambiar', time: '42 mins ago', method: 'UPI • +40 coins', amount: 1120 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
        {/* Metric 1: Today's Revenue */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              <IndianRupee size={18} strokeWidth={2.5} />
            </div>
            {/* Delicate Coffee Sprout Doodle */}
            <div title="Artisanal Cafe Metric Accent" style={{ pointerEvents: 'none' }}>
              <CoffeeSproutDoodle size={28} color="#10B981" />
            </div>
          </div>
          <div style={{ marginTop: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              TODAY'S REVENUE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                ₹{todayRevenue ? todayRevenue.toLocaleString('en-IN') : '8,560'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#10B981',
                  backgroundColor: '#ECFDF5',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <ArrowUpRight size={11} /> 18.4%
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, margin: '4px 0 0 0' }}>
              Directly settled via table UPI
            </p>
          </div>

          {/* Sparkline wave */}
          <svg width="56" height="22" viewBox="0 0 56 22" fill="none" style={{ position: 'absolute', bottom: '12px', right: '16px', opacity: 0.85, pointerEvents: 'none' }}>
            <path d="M2 18C12 16 18 6 30 12C42 18 48 6 54 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Metric 2: Table Occupancy */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} strokeWidth={2.3} />
            </div>
            <Users size={16} color="#3B82F6" style={{ opacity: 0.8 }} />
          </div>
          <div style={{ marginTop: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              TABLE OCCUPANCY
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                6 <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 500 }}>/ 12</span>
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#3B82F6',
                  backgroundColor: '#EFF6FF',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                50% Full
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, margin: '4px 0 0 0' }}>
              1 bills waiting payment
            </p>
          </div>

          {/* Occupancy mini bars */}
          <div style={{ position: 'absolute', bottom: '14px', right: '16px', display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px', opacity: 0.85, pointerEvents: 'none' }}>
            <div style={{ width: '4px', height: '7px', backgroundColor: '#BFDBFE', borderRadius: '1.5px' }} />
            <div style={{ width: '4px', height: '12px', backgroundColor: '#93C5FD', borderRadius: '1.5px' }} />
            <div style={{ width: '4px', height: '9px', backgroundColor: '#BFDBFE', borderRadius: '1.5px' }} />
            <div style={{ width: '4px', height: '18px', backgroundColor: '#60A5FA', borderRadius: '1.5px' }} />
            <div style={{ width: '4px', height: '14px', backgroundColor: '#3B82F6', borderRadius: '1.5px' }} />
            <div style={{ width: '4px', height: '22px', backgroundColor: '#2563EB', borderRadius: '1.5px' }} />
          </div>
        </div>

        {/* Metric 3: Average Table Bill */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#FFF7ED',
                color: '#FF5A1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} strokeWidth={2.5} />
            </div>
            <TrendingUp size={16} color="#FF5A1F" style={{ opacity: 0.8 }} />
          </div>
          <div style={{ marginTop: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              AVERAGE TABLE BILL
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                ₹{avgBill ? avgBill.toLocaleString('en-IN') : '1,712'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#FF5A1F',
                  backgroundColor: '#FFF7ED',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                +₹140 vs avg
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, margin: '4px 0 0 0' }}>
              Driven by stacked coin offers
            </p>
          </div>

          {/* Sparkline wave */}
          <svg width="56" height="22" viewBox="0 0 56 22" fill="none" style={{ position: 'absolute', bottom: '12px', right: '16px', opacity: 0.85, pointerEvents: 'none' }}>
            <path d="M2 17C12 15 20 20 32 10C42 2 48 12 54 7" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Metric 4: Commission Saved */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#F5F3FF',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={18} strokeWidth={2.3} />
            </div>
            {/* Delicate Coffee Beans Pair Doodle */}
            <div title="Restrofe Zero Commission Boost" style={{ pointerEvents: 'none' }}>
              <CoffeeBeansPairDoodle size={28} color="#8B5CF6" />
            </div>
          </div>
          <div style={{ marginTop: '14px', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              COMMISSION SAVED
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                ₹{commissionSaved ? commissionSaved.toLocaleString('en-IN') : '1,883'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#10B981',
                  backgroundColor: '#ECFDF5',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                0% Fee
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, margin: '4px 0 0 0' }}>
              Saved vs 22% aggregator cuts
            </p>
          </div>

          {/* Sparkline wave */}
          <svg width="56" height="22" viewBox="0 0 56 22" fill="none" style={{ position: 'absolute', bottom: '12px', right: '16px', opacity: 0.85, pointerEvents: 'none' }}>
            <path d="M2 19C14 17 24 8 36 14C46 19 50 7 54 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Main Split: Left Floor Plan & Rush Hours (1.85fr) + Right Quick Actions & Diner Activity (1fr) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Table Floor Plan */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FED7AA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DiningTableIconBadge size={22} color="#9A3412" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Live Table Floor Plan
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: '2px 0 0 0' }}>
                    Tap table actions to update dining status or print QR standee
                  </p>
                </div>
              </div>

              {/* Area filter tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {sections.map((sec) => {
                  const isActive = selectedSection === sec;
                  const secIcon =
                    sec === 'Indoor Main' ? (
                      <Home size={12} color={isActive ? '#FF5A1F' : '#94A3B8'} />
                    ) : sec === 'Patio Garden' ? (
                      <Umbrella size={12} color={isActive ? '#FF5A1F' : '#94A3B8'} />
                    ) : sec === 'Rooftop Terrace' ? (
                      <Sun size={12} color={isActive ? '#FF5A1F' : '#94A3B8'} />
                    ) : (
                      <Wine size={12} color={isActive ? '#FF5A1F' : '#94A3B8'} />
                    );
                  return (
                    <button
                      key={sec}
                      onClick={() => setSelectedSection(sec)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: isActive ? 700 : 500,
                        backgroundColor: isActive ? '#FFF4EE' : '#F8FAFC',
                        color: isActive ? '#FF5A1F' : '#64748B',
                        border: `1px solid ${isActive ? '#FFD8C7' : '#E2E8F0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {secIcon}
                      <span>{sec}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 12 Tables Grid: 4 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginTop: '16px' }}>
              {sampleTables.map((t) => {
                const isVacant = t.status === 'vacant';
                const isOccupied = t.status === 'occupied';
                const isPending = t.status === 'bill_pending';

                const borderColor = isOccupied ? '#86EFAC' : isPending ? '#FDE68A' : '#E2E8F0';
                const bgColor = isOccupied ? '#F0FDF4' : isPending ? '#FFFBEB' : '#FFFFFF';
                const dotColor = isOccupied ? '#10B981' : isPending ? '#F59E0B' : '#94A3B8';

                return (
                  <div
                    key={t.tableNumber}
                    style={{
                      borderRadius: '12px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '94px',
                      position: 'relative',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '9999px',
                                backgroundColor: dotColor,
                                display: 'inline-block',
                              }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                              {t.name} <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 500 }}>({t.capacity}p)</span>
                            </span>
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>
                            {t.section}
                          </div>
                        </div>

                        {/* Top-Right Dining Table Doodle */}
                        <div style={{ marginTop: '-4px', marginRight: '-4px', pointerEvents: 'none' }}>
                          <TableDoodleRenderer
                            tableNumber={t.tableNumber}
                            section={t.section}
                            capacity={t.capacity}
                            size={34}
                            color={isOccupied ? '#059669' : isPending ? '#D97706' : '#94A3B8'}
                            opacity={isVacant ? 0.65 : 0.85}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '6px' }}>
                      {isVacant ? (
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                          Vacant
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                            ₹{t.amount}
                          </div>
                          <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                            {t.timeAgo}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom QR and Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <button
                        onClick={() => {
                          const realTable = tables.find((x) => x.tableNumber === t.tableNumber) || tables[0];
                          if (realTable) setSelectedStandeeTable(realTable);
                        }}
                        title="Print Table QR"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <QrCode size={13} />
                      </button>

                      {isVacant ? (
                        <button
                          onClick={() => {
                            updateTableStatus(t.tableNumber, 'seated');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: '#FF5A1F',
                          }}
                        >
                          Seat
                        </button>
                      ) : isOccupied ? (
                        <button
                          onClick={() => {
                            updateTableStatus(t.tableNumber, 'bill_pending');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: t.tableNumber === 2 || t.tableNumber === 4 ? '#10B981' : '#FF5A1F',
                          }}
                        >
                          {t.tableNumber === 2 || t.tableNumber === 4 ? 'Free' : 'Bill'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateTableStatus(t.tableNumber, 'vacant');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: '#FF5A1F',
                          }}
                        >
                          Paid
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dining Rush Hours */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '18px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#0F172A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                DINING RUSH HOURS
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                Peak: <span style={{ color: '#0F172A' }}>7:30 PM – 9:45 PM</span>
              </span>
            </div>

            {/* Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', gap: '8px', padding: '0 8px' }}>
              {[
                { time: '11AM', h: 18, isPeak: false },
                { time: '12PM', h: 36, isPeak: false },
                { time: '1PM', h: 68, isPeak: true },
                { time: '2PM', h: 54, isPeak: true },
                { time: '3PM', h: 28, isPeak: false },
                { time: '4PM', h: 22, isPeak: false },
                { time: '5PM', h: 40, isPeak: false },
                { time: '6PM', h: 58, isPeak: false },
                { time: '7PM', h: 84, isPeak: true },
                { time: '8PM', h: 96, isPeak: true },
                { time: '9PM', h: 78, isPeak: true },
                { time: '10PM', h: 42, isPeak: false },
                { time: '11PM', h: 20, isPeak: false },
              ].map((bar, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${bar.h}px`,
                      backgroundColor: bar.isPeak ? '#FF5A1F' : '#E2E8F0',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', marginTop: '6px' }}>
                    {bar.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions + Live Diner Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Actions */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
              QUICK ACTIONS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('menu')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: '#FFF7ED',
                  border: '1px solid #FFEDD5',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'transform 0.1s ease',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#FF5A1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(255,90,31,0.1)',
                  }}
                >
                  <Plus size={18} strokeWidth={2.8} />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                    Add Dish
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
                    New catalog item
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: '#FAF5FF',
                  border: '1px solid #F3E8FF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'transform 0.1s ease',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(139,92,246,0.1)',
                  }}
                >
                  <Percent size={15} strokeWidth={2.8} />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                    New Offer
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
                    Stacked deals
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Live Diner Activity */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '9999px',
                    backgroundColor: '#FF5A1F',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#0F172A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  LIVE DINER ACTIVITY
                </span>
              </div>
              <SlidersHorizontal size={14} color="#94A3B8" style={{ cursor: 'pointer' }} />
            </div>

            {/* Diner list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              {dinerActivity.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '9999px',
                        backgroundColor: '#3B82F6',
                        display: 'inline-block',
                        marginTop: '5px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
                        {item.table} <span style={{ color: '#94A3B8', fontWeight: 400 }}>•</span> {item.diner}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>
                        {item.time} <span style={{ color: '#CBD5E1' }}>•</span> {item.method}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A' }}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                    <ChevronRight size={13} color="#94A3B8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
