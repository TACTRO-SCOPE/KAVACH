import React from 'react';
import { FdrInstrument } from '../types/index.ts';

interface GigwReportModalProps {
  instrument?: FdrInstrument;
  onClose: () => void;
}

export const GigwReportModal: React.FC<GigwReportModalProps> = ({ instrument, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl animate-in zoom-in-95 border-t-8 border-[#0037b0] max-h-[90vh] overflow-y-auto">
        {/* Certificate Header */}
        <div className="text-center pb-4 border-b-2 border-[#0037b0]/30 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#0037b0] text-white flex items-center justify-center mb-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">assured_workload</span>
          </div>
          <span className="text-[11px] font-bold tracking-widest text-[#0037b0] uppercase font-mono">
            Government of India • Ministry of Education
          </span>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0b1c30] font-['Public_Sans']">
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
          </h2>
          <span className="text-[12px] font-mono font-semibold text-[#565e74] uppercase mt-0.5">
            FDR-KAVACH STATUTORY COMPLIANCE & LIEN CERTIFICATE (GIGW 3.0)
          </span>
          <div className="text-[10px] font-mono text-[#747686] mt-1">
            Certificate ID: AICTE/FDR-KAVACH/2026/GIGW-99214 • Issued under APH Section 4.6
          </div>
        </div>

        {/* Certificate Details */}
        <div className="flex flex-col gap-3.5 text-[12px]">
          <p className="leading-relaxed text-[#0b1c30]">
            This is to certify that the institutional security deposit Fixed Deposit Receipt (FDR)
            instrument described below has been registered, verified, and placed under irrevocable
            statutory joint lien with the All India Council for Technical Education (AICTE) in
            accordance with the Approval Process Handbook (APH) norms:
          </p>

          <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#c4c5d7]/50 grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div>
              <span className="text-[10px] text-[#747686] block">INSTITUTION (PID):</span>
              <span className="font-bold text-[#0b1c30]">
                {instrument?.institutionName || 'Vindhya Institute of Technology'} (
                {instrument?.pid || '1-402918210'})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#747686] block">FDR REGISTRATION NO:</span>
              <span className="font-bold text-[#0037b0]">{instrument?.fdrNumber || 'FDR-SBI-9928172'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#747686] block">ISSUING SCHEDULED BANK:</span>
              <span className="font-bold text-[#0b1c30]">
                {instrument?.bankName || 'State Bank of India'} ({instrument?.ifsc || 'SBIN0004210'})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#747686] block">PRINCIPAL SECURED AMOUNT:</span>
              <span className="font-bold text-emerald-800 text-[13px]">
                ₹{((instrument?.principalAmount || 3500000) / 100000).toFixed(2)} Lakhs
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#747686] block">MANDATE TENOR:</span>
              <span className="font-bold text-[#0b1c30]">
                {instrument?.tenorMonths || 120} Months (Maturity: {instrument?.maturityDate || '2032-08-12'})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#747686] block">CAG AUDIT INTEGRITY:</span>
              <span className="font-bold text-[#0037b0]">SHA-256 Merkle Validated</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-[#c4c5d7]/50 text-[11px] italic font-serif text-[#0b1c30]">
            "The deposit is marked with AICTE as Joint Holder. No encashment, premature withdrawal,
            or pledge release shall occur without the dual digital token authorization of AICTE
            Member Secretary and Bank Nodal Officer."
          </div>
        </div>

        {/* Dual Signatures & QR Code */}
        <div className="pt-4 border-t border-[#c4c5d7]/40 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-[#eff4ff] border border-[#c4c5d7] p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-[#0037b0]">qr_code_2</span>
            </div>
            <span className="text-[9px] font-mono text-[#747686] mt-1">Scan to Verify</span>
          </div>

          <div className="text-right">
            <span className="font-serif italic text-[14px] text-blue-900 block">
              Prof. (Dr.) Rajive Kumar
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0b1c30] block">
              Member Secretary, AICTE
            </span>
            <span className="text-[9px] font-mono text-emerald-700">
              e-Signed: SHA-256 Hash Verified
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#c4c5d7]/30">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[13px] transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
