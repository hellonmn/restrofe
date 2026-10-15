import React, { useState } from 'react';
import {
  Printer,
  Plus,
  Users,
  X,
  CreditCard,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { TableQR, TableSection } from '../../types';

export const TablesView: React.FC = () => {
  const {
    tables,
    profile,
    addTable,
    updateTableUPI,
    setSelectedStandeeTable,
  } = useRestaurant();

  const [filterSection, setFilterSection] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCapacity, setNewCapacity] = useState('4');
  const [newSection, setNewSection] = useState<TableSection>('Indoor Main');

  // Edit UPI modal
  const [editingTableUPI, setEditingTableUPI] = useState<TableQR | null>(null);
  const [customUPI, setCustomUPI] = useState('');

  const sections: (TableSection | 'All')[] = [
    'All',
    'Indoor Main',
    'Patio Garden',
    'Rooftop Terrace',
    'Bar Counter',
  ];

  const filteredTables = tables.filter(
    (t) => filterSection === 'All' || t.section === filterSection
  );

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    addTable(parseInt(newCapacity, 10) || 4, newSection);
    setIsAddModalOpen(false);
  };

  const handleSaveUPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTableUPI && customUPI.trim()) {
      updateTableUPI(editingTableUPI.tableNumber, customUPI.trim());
      setEditingTableUPI(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* Top Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Table QR Standees & Direct UPI Routing
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#ECFDF5',
                border: '1px solid #BBF7D0',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              {tables.length} Tables Active
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 500, margin: 0, maxWidth: '640px' }}>
            Each table has a dedicated QR code mapped to your store's merchant UPI (<strong style={{ color: '#0F172A' }}>{profile.upiVpa}</strong>). Diners scan to view your live menu and pay directly.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '12.5px',
            fontWeight: 700,
            backgroundColor: '#FF5A1F',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(255, 90, 31, 0.25)',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E44912')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF5A1F')}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Section Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {sections.map((sec) => {
          const count = sec === 'All' ? tables.length : tables.filter((t) => t.section === sec).length;
          const isActive = filterSection === sec;
          return (
            <button
              key={sec}
              onClick={() => setFilterSection(sec)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: `1px solid ${isActive ? '#FFD8C7' : '#E2E8F0'}`,
                backgroundColor: isActive ? '#FFF4EE' : '#FFFFFF',
                color: isActive ? '#FF5A1F' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{sec}</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#FFD8C7' : '#F1F5F9',
                  color: isActive ? '#C2410C' : '#64748B',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tables Cards Grid: 4 columns on large screens */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredTables.map((table) => {
          const isVacant = table.status === 'vacant';
          const isSeated = table.status === 'seated';
          const isPending = table.status === 'bill_pending';
          const isPaid = table.status === 'paid_verified';

          const statusColor = isPaid
            ? { bg: '#ECFDF5', text: '#15803D', border: '#BBF7D0', label: 'Paid Verified' }
            : isPending
            ? { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', label: 'Bill Pending' }
            : isSeated
            ? { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', label: 'Seated' }
            : { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', label: 'Vacant' };

          return (
            <div
              key={table.tableNumber}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                        Table {table.tableNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '6px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Users size={11} /> {table.capacity}p
                      </span>
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#94A3B8', marginTop: '2px', display: 'block' }}>
                      {table.section}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                      border: `1px solid ${statusColor.border}`,
                    }}
                  >
                    {statusColor.label}
                  </span>
                </div>

                {/* Status & Bill Details */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Occupancy:</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>
                      {isVacant ? 'Empty' : `${table.activeGuests || table.capacity} Guests`}
                    </span>
                  </div>

                  {!isVacant && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Running Bill:</span>
                      <span style={{ fontWeight: 800, color: '#FF5A1F' }}>
                        ₹{table.currentBill || 0}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      paddingTop: '6px',
                      marginTop: '2px',
                      borderTop: '1px solid #E2E8F0',
                    }}
                  >
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>UPI VPA:</span>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        color: '#475569',
                        fontWeight: 700,
                        maxWidth: '130px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={table.upiVpa}
                    >
                      {table.upiVpa}
                    </span>
                  </div>
                </div>
              </div>

              {/* Standee Preview & Actions */}
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <button
                  onClick={() => setSelectedStandeeTable(table)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
                >
                  <Printer size={13} />
                  <span>Print Standee</span>
                </button>

                <button
                  onClick={() => {
                    setEditingTableUPI(table);
                    setCustomUPI(table.upiVpa);
                  }}
                  title="Configure Table UPI"
                  style={{
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <CreditCard size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Add New Table
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTable} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Dining Section
                </label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value as TableSection)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Indoor Main">Indoor Main</option>
                  <option value="Patio Garden">Patio Garden</option>
                  <option value="Rooftop Terrace">Rooftop Terrace</option>
                  <option value="Bar Counter">Bar Counter</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Guest Capacity (persons)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  placeholder="4"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    backgroundColor: '#FF5A1F',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(255, 90, 31, 0.25)',
                  }}
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table UPI Modal */}
      {editingTableUPI && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '440px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Configure UPI for Table {editingTableUPI.tableNumber}
              </h3>
              <button
                onClick={() => setEditingTableUPI(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUPI} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Merchant UPI VPA ID *
                </label>
                <input
                  type="text"
                  required
                  value={customUPI}
                  onChange={(e) => setCustomUPI(e.target.value)}
                  placeholder="e.g. burgerhouse.table1@hdfcbank"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
                <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                  Diners scanning Table {editingTableUPI.tableNumber}'s QR standee will pay directly into this VPA.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEditingTableUPI(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    backgroundColor: '#FF5A1F',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(255, 90, 31, 0.25)',
                  }}
                >
                  Save UPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
