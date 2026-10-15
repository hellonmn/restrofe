import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CreditCard,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const AccountView: React.FC = () => {
  const { profile, updateProfile } = useRestaurant();

  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [openingHours, setOpeningHours] = useState(profile.openingHours);
  const [fssaiNumber, setFssaiNumber] = useState(profile.fssaiNumber);
  const [gstin, setGstin] = useState(profile.gstin);
  const [upiVpa, setUpiVpa] = useState(profile.upiVpa);
  const [bankName, setBankName] = useState(profile.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(profile.bankDetails.accountNumber);
  const [ifsc, setIfsc] = useState(profile.bankDetails.ifsc);
  const [beneficiaryName, setBeneficiaryName] = useState(profile.bankDetails.beneficiaryName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      tagline,
      phone,
      email,
      address,
      city,
      openingHours,
      fssaiNumber,
      gstin,
      upiVpa,
      bankDetails: {
        bankName,
        accountNumber,
        ifsc,
        beneficiaryName,
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* Header Info Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#FF5A1F',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '22px',
              boxShadow: '0 3px 8px rgba(255, 90, 31, 0.28)',
              flexShrink: 0,
            }}
          >
            {name ? name.charAt(0) : 'R'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {name}
              </h2>
              <span
                style={{
                  fontSize: '10.5px',
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
                <CheckCircle2 size={11} /> FSSAI Verified
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, margin: '2px 0 0 0' }}>
              {tagline}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
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
          <Save size={15} />
          <span>Save Profile Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
        {/* Basic Store Info */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <Building2 size={17} color="#FF5A1F" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Restaurant Store Profile
            </h3>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              Tagline / Brand Bio
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                fontWeight: 500,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Primary Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              Street Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                City & State
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Operating Hours
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
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
          </div>
        </div>

        {/* Regulatory & Bank Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Statutory */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
              <ShieldCheck size={17} color="#15803D" />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Statutory & FSSAI Compliance
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  FSSAI License No.
                </label>
                <input
                  type="text"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  GSTIN Number
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Direct Settlement Details */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
              <CreditCard size={17} color="#FF5A1F" />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Direct Settlement Bank Account
              </h3>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Primary Merchant UPI VPA *
              </label>
              <input
                type="text"
                required
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  color: '#FF5A1F',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
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
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Beneficiary Entity Name
                </label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
