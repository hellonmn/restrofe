import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Calendar,
  X,
  Layers,
  Trash2,
  Edit2,
  Coins,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Offer, OfferType } from '../../types';

export const OffersView: React.FC = () => {
  const { offers, addOffer, updateOffer, deleteOffer, toggleOfferActive } = useRestaurant();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<OfferType>('stacked');
  const [formPercent, setFormPercent] = useState('30');
  const [formMaxDiscount, setFormMaxDiscount] = useState('300');
  const [formMinBill, setFormMinBill] = useState('699');
  const [formIsStacked, setFormIsStacked] = useState(true);
  const [formCoinBoost, setFormCoinBoost] = useState('20');
  const [formValidUntil, setFormValidUntil] = useState('31 Dec 2026');

  const openAddModal = () => {
    setEditingOffer(null);
    setFormCode('');
    setFormTitle('');
    setFormDescription('');
    setFormType('stacked');
    setFormPercent('30');
    setFormMaxDiscount('300');
    setFormMinBill('699');
    setFormIsStacked(true);
    setFormCoinBoost('20');
    setFormValidUntil('31 Dec 2026');
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setFormCode(offer.code);
    setFormTitle(offer.title);
    setFormDescription(offer.description);
    setFormType(offer.type);
    setFormPercent(String(offer.discountPercent));
    setFormMaxDiscount(offer.maxDiscount ? String(offer.maxDiscount) : '');
    setFormMinBill(String(offer.minBill));
    setFormIsStacked(offer.isStacked);
    setFormCoinBoost(offer.coinBoostPercent ? String(offer.coinBoostPercent) : '20');
    setFormValidUntil(offer.validUntil);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formTitle.trim()) return;

    const percentNum = parseFloat(formPercent) || 0;
    const maxNum = formMaxDiscount ? parseFloat(formMaxDiscount) : undefined;
    const minNum = parseFloat(formMinBill) || 0;
    const coinNum = formIsStacked ? parseFloat(formCoinBoost) || 20 : undefined;

    if (editingOffer) {
      updateOffer(editingOffer.id, {
        code: formCode.trim().toUpperCase(),
        title: formTitle.trim(),
        description: formDescription.trim(),
        type: formType,
        discountPercent: percentNum,
        maxDiscount: maxNum,
        minBill: minNum,
        isStacked: formIsStacked,
        coinBoostPercent: coinNum,
        validUntil: formValidUntil,
      });
    } else {
      addOffer({
        code: formCode.trim().toUpperCase(),
        title: formTitle.trim(),
        description: formDescription.trim(),
        type: formType,
        discountPercent: percentNum,
        maxDiscount: maxNum,
        minBill: minNum,
        isStacked: formIsStacked,
        coinBoostPercent: coinNum,
        validDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        validUntil: formValidUntil,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* Top Banner Card */}
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
              Promotions & Stacked Discounts
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#FF5A1F',
                backgroundColor: '#FFF4EE',
                border: '1px solid #FFE0D1',
                padding: '2px 8px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={11} color="#FF5A1F" /> High Conversion
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 500, margin: 0, maxWidth: '640px' }}>
            Combine your restaurant bill discounts with Restrofe Coins to boost table check size and drive repeat diner loyalty.
          </p>
        </div>

        <button
          onClick={openAddModal}
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
          <span>Create Promotion</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
        {offers.map((offer) => (
          <div
            key={offer.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: offer.isActive ? 1 : 0.65,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Header row: Code & Badges */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '12px',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {offer.code}
                    </span>
                    {offer.isStacked && (
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: '#FF5A1F',
                          backgroundColor: '#FFF4EE',
                          border: '1px solid #FFE0D1',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        <Layers size={11} color="#FF5A1F" /> +{offer.coinBoostPercent}% Coins
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {offer.title}
                  </h3>
                </div>

                {/* Active switch */}
                <button
                  onClick={() => toggleOfferActive(offer.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: offer.isActive ? '#ECFDF5' : '#F1F5F9',
                    color: offer.isActive ? '#047857' : '#64748B',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: offer.isActive ? '#A7F3D0' : '#E2E8F0',
                  }}
                >
                  {offer.isActive ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Description */}
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                {offer.description}
              </p>

              {/* Offer Details Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                    Discount
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', marginTop: '2px', display: 'block' }}>
                    {offer.discountPercent}% OFF
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                    Min Bill
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', marginTop: '2px', display: 'block' }}>
                    ₹{offer.minBill}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                    Max Cap
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', marginTop: '2px', display: 'block' }}>
                    {offer.maxDiscount ? `₹${offer.maxDiscount}` : 'No limit'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Row */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: 500 }}>
                <Calendar size={13} color="#94A3B8" />
                <span>Valid till {offer.validUntil}</span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{offer.claimedCount} claims</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => openEditModal(offer)}
                  title="Edit Offer"
                  style={{
                    padding: '6px',
                    borderRadius: '8px',
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
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  title="Delete Offer"
                  style={{
                    padding: '6px',
                    borderRadius: '8px',
                    border: '1px solid #FEE2E2',
                    backgroundColor: '#FEF2F2',
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create / Edit Promotion */}
      {isModalOpen && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingOffer ? 'Edit Promotion' : 'Create New Stacked Promotion'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE40"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Discount Percentage (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPercent}
                    onChange={(e) => setFormPercent(e.target.value)}
                    placeholder="30"
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
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Promotion Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Gourmet Burger Feast 30% Off"
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Min Bill Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formMinBill}
                    onChange={(e) => setFormMinBill(e.target.value)}
                    placeholder="699"
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
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={formMaxDiscount}
                    onChange={(e) => setFormMaxDiscount(e.target.value)}
                    placeholder="300"
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
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Terms, applicability on dine-in orders..."
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

              {/* Stacked Restrofe Coin Boost Box */}
              <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Coins size={16} color="#FF5A1F" />
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#9A3412' }}>
                      Restrofe Coin Boost (Stacked)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsStacked}
                    onChange={(e) => setFormIsStacked(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#FF5A1F', cursor: 'pointer' }}
                  />
                </div>
                {formIsStacked && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11.5px', color: '#9A3412', fontWeight: 600 }}>Bonus Coins:</span>
                    <input
                      type="number"
                      value={formCoinBoost}
                      onChange={(e) => setFormCoinBoost(e.target.value)}
                      style={{
                        width: '70px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #FDBA74',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: '11.5px', color: '#9A3412', fontWeight: 600 }}>% credited back to diner</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  {editingOffer ? 'Update Promotion' : 'Publish Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
