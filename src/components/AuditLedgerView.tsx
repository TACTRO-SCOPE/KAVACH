import React from 'react';
import { AuditBlock } from '../types/index.ts';
import { verifyChainIntegrity } from '../utils/regulatoryRules.ts';

interface AuditLedgerViewProps {
  blocks: AuditBlock[];
  onTamperBlock: () => void;
  onRestoreChain: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onOpenReportModal: () => void;
}

export const AuditLedgerView: React.FC<AuditLedgerViewProps> = ({
  blocks,
  onTamperBlock,
  onRestoreChain,
  onShowToast,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const chainCheck = verifyChainIntegrity(blocks);

  const filteredBlocks = blocks.filter((b) => {
    return (
      b.blockHeight.toString().includes(searchQuery) ||
      b.fdrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.actorRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.actorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleVerifyChain = () => {
    if (chainCheck.isValid) {
      onShowToast(
        `Cryptographic chain verified: All ${blocks.length} blocks match Merkle root without collision.`,
        'verified_user'
      );
    } else {
      onShowToast(
        `CRITICAL TAMPER ALERT: ${chainCheck.errorMessage}`,
        'warning'
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
      {/* Top Banner */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0037b0] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[26px]">receipt_long</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] uppercase">
                CAG-Empanelled Central Ledger
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  chainCheck.isValid
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-red-50 text-red-700 border border-red-300 animate-pulse'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {chainCheck.isValid ? 'verified' : 'crisis_alert'}
                </span>
                {chainCheck.isValid ? '100% Chain Integrity' : 'CHAIN COMPROMISED'}
              </span>
            </div>
            <h2 className="text-[18px] font-bold text-[#0b1c30] mt-0.5 font-['Public_Sans']">
              SHA-256 Cryptographic Audit Ledger
            </h2>
            <p className="text-[12px] text-[#434655]">
              Immutable, tamper-evident regulatory timeline of all deposit covenants and actions
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleVerifyChain}
            className="h-9 px-3 rounded-lg bg-[#0037b0] hover:bg-[#1d4ed8] text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Verify Merkle Root</span>
          </button>

          {chainCheck.isValid ? (
            <button
              onClick={onTamperBlock}
              className="h-9 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">bug_report</span>
              <span>Simulate Tamper</span>
            </button>
          ) : (
            <button
              onClick={onRestoreChain}
              className="h-9 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restore</span>
              <span>Restore Clean Chain</span>
            </button>
          )}

          <button
            onClick={onOpenReportModal}
            className="h-9 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold flex items-center gap-1.5 transition-colors border border-[#c4c5d7]/40"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Export Certificate</span>
          </button>
        </div>
      </section>

      {/* Merkle Status Alert */}
      {!chainCheck.isValid && (
        <div className="bg-red-50 text-red-800 p-4 rounded-2xl border-2 border-red-400 shadow-md flex items-start gap-3">
          <span className="material-symbols-outlined text-red-600 text-[24px] shrink-0 mt-0.5">
            error
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-bold font-mono uppercase">
              CRYPTOGRAPHIC TAMPER DETECTED BY MERKLE CONSENSUS ENGINE!
            </span>
            <span className="text-[12px] leading-normal">{chainCheck.errorMessage}</span>
            <span className="text-[11px] text-red-700 font-mono mt-1">
              Statutory legal alert dispatched to CAG Vigilance Directorate and Member Secretary.
            </span>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#c4c5d7]/50 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#747686]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by Block Height, FDR ID, Actor..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#eff4ff] border border-[#c4c5d7]/40 text-[12px] text-[#0b1c30] placeholder-[#747686] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0037b0]"
          />
        </div>
        <span className="text-[11px] font-mono text-[#434655] font-semibold">
          Showing {filteredBlocks.length} of {blocks.length} Blocks
        </span>
      </div>

      {/* Blocks List */}
      <div className="flex flex-col gap-3">
        {filteredBlocks.map((block) => {
          const isTampered = block.status === 'TAMPERED' || block.tampered;

          return (
            <div
              key={block.blockHeight}
              className={`p-4 rounded-xl border transition-all flex flex-col gap-3 shadow-xs ${
                isTampered
                  ? 'bg-red-50/80 border-2 border-red-500'
                  : 'bg-white border-[#c4c5d7]/50 hover:border-[#0037b0]/50'
              }`}
            >
              {/* Header: Height, Action Type, Actor, Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#c4c5d7]/30">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[13px] text-white bg-[#0037b0] px-2 py-0.5 rounded">
                    Block #{block.blockHeight}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] uppercase">
                    {block.actionType}
                  </span>
                  <span className="text-[11px] font-mono text-[#0037b0] font-semibold">
                    {block.fdrId}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#434655]">
                  <span>{block.timestamp}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      isTampered
                        ? 'bg-red-600 text-white'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isTampered ? 'TAMPERED' : 'VALIDATED'}
                  </span>
                </div>
              </div>

              {/* Data Summary */}
              <p className="text-[12px] text-[#0b1c30] font-medium leading-relaxed">
                {block.dataSummary}
              </p>

              {/* Actor & Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-[#eff4ff] p-2.5 rounded-lg border border-[#c4c5d7]/30">
                <div>
                  <span className="text-[9px] text-[#747686] block">ACTOR STAKEHOLDER</span>
                  <span className="font-bold text-[#0b1c30]">
                    {block.actorName} ({block.actorRole})
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block">DIGITAL SIGNATURE TOKEN</span>
                  <span className="font-bold text-[#0037b0]">{block.signature}</span>
                </div>
              </div>

              {/* Hashes: Current & Previous */}
              <div className="flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-[#747686] text-[10px] uppercase">Block Hash:</span>
                  <span
                    className={`font-mono text-[11px] break-all p-1 rounded flex-1 ${
                      isTampered
                        ? 'bg-red-200 text-red-950 font-bold'
                        : 'bg-slate-100 text-[#0b1c30]'
                    }`}
                  >
                    {block.hash}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-[#747686] text-[10px] uppercase">Prev Hash:</span>
                  <span className="font-mono text-[11px] break-all p-1 rounded bg-slate-100 text-[#565e74] flex-1">
                    {block.previousHash}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
