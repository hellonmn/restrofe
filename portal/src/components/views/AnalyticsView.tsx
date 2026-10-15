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
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Guest Rating
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star size={16} fill="currentColor" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{avgRating}</span>
            <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
              Top 5%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Based on verified table QR visits</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Repeat Diner Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">68.4%</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded ml-auto">
              +14% vs avg
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Boosted by Restrofe Coin streaks</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment Method
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">94%</span>
            <span className="text-xs font-semibold text-slate-500">Direct UPI</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
              Instant
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">6% Restrofe Wallet Coins</p>
        </div>
      </div>

      {/* Hourly Dining Heatmap */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Peak Hours Traffic Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Real-time diner footfall across operating hours
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5A1F] border border-orange-200">
            Dinner Peak: 7:30 PM - 10:00 PM
          </span>
        </div>

        <div className="flex items-end gap-2 h-32 pt-4">
          {HOURLY_TRAFFIC.map((item) => {
            const max = 86;
            const heightPct = Math.round((item.diners / max) * 100);
            return (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                <div className="w-full bg-slate-100 rounded-t h-24 flex items-end overflow-hidden">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-all group-hover:opacity-80 ${
                      item.isPeak
                        ? 'bg-[#FF5A1F]'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-800">
                  {item.hour.replace(' ', '')}
                </span>

                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition whitespace-nowrap z-20">
                  {item.diners} diners {item.isPeak ? '🔥 Peak' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Diner Reviews with Manager Reply */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={18} className="text-[#FF5A1F]" />
              <h3 className="text-base font-extrabold text-slate-900">
                Verified Guest Reviews
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Only guests who completed payment via table QR code can submit reviews
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {reviews.length} Verified Reviews
          </span>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2.5"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {rev.customerName}
                    </span>
                    {rev.verifiedDiner && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <ShieldCheck size={11} /> Table {rev.tableNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{rev.date}</span>
                    <span>•</span>
                    <span>Check: ₹{rev.billAmount}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < rev.rating ? 'currentColor' : 'none'}
                      className={i < rev.rating ? 'text-amber-500' : 'text-slate-300'}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{rev.comment}"
              </p>

              {/* Manager Reply If exists */}
              {rev.reply && (
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#FF5A1F]">
                    <span>Manager Reply:</span>
                    <span className="text-slate-400 font-normal">{rev.reply.repliedAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.reply.text}
                  </p>
                </div>
              )}

              {/* Reply Button / Form */}
              {!rev.reply && (
                <div>
                  {activeReplyId === rev.id ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a warm, professional reply..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText('');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(rev.id)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912]"
                        >
                          <Send size={12} />
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
                      className="text-xs font-bold text-[#FF5A1F] hover:underline"
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
