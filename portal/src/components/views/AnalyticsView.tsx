import React, { useState } from 'react';
import {
  Star,
  MessageSquareQuote,
  ShieldCheck,
  Send,
  Users,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { HOURLY_TRAFFIC } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const { reviews, replyToReview } = useRestaurant();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '48px' }}>
      {/* Top Analytics Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        {/* Metric 1: Guest Rating */}
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
              Guest Rating
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FFFBEB',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star size={17} fill="#F59E0B" />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                {avgRating}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>/ 5.0</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#15803D',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #BBF7D0',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                Top 5%
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: '6px 0 0 0' }}>
              Based on verified table QR visits
            </p>
          </div>
        </div>

        {/* Metric 2: Repeat Diner Rate */}
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
              Repeat Diner Rate
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={17} strokeWidth={2.3} />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                68.4%
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563EB',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                +14% vs avg
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: '6px 0 0 0' }}>
              Boosted by Restrofe Coin streaks
            </p>
          </div>
        </div>

        {/* Metric 3: Payment Method */}
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
              Settlement Routing
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} strokeWidth={2.3} />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                94%
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Direct UPI</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#15803D',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #BBF7D0',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                Instant
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: '6px 0 0 0' }}>
              6% Restrofe Wallet Coins
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Dining Heatmap */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Peak Hours Traffic Distribution
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, margin: '2px 0 0 0' }}>
              Real-time diner footfall and rush hours across operating hours
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: '#FFF4EE',
              color: '#FF5A1F',
              border: '1px solid #FFD8C7',
            }}
          >
            Dinner Peak: 7:30 PM – 10:00 PM
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', gap: '8px', padding: '0 4px' }}>
          {HOURLY_TRAFFIC.map((item) => {
            const max = 86;
            const heightPct = Math.round((item.diners / max) * 100);
            return (
              <div key={item.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '42px',
                    height: `${Math.max(16, heightPct * 0.9)}px`,
                    backgroundColor: item.isPeak ? '#FF5A1F' : '#E2E8F0',
                    borderRadius: '5px 5px 0 0',
                    transition: 'all 0.2s ease',
                  }}
                  title={`${item.hour}: ${item.diners} diners`}
                />
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', marginTop: '6px' }}>
                  {item.hour.replace(' ', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Diner Reviews with Manager Reply */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquareQuote size={18} color="#FF5A1F" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Verified Guest Reviews
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, margin: '2px 0 0 0' }}>
              Only guests who completed payment via table QR code can submit reviews
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
            {reviews.length} Verified Reviews
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: '16px 18px',
                borderRadius: '14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* Review Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                      {rev.customerName}
                    </span>
                    {rev.verifiedDiner && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#ECFDF5',
                          color: '#15803D',
                          border: '1px solid #BBF7D0',
                        }}
                      >
                        <ShieldCheck size={11} /> Table {rev.tableNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    <span>{rev.date}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Check: ₹{rev.billAmount}</span>
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < rev.rating ? '#F59E0B' : 'none'}
                      color={i < rev.rating ? '#F59E0B' : '#CBD5E1'}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                "{rev.comment}"
              </p>

              {/* Manager Reply If exists */}
              {rev.reply && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    marginTop: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#FF5A1F' }}>
                    <span>Manager Reply:</span>
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>{rev.reply.repliedAt}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '4px 0 0 0' }}>
                    {rev.reply.text}
                  </p>
                </div>
              )}

              {/* Reply Button / Form */}
              {!rev.reply && (
                <div>
                  {activeReplyId === rev.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a warm, professional reply..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          fontWeight: 500,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                          resize: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText('');
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: '#64748B',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(rev.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            backgroundColor: '#FF5A1F',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Send size={11} />
                          <span>Publish Reply</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#FF5A1F',
                        cursor: 'pointer',
                      }}
                    >
                      Reply to guest →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
