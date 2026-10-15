import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
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
    <div className="space-y-8 pb-16">
      {/* 0% Commission Hero Banner (Pitch Deck Slide 08) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 text-white border border-emerald-900/50 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 size={12} /> 0% Commission Forever
              </span>
              <span className="text-xs font-semibold text-slate-400">Pitch Deck Slide 08</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Direct Peer-to-Merchant Bank Settlements
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Restrofe does not hold your restaurant’s funds in escrow or charge 20% to 30% aggregator commissions. All dine-in table checks are settled directly into your linked bank account (<code className="text-emerald-400 font-bold">{profile.bankDetails.bankName}</code>).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition"
            >
              <Download size={15} />
              <span>Export CSV Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trial Status & Bank Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trial Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Trial & Partner Plan
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {profile.subscription.trialDaysLeft} Days Left
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              1-Month Free Trial active till {profile.subscription.validTill}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span>Guaranteed 0% Commission on all orders</span>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Linked Bank Account & UPI
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Active for Direct Payouts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Bank Name</span>
              <span className="text-xs font-bold text-slate-800">{profile.bankDetails.bankName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Account Number</span>
              <span className="text-xs font-mono font-bold text-slate-800">{profile.bankDetails.accountNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">IFSC Code</span>
              <span className="text-xs font-mono font-bold text-slate-800">{profile.bankDetails.ifsc}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Primary UPI ID</span>
              <span className="text-xs font-mono font-bold text-[#FF5A1F]">{profile.upiVpa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Settlements Ledger */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Live Settlement Activity
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Transactions settled directly to your merchant account
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ₹{aggregatorCutAvoided} Aggregator Fee Saved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 font-bold">Transaction / Ref</th>
                <th className="pb-3 font-bold">Table</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Bill Total</th>
                <th className="pb-3 font-bold">Restrofe Cut</th>
                <th className="pb-3 font-bold">Net Payout</th>
                <th className="pb-3 font-bold">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 font-mono font-semibold text-slate-800">{v.id}</td>
                  <td className="py-3.5 font-bold text-slate-900">Table {v.tableNumber}</td>
                  <td className="py-3.5 text-slate-600 font-medium">{v.customerName}</td>
                  <td className="py-3.5 font-bold text-slate-900">₹{v.amount}</td>
                  <td className="py-3.5 font-bold text-emerald-600">₹0 (0%)</td>
                  <td className="py-3.5 font-black text-slate-900">₹{v.amount}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
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
