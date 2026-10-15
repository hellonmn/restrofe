import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  X,
  Sparkles,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { TableDoodleRenderer } from './Doodles';

export const StandeeModal: React.FC = () => {
  const { selectedStandeeTable, setSelectedStandeeTable, profile } = useRestaurant();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedStandeeTable && canvasRef.current) {
      // Direct UPI payment payload
      const upiUrl = `upi://pay?pa=${selectedStandeeTable.upiVpa}&pn=${encodeURIComponent(
        profile.name
      )}&tn=Table%20${selectedStandeeTable.tableNumber}&cu=INR`;

      QRCode.toCanvas(
        canvasRef.current,
        upiUrl,
        {
          width: 240,
          margin: 1,
          color: {
            dark: '#111827',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR', error);
        }
      );
    }
  }, [selectedStandeeTable, profile.name]);

  if (!selectedStandeeTable) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Restrofe-Table-${selectedStandeeTable.tableNumber}-QR.png`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-100 space-y-6">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Table {selectedStandeeTable.tableNumber} Acrylic Standee Preview
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ready for physical printing or download for table display
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Download size={14} />
              <span>Save PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E44912] shadow-md shadow-[#FF5A1F]/20 transition"
            >
              <Printer size={14} />
              <span>Print Standee</span>
            </button>
            <button
              onClick={() => setSelectedStandeeTable(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Standee Design Element */}
        <div
          id="printable-standee"
          className="mx-auto max-w-[340px] rounded-3xl border-2 border-slate-800 bg-white shadow-xl overflow-hidden text-center relative"
        >
          {/* Top Brand Header */}
          <div className="bg-gradient-to-br from-[#0F1115] via-[#171A21] to-[#0F1115] text-white p-6 space-y-2 border-b-4 border-[#FF5A1F]">
            <div className="flex items-center justify-center">
              <img
                src="/logo-light.png"
                alt="Restrofe"
                className="h-8 max-w-[170px] object-contain drop-shadow"
              />
            </div>

            <div className="pt-2 flex flex-col items-center">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40 text-xs font-black uppercase tracking-widest">
                  TABLE {selectedStandeeTable.tableNumber}
                </span>
                <TableDoodleRenderer
                  tableNumber={selectedStandeeTable.tableNumber}
                  section={selectedStandeeTable.section}
                  capacity={selectedStandeeTable.capacity}
                  size={22}
                  color="#FF7A45"
                  opacity={0.9}
                />
              </div>
              <h2 className="text-base font-extrabold text-white mt-1.5 truncate max-w-[260px]">
                {profile.name}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                {selectedStandeeTable.section}
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-6 bg-white flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 inline-block shadow-inner">
              <canvas ref={canvasRef} className="rounded-lg" />
            </div>

            {/* Instruction */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-900">
                <Smartphone size={14} className="text-[#FF5A1F]" />
                <span>Scan with Camera or any UPI App</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Google Pay • PhonePe • Paytm • CRED
              </p>
            </div>

            {/* Restrofe Stacked Offer Highlight */}
            <div className="w-full mt-2 p-3 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-[11px] font-black text-[#FF5A1F] uppercase tracking-wide">
                <Sparkles size={13} />
                <span>Unlock Up to 30% Off</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium">
                + Get 20% bonus coins credited to your wallet
              </p>
            </div>
          </div>

          {/* Direct Settlement Footer */}
          <div className="bg-slate-50 border-t border-slate-200 py-3 px-4 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck size={13} /> Verified Direct UPI
            </span>
            <span className="font-mono font-bold text-slate-700">
              {selectedStandeeTable.upiVpa}
            </span>
          </div>
        </div>

        {/* Modal Info Footer */}
        <div className="text-center text-xs text-slate-400 no-print">
          Clicking "Print Standee" will open the standard A5 / A6 acrylic sheet print dialog.
        </div>
      </div>
    </div>
  );
};
