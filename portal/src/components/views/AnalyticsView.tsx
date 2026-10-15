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
    <div className="space-y-8 pb-16">
      {/* Top Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Guest Rating
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star size={18} fill="currentColor" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{avgRating}</span>
            <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
              Top 5% in Indiranagar
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Based on 1,024 verified table QR visits</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Repeat Diner Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">68.4%</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-auto">
              +14% vs avg
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Powered by Restrofe Coin loyalty streaks</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment Method Split
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 tracking-tight">94%</span>
            <span className="text-xs font-semibold text-slate-500">Direct UPI</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
              Instant
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">6% Restrofe Wallet & Dine-in Coins</p>
        </div>
      </div>

      {/* Hourly Dining Heatmap */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Table Turnover & Peak Hours
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time diner volume distribution across operating hours
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#FF5A1F] border border-[#FF5A1F]/20">
            Dinner Peak: 7:30 PM - 10:00 PM
          </span>
        </div>

        <div className="flex items-end gap-2 h-36 pt-6">
          {HOURLY_TRAFFIC.map((item) => {
            const max = 86;
            const heightPct = Math.round((item.diners / max) * 100);
            return (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="w-full bg-slate-100 rounded-t-lg h-28 flex items-end overflow-hidden">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all group-hover:opacity-85 ${
                      item.isPeak
                        ? 'bg-gradient-to-t from-[#FF5A1F] to-[#FF8A50]'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-800">
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
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={20} className="text-[#FF5A1F]" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Verified Guest Reviews
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Only guests who completed payment via table QR code can submit reviews
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {reviews.length} Verified Reviews
          </span>
        </div>

        <div className="space-y-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
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
                        <ShieldCheck size={11} /> Verified Table {rev.tableNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{rev.date}</span>
                    <span>•</span>
                    <span>Bill: ₹{rev.billAmount}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
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
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
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
                        placeholder="Write a warm, professional reply from restaurant management..."
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
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
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912]"
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
