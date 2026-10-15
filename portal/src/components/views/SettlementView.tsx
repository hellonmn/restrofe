import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
  Landmark,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const SettlementView: React.FC = () => {
  const { profile, visits } = useRestaurant();

  const totalQrVolume = visits.reduce((acc, v) => acc + v.amount, 0);
  const aggregatorCutAvoided = Math.round(totalQrVolume * 0.22); // 22% typical aggregator commission

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Transaction ID,Table,Customer,Amount,Discount,Method,Timestamp']
        .concat(
          visits.map(
            (v) =>
              `${v.id},Table ${v.tableNumber},${v.customerName},${v.amount},${v.discountApplied},${v.paymentMethod},${v.timestamp}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Restrofe_Settlements_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* Clean White Header Card */}
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
              Direct UPI Settlements & 0% Commission
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
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={11} /> 0% Platform Fee
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 500, margin: 0, maxWidth: '640px' }}>
            Customer payments bypass intermediary hold periods and settle directly into your linked bank account (<strong style={{ color: '#0F172A' }}>{profile.bankDetails.bankName}</strong>).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '12.5px',
            fontWeight: 700,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
        >
          <Download size={14} />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Trial Status & Bank Account Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)', gap: '16px' }}>
        {/* Trial Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Partner Plan
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FFF4EE',
                color: '#FF5A1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={17} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', display: 'block' }}>
              {profile.subscription.trialDaysLeft} Days Left
            </span>
            <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '3px' }}>
              1-Month Free Trial active till {profile.subscription.validTill}
            </span>
          </div>
          <div
            style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #F1F5F9',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={14} color="#15803D" />
            <span>0% Commission guaranteed on table orders</span>
          </div>
        </div>

        {/* Bank Account */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={17} color="#FF5A1F" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Linked Bank & Merchant Routing
              </span>
            </div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#ECFDF5',
                color: '#15803D',
                border: '1px solid #BBF7D0',
              }}
            >
              Active for Direct Payouts
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginTop: '16px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                Bank Name
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px', display: 'block' }}>
                {profile.bankDetails.bankName}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                Account No
              </span>
              <span style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', marginTop: '2px', display: 'block' }}>
                {profile.bankDetails.accountNumber}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                IFSC Code
              </span>
              <span style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', marginTop: '2px', display: 'block' }}>
                {profile.bankDetails.ifsc}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                Primary UPI
              </span>
              <span style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 800, color: '#FF5A1F', marginTop: '2px', display: 'block' }}>
                {profile.upiVpa}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Settlements Ledger */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Settlement Activity Ledger
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, margin: '2px 0 0 0' }}>
              Direct table QR transactions settled immediately into your merchant account
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#15803D',
              backgroundColor: '#ECFDF5',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid #BBF7D0',
            }}
          >
            ₹{aggregatorCutAvoided} Aggregator Fee Saved
          </span>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '12px' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Ref / ID</th>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Table</th>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Customer</th>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Bill Total</th>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Platform Cut</th>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Net Payout</th>
                <th style={{ padding: '12px 10px', fontWeight: 800 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr
                  key={v.id}
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                    {v.id}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#0F172A' }}>
                    Table {v.tableNumber}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#475569', fontWeight: 500 }}>
                    {v.customerName}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#0F172A' }}>
                    ₹{v.amount}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#16A34A' }}>
                    ₹0 (0%)
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 900, color: '#0F172A' }}>
                    ₹{v.amount}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: '#ECFDF5',
                        color: '#15803D',
                        border: '1px solid #BBF7D0',
                      }}
                    >
                      <CheckCircle2 size={11} /> Instant UPI
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
