import React from 'react';
import { FdrInstrument, NavigationTab } from '../types/index.ts';

interface ReleaseLineageViewProps {
  instruments: FdrInstrument[];
  onNavigateTab: (tab: NavigationTab) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ReleaseLineageView: React.FC<ReleaseLineageViewProps> = ({
  onNavigateTab,
  onShowToast,
}) => {
  const [hasGapViolation, setHasGapViolation] = React.useState(false);
  const [isGapCondoned, setIsGapCondoned] = React.useState(false);
  const [clearanceStatus, setClearanceStatus] = React.useState<'PENDING' | 'CLEARED'>('PENDING');

  const handleCondoneGap = () => {
    setIsGapCondoned(true);
    onShowToast('Statutory Gap Condonation Order committed under APH Section 4.8.', 'verified');
  };

  const handleAuthorizeRelease = () => {
    setClearanceStatus('CLEARED');
    onShowToast('4-Bureau Clearance Granted: Digitally signed Encashment Mandate issued!', 'verified');
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
      {/* View Segment Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#c4c5d7]/50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#0037b0] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[22px]">account_tree</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#0b1c30]">Continuous Renewal Lineage & DAG</h2>
            <p className="text-[12px] text-[#434655]">
              Multi-year deposit lineage tracking, zero-gap verification, and 4-Bureau clearance
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('audit-ledger')}
          className="px-3.5 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0037b0] text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c4c5d7]/40"
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span className="hidden sm:inline">View SHA-256 Chain</span>
        </button>
      </div>

      {/* DAG Explorer Card */}
      <section className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[20px]">hub</span>
            <div>
              <h3 className="text-[15px] font-bold text-[#0b1c30]">Renewal Lineage Directed Acyclic Graph</h3>
              <span className="text-[11px] font-mono text-[#434655]">
                Bank of Baroda Deposit Chain #B-88301 • PID: 1-110928347
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHasGapViolation(!hasGapViolation);
                setIsGapCondoned(false);
                onShowToast(
                  hasGapViolation ? 'Reset to Zero-Gap Chain' : 'Simulating 14-day coverage gap violation',
                  'tune'
                );
              }}
              className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#434655] text-[11px] font-mono transition-colors"
            >
              {hasGapViolation ? 'Reset Gap' : 'Simulate Gap'}
            </button>
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-bold font-mono uppercase">
              Tier-1 Apex DAG
            </span>
          </div>
        </div>

