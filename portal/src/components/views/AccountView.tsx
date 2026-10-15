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
    <div className="space-y-8 pb-16">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5A1F] to-[#FF8A50] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF5A1F]/30">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 size={11} /> FSSAI Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{profile.tagline}</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-md shadow-[#FF5A1F]/20 transition"
        >
          <Save size={15} />
          <span>Save Profile Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Store Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-[#FF5A1F]" />
            Restaurant Store Profile
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Brand Bio</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City & State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>
        </div>

        {/* Regulatory & Bank Details */}
        <div className="space-y-6">
          {/* Statutory */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              Statutory & FSSAI Compliance
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">FSSAI License No.</label>
                <input
                  type="text"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            </div>
          </div>

          {/* Direct Settlement Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} className="text-[#FF5A1F]" />
              Direct Settlement Bank Account
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Merchant UPI VPA *</label>
              <input
                type="text"
                required
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-[#FF5A1F] focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Beneficiary Entity Name</label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
