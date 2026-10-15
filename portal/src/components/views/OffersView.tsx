import React, { useState } from 'react';
import {
  Plus,
  Coins,
  Sparkles,
  Calendar,
  X,
  Layers,
  Trash2,
  Edit2,
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
    <div className="space-y-8 pb-16">
      {/* Restrofe Stacked Discounts Explainer (Slide 02 & 07) */}
      <div className="bg-gradient-to-r from-orange-600 via-[#FF5A1F] to-amber-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 flex items-center gap-1">
                <Sparkles size={12} /> Restrofe Killer Feature
              </span>
              <span className="text-xs font-bold text-orange-100">Pitch Deck Slide 07</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Stacked Offers: Restaurant Discount + Restrofe Coin Boost
            </h2>
            <p className="text-xs text-orange-100 leading-relaxed font-medium">
              Unlike traditional apps where discounts hurt restaurant margins, Restrofe combines your in-store discount with platform Restrofe Coins. Diners get double value (e.g. 30% instant off + 20% bonus coins for repeat visits), driving 2.4x higher check size!
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black bg-white text-slate-900 hover:bg-slate-50 shadow-lg shadow-black/15 transition flex-shrink-0"
          >
            <Plus size={16} className="text-[#FF5A1F]" />
            <span>Create New Promotion</span>
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              offer.isActive
                ? 'border-slate-200 shadow-xs hover:shadow-md'
                : 'border-slate-200/60 opacity-60 bg-slate-50/60'
            }`}
          >
            <div className="space-y-4">
              {/* Header row: Code & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-mono font-black text-sm tracking-wider">
                      {offer.code}
                    </span>
                    {offer.isStacked && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-[#FF5A1F] border border-[#FF5A1F]/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Layers size={11} /> STACKED (+{offer.coinBoostPercent}% Coins)
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base pt-1">
                    {offer.title}
                  </h4>
                </div>

                {/* Active switch */}
                <button
                  onClick={() => toggleOfferActive(offer.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition ${
                    offer.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {offer.isActive ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed">
                {offer.description}
              </p>

              {/* Offer Details Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Discount</span>
                  <span className="text-sm font-black text-slate-800">
                    {offer.discountPercent}% OFF
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Min Bill</span>
                  <span className="text-sm font-black text-slate-800">
                    ₹{offer.minBill}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Max Cap</span>
                  <span className="text-sm font-black text-slate-800">
                    {offer.maxDiscount ? `₹${offer.maxDiscount}` : 'No limit'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Calendar size={13} />
                <span>Valid till {offer.validUntil}</span>
                <span className="mx-1">•</span>
                <span className="font-bold text-slate-700">{offer.claimedCount} claims</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(offer)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingOffer ? 'Edit Promotion' : 'Create Stacked Promotion'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Promo Code *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="e.g. RESTRO30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Promotion Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as OfferType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F] bg-white"
                  >
                    <option value="stacked">Stacked Discount (Store + Coins)</option>
                    <option value="bill_flat">Flat Check Off (₹100 on ₹1,000)</option>
                    <option value="happy_hour">Happy Hours (Afternoon)</option>
                    <option value="loyalty_streak">Repeat Diner Streak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 30% Off Dine-In + 20% Coin Boost"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="90"
                    value={formPercent}
                    onChange={(e) => setFormPercent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Bill (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formMinBill}
                    onChange={(e) => setFormMinBill(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={formMaxDiscount}
                    onChange={(e) => setFormMaxDiscount(e.target.value)}
                    placeholder="No limit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              {/* Restrofe Coin Boost Stack */}
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsStacked}
                    onChange={(e) => setFormIsStacked(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5A1F]"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Coins size={14} className="text-[#FF5A1F]" />
                    Enable Restrofe Coin Boost (Diner Reward)
                  </span>
                </label>
                {formIsStacked && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Bonus Restrofe Coins on Bill Payment (%)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={formCoinBoost}
                      onChange={(e) => setFormCoinBoost(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-orange-200 bg-white text-xs font-bold text-[#FF5A1F] focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Platform awards coins back to customer wallet for their next dining visit!
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until Date</label>
                <input
                  type="text"
                  value={formValidUntil}
                  onChange={(e) => setFormValidUntil(e.target.value)}
                  placeholder="31 Dec 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Terms</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain terms, valid times, or applicable food items..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-md shadow-[#FF5A1F]/30"
                >
                  {editingOffer ? 'Save Changes' : 'Launch Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