        {/* DAG Flow Graph */}
        <div className="relative flex flex-col items-center py-3">
          {/* Node 1: Parent FDR */}
          <div className="w-full max-w-xl bg-[#eff4ff]/80 rounded-xl p-4 border border-[#c4c5d7]/50 shadow-xs flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#565e74] text-[22px]">history_edu</span>
                <div>
                  <span className="font-mono font-bold text-[13px] text-[#0b1c30]">FDR-BARB-2018-OLD</span>
                  <span className="block text-[11px] text-[#434655]">
                    Bank of Baroda • Mandate #00492 • Laxmi Narain College
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-mono font-bold">
                SUPERSEDED
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white/80 p-2 rounded border border-[#c4c5d7]/30">
              <div>
                <span className="text-[9px] text-[#747686] block">MATURED ON</span>
                <span className="font-bold text-[#0b1c30]">30 Jun 2023</span>
              </div>
              <div>
                <span className="text-[9px] text-[#747686] block">SECURED VALUE</span>
                <span className="font-bold text-[#0037b0]">₹15,00,000</span>
              </div>
            </div>
          </div>

          {/* DAG Connector with Gap Metric Badge */}
          <div className="relative flex flex-col items-center my-3 w-full">
            <div className="w-0.5 h-16 bg-[#c4c5d7] flex items-center justify-center relative">
              {/* Pulsing indicator */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#0037b0] animate-ping absolute"></div>
            </div>

            {/* Gap Badge Indicator */}
            <div className="absolute top-4 z-10">
              {hasGapViolation && !isGapCondoned ? (
                <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-mono font-bold border border-red-300 shadow-sm flex items-center gap-1.5 animate-bounce">
                  <span className="material-symbols-outlined text-[15px]">warning</span>
                  <span>14-Day Statutory Gap Detected!</span>
                  <button
                    onClick={handleCondoneGap}
                    className="ml-1 px-2 py-0.2 rounded bg-red-600 text-white text-[10px] hover:bg-red-700"
                  >
                    Condone Gap
                  </button>
                </div>
              ) : isGapCondoned ? (
                <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-[11px] font-mono font-bold border border-amber-300 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>14-Day Gap Condoned (Sec 4.8 Order #991)</span>
                </div>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[11px] font-mono font-bold border border-emerald-300 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>0 Days Gap • Continuous Lien Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Node 2: Child Renewal FDR */}
          <div className="w-full max-w-xl bg-white rounded-xl p-4 border-2 border-[#0037b0] shadow-md flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0037b0] text-[22px]">published_with_changes</span>
                <div>
                  <span className="font-mono font-bold text-[14px] text-[#0037b0]">FDR-BARB-2023-NEW</span>
                  <span className="block text-[11px] text-[#434655]">
                    Bank of Baroda • Mandate #05910 • Joint Lien Active
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                ACTIVE RENEWAL LIEN
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-[#eff4ff] p-2 rounded border border-[#c4c5d7]/30">
              <div>
                <span className="text-[9px] text-[#747686] block">START DATE</span>
                <span className="font-bold text-[#0b1c30]">01 Jul 2023</span>
              </div>
              <div>
                <span className="text-[9px] text-[#747686] block">TENOR</span>
                <span className="font-bold text-[#0037b0]">120 Mos (2033)</span>
              </div>
              <div>
                <span className="text-[9px] text-[#747686] block">VALUE</span>
                <span className="font-bold text-emerald-700">₹15,00,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Bureau Statutory Clearance Board */}
      <section className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#c4c5d7]/30">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">4-Bureau Statutory Clearance Board</h3>
            <p className="text-[12px] text-[#434655]">
              Multi-agency dual-signatory verification pipeline prior to encashment release
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold font-mono uppercase self-start sm:self-auto ${
              clearanceStatus === 'CLEARED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {clearanceStatus === 'CLEARED' ? '4-BUREAU CLEARED (NOC ISSUED)' : 'STAGE: CLEARANCE PENDING'}
          </span>
        </div>

        {/* 4 Clearance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Bureau 1 */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-emerald-800 uppercase">
                Bureau 1: Academic
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#0b1c30]">AICTE Approval Bureau</h4>
              <p className="text-[11px] text-[#434655] mt-0.5">APH 2026 Continuous Affiliation Check</p>
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-800 bg-white/80 p-1.5 rounded">
              Status: APPROVED (No Deficit)
            </div>
          </div>

          {/* Bureau 2 */}
          <div className="p-3.5 rounded-xl border border-[#c4c5d7]/50 bg-[#eff4ff]/60 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-[#0037b0] uppercase">
                Bureau 2: Scheduled Bank
              </span>
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">account_balance</span>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#0b1c30]">Bank Nodal Directorate</h4>
              <p className="text-[11px] text-[#434655] mt-0.5">SFMS Code 799 Lien Release Request</p>
            </div>
            <div className="text-[10px] font-mono font-bold text-[#0037b0] bg-white/80 p-1.5 rounded">
              Status: DUAL-SIGN READY
            </div>
          </div>

          {/* Bureau 3 */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-emerald-800 uppercase">
                Bureau 3: CAG Vigilance
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">gavel</span>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#0b1c30]">Finance & Vigilance</h4>
              <p className="text-[11px] text-[#434655] mt-0.5">Zero Penalty & Clean Audit Seal</p>
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-800 bg-white/80 p-1.5 rounded">
              Status: NO DUES CLEARED
            </div>
          </div>

          {/* Bureau 4 */}
          <div className="p-3.5 rounded-xl border border-[#c4c5d7]/50 bg-[#eff4ff]/60 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-[#0037b0] uppercase">
                Bureau 4: Treasury
              </span>
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">lock_open</span>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#0b1c30]">Joint Escrow Release</h4>
              <p className="text-[11px] text-[#434655] mt-0.5">Final Statutory Encashment Warrant</p>
            </div>
            <div className="text-[10px] font-mono font-bold text-[#0037b0] bg-white/80 p-1.5 rounded">
              Status: {clearanceStatus === 'CLEARED' ? 'RELEASED' : 'READY TO AUTHORIZE'}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#c4c5d7]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12px] text-[#434655]">
            Dual digital signatures required: AICTE Member Secretary DSC + Bank AGM e-Sign.
          </span>
          <button
            onClick={handleAuthorizeRelease}
            disabled={clearanceStatus === 'CLEARED'}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffdcc3]">verified_user</span>
            <span>
              {clearanceStatus === 'CLEARED'
                ? 'NOC Release Mandate Dispatched'
                : 'Authorize 4-Bureau Dual-Signatory Release'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
