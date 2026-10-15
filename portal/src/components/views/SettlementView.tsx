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
    <div className="space-y-6 pb-16">
      {/* Clean White Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Direct UPI Settlements & 0% Commission
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} /> 0% Platform Fee
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Customer payments bypass intermediary hold periods and settle directly into your linked bank account (<strong className="text-slate-800">{profile.bankDetails.bankName}</strong>).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition flex-shrink-0"
        >
          <Download size={14} />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Trial Status & Bank Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Trial Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Partner Plan
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
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
            <span>0% Commission guaranteed on orders</span>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Linked Bank & Merchant UPI
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Active for Direct Payouts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Bank Name</span>
              <span className="text-xs font-bold text-slate-800">{profile.bankDetails.bankName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Account No</span>
              <span className="text-xs font-mono font-bold text-slate-800">{profile.bankDetails.accountNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">IFSC Code</span>
              <span className="text-xs font-mono font-bold text-slate-800">{profile.bankDetails.ifsc}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Primary UPI</span>
              <span className="text-xs font-mono font-bold text-[#FF5A1F]">{profile.upiVpa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Settlements Ledger */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Settlement Activity Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Direct table QR transactions settled into your merchant bank account
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ₹{aggregatorCutAvoided} Aggregator Fee Saved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3 font-bold">Ref / ID</th>
                <th className="pb-3 font-bold">Table</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Bill Total</th>
                <th className="pb-3 font-bold">Platform Cut</th>
                <th className="pb-3 font-bold">Net Payout</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-mono font-semibold text-slate-800">{v.id}</td>
                  <td className="py-3 font-bold text-slate-900">Table {v.tableNumber}</td>
                  <td className="py-3 text-slate-600 font-medium">{v.customerName}</td>
                  <td className="py-3 font-bold text-slate-900">₹{v.amount}</td>
                  <td className="py-3 font-bold text-emerald-600">₹0 (0%)</td>
                  <td className="py-3 font-extrabold text-slate-900">₹{v.amount}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
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
