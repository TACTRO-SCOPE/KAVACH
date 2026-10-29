import React from 'react';
import { FdrInstrument, BoundingBoxInfo } from '../types/index.ts';
import { SCRUTINY_BOUNDING_BOXES } from '../utils/mockData.ts';

interface ScrutinyConsoleViewProps {
  selectedInstrument: FdrInstrument;
  onCommitOverride: (
    field: string,
    newValue: number,
    reason: string,
    justification: string
  ) => void;
  onDualSignCommit: (fdrId: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ScrutinyConsoleView: React.FC<ScrutinyConsoleViewProps> = ({
  selectedInstrument,
  onCommitOverride,
  onDualSignCommit,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = React.useState<'vault' | 'matrix' | 'dual-sign'>('vault');
  const [selectedBBox, setSelectedBBox] = React.useState<BoundingBoxInfo>(SCRUTINY_BOUNDING_BOXES[1]); // default to amount
  const [showLaserScan, setShowLaserScan] = React.useState(true);
  const [showHeatmap, setShowHeatmap] = React.useState(false);
  const [highContrastMode, setHighContrastMode] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);

  // Override Modal state
  const [showOverrideModal, setShowOverrideModal] = React.useState(false);
  const [overrideValue, setOverrideValue] = React.useState('35,00,000');
  const [overrideReason, setOverrideReason] = React.useState('Scan Smudge / Stamp Overlap');
  const [overrideJustification, setOverrideJustification] = React.useState('');

  const handleSyncHighlight = (boxId: string) => {
    const box = SCRUTINY_BOUNDING_BOXES.find((b) => b.id === boxId || b.field === boxId);
    if (box) {
      setSelectedBBox(box);
    }
  };

  const handleDispatchBankRequest = () => {
    onShowToast('Dispatched SFMS Code 798 query to SBI Core Banking API gateway.', 'send');
  };

  const handleTriggerHold = () => {
    onShowToast(
      'Statutory Deficit Hold registered. Automatic notice dispatched to Institute Principal.',
      'gavel'
    );
  };

  const handleOverrideSubmit = () => {
    const numeric = parseInt(overrideValue.replace(/,/g, ''), 10) || selectedInstrument.declaredAmount;
    onCommitOverride('principalAmount', numeric, overrideReason, overrideJustification);
    setShowOverrideModal(false);
    setOverrideJustification('');
    onShowToast('Officer Override committed to Central Cryptographic Ledger.', 'verified');
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
      {/* Top Banner: Instrument Context */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0037b0] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[26px]">fact_check</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] uppercase">
                Tier-2 Forensic Scrutiny Desk
              </span>
              <span className="text-[11px] font-mono font-bold text-[#ba1a1a] bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                Deficit Detected
              </span>
            </div>
            <h2 className="text-[18px] font-bold text-[#0b1c30] mt-0.5">
              {selectedInstrument.fdrNumber} • {selectedInstrument.institutionName}
            </h2>
            <p className="text-[12px] text-[#434655]">
              PID: {selectedInstrument.pid} | {selectedInstrument.bankName} (
              {selectedInstrument.ifsc})
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#eff4ff] border border-[#c4c5d7]/40 shadow-inner">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'vault'
                ? 'bg-white text-[#0037b0] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>OCR Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'matrix'
                ? 'bg-white text-[#0037b0] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>5-State Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('dual-sign')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'dual-sign'
                ? 'bg-white text-[#0037b0] shadow-xs'
                : 'text-[#434655] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Dual-Sign Deck</span>
          </button>
        </div>
      </section>

      {/* Main Content Areas based on Tab */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel: Physical Certificate Document with Bounding Boxes */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Forensic Inspection Toolbar */}
            <div className="bg-white p-3 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLaserScan(!showLaserScan)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    showLaserScan
                      ? 'bg-[#0037b0] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">document_scanner</span>
                  <span>Laser Beam</span>
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    showHeatmap
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">grid_4x4</span>
                  <span>Tamper Heatmap</span>
                </button>

                <button
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    highContrastMode
                      ? 'bg-[#0b1c30] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">contrast</span>
                  <span>B&W Forensic Scan</span>
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-[#eff4ff] p-0.5 rounded-lg border border-[#c4c5d7]/40">
                <button
                  onClick={() => setZoomLevel(Math.max(100, zoomLevel - 25))}
                  className="w-7 h-7 flex items-center justify-center text-[#434655] hover:text-[#0b1c30] font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="text-[11px] font-mono font-bold px-1.5 text-[#0037b0]">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 25))}
                  className="w-7 h-7 flex items-center justify-center text-[#434655] hover:text-[#0b1c30] font-bold"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>

            {/* Document Surface Container */}
            <div className="bg-[#cbdbf5]/50 p-4 rounded-2xl border border-[#c4c5d7]/60 shadow-inner flex justify-center overflow-auto max-h-[640px]">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className={`relative w-full max-w-[620px] aspect-[1/1.38] rounded-xl shadow-2xl transition-all duration-200 p-6 select-none border-4 border-[#0b1c30]/20 ${
                  highContrastMode ? 'bg-white text-black filter grayscale contrast-200' : 'bg-[#fffdf9] text-[#1c1917]'
                }`}
              >
                {/* Guilloche border watermarks */}
                <div className="absolute inset-2 border-2 border-dashed border-[#0037b0]/20 rounded-lg pointer-events-none"></div>

                {/* Laser Scanning Animation Beam */}
                {showLaserScan && (
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0037b0] to-transparent shadow-[0_0_12px_#0037b0] animate-pulse z-20 pointer-events-none top-1/3"></div>
                )}

                {/* Tamper Heatmap Overlay */}
                {showHeatmap && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px] z-10 pointer-events-none rounded-lg flex items-center justify-center">
                    <div className="bg-[#213145]/90 text-white font-mono text-[11px] px-3 py-1 rounded-full shadow-lg border border-white/20">
                      Forensic Confidence: 99.8% Tamper Proof
                    </div>
                  </div>
                )}

                {/* Physical Certificate Header */}
                <div className="text-center pb-4 border-b-2 border-[#0037b0]/40">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-[#0037b0] text-white flex items-center justify-center font-bold text-[12px]">
                      SBI
                    </div>
                    <span className="text-[16px] font-bold uppercase tracking-wider text-[#0037b0] font-['Public_Sans']">
                      State Bank of India
                    </span>
                  </div>
                  <div className="text-[10px] uppercase font-mono tracking-wide text-[#565e74]">
                    Scheduled Commercial Bank • Reserve Bank of India Licensed
                  </div>
                  <div className="text-[12px] font-bold text-[#0b1c30] mt-1 uppercase font-serif tracking-widest border-t border-b border-[#0037b0]/20 py-0.5">
                    Fixed Deposit Security Receipt (Special Term Deposit)
                  </div>
                </div>

                {/* Body Content with OCR Bounding Box Anchors */}
                <div className="relative mt-4 flex flex-col gap-4 text-[12px]">
                  {/* Row 1: FDR No & Branch */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-[#747686] uppercase block">Branch Name</span>
                      <span className="font-semibold text-[#0b1c30]">Bhopal Main Branch, TT Nagar</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#747686] uppercase block">FDR Reg. Number</span>
                      <span className="font-mono font-bold text-[13px] text-[#0037b0]">
                        {selectedInstrument.fdrNumber}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Institution & Account */}
                  <div className="bg-[#eff4ff]/60 p-2.5 rounded-lg border border-[#c4c5d7]/30 flex flex-col gap-1">
                    <span className="text-[10px] text-[#747686] uppercase">Depositor / Institution Name</span>
                    <span className="font-bold text-[#0b1c30] leading-snug">
                      {selectedInstrument.institutionName}
                    </span>
                    <div className="flex justify-between text-[11px] font-mono text-[#434655] pt-1 border-t border-[#c4c5d7]/20">
                      <span>A/C No: {selectedInstrument.accountNumber}</span>
                      <span>IFSC: {selectedInstrument.ifsc}</span>
                    </div>
                  </div>

                  {/* Row 3: Principal Amount in Words and Digits */}
                  <div className="p-3 rounded-lg border-2 border-red-300 bg-red-50/50 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-red-800 uppercase font-bold font-mono">
                        Principal Deposit Sum
                      </span>
                      <span className="font-mono font-bold text-[16px] text-red-700">
                        ₹ 15,00,000 /-
                      </span>
                    </div>
                    <span className="text-[11px] text-red-900 italic font-serif">
                      (Rupees Fifteen Lakhs Only)
                    </span>
                    <span className="text-[10px] text-red-700 font-mono font-semibold">
                      * AICTE APH Mandate: ₹35,00,000 (Shortfall: ₹20,00,000)
                    </span>
                  </div>

                  {/* Row 4: Joint Holder Mandate */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-300">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                      Statutory AICTE Joint Lien Endorsement
                    </span>
                    <span className="text-[12px] font-semibold text-emerald-950 font-serif">
                      "Pledged to AICTE in the joint name of Member Secretary, AICTE and President, Vindhya Educational Trust"
                    </span>
                  </div>

                  {/* Row 5: Tenor & Dates */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-white p-2 rounded-lg border border-[#c4c5d7]/30">
                    <div>
                      <span className="text-[9px] text-[#747686] block">ISSUE DATE</span>
                      <span className="font-bold text-[#0b1c30]">{selectedInstrument.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#747686] block">TENOR</span>
                      <span className="font-bold text-[#0037b0]">{selectedInstrument.tenorMonths} Mos (10 Yrs)</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#747686] block">MATURITY DATE</span>
                      <span className="font-bold text-[#0b1c30]">{selectedInstrument.maturityDate}</span>
                    </div>
                  </div>

                  {/* Bottom Stamps & Dual Signature Blocks */}
                  <div className="pt-3 border-t border-[#c4c5d7]/40 flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0037b0] flex flex-col items-center justify-center text-[#0037b0] rotate-[-8deg] opacity-80">
                        <span className="text-[8px] font-bold uppercase">SBI TT NAGAR</span>
                        <span className="text-[7px]">LIEN MARKED</span>
                        <span className="text-[7px]">12/08/2022</span>
                      </div>
                      <span className="text-[9px] text-[#747686] mt-1 font-mono">Branch Seal</span>
                    </div>

                    <div className="text-right">
                      <div className="font-serif italic text-[14px] text-blue-900 border-b border-blue-900/60 pb-0.5">
                        M. S. Narayanan
                      </div>
                      <span className="text-[10px] text-[#434655] block font-mono">
                        Chief Manager (Nodal)
                      </span>
                      <span className="text-[9px] text-[#747686] block font-mono">
                        DSC Serial: 482019-IN
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clickable Interactive Bounding Boxes rendered over the document */}
                {SCRUTINY_BOUNDING_BOXES.map((box) => {
                  const isSelected = selectedBBox.id === box.id;
                  const isMismatch = box.status === 'MISMATCH';

                  return (
                    <button
                      key={box.id}
                      onClick={() => setSelectedBBox(box)}
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        height: box.height,
                      }}
                      className={`absolute z-30 rounded transition-all cursor-pointer flex items-center justify-between px-1.5 ${
                        isSelected
                          ? isMismatch
                            ? 'ring-2 ring-red-600 bg-red-500/20'
                            : 'ring-2 ring-[#0037b0] bg-[#0037b0]/20'
                          : isMismatch
                          ? 'border-2 border-red-500/80 bg-red-500/10 hover:bg-red-500/20'
                          : 'border-2 border-[#0037b0]/60 bg-[#0037b0]/5 hover:bg-[#0037b0]/15'
                      }`}
                      title={`${box.label}: ${box.value}`}
                    >
                      <span
                        className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded shadow-xs ${
                          isMismatch ? 'bg-red-600 text-white' : 'bg-[#0037b0] text-white'
                        }`}
                      >
                        {box.confidence}%
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[13px] text-[#0037b0]">
                          pinch
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: OCR Bounding Box Inspector & Triage Notes */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Live Bounding Box Inspector Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#0037b0] text-[20px]">
                    frame_inspect
                  </span>
                  <h3 className="text-[14px] font-bold text-[#0b1c30]">OCR Tensor Inspector</h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedBBox.status === 'MISMATCH'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {selectedBBox.status}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#747686] block">
                    Inspection Target Field
                  </span>
                  <span className="text-[13px] font-bold text-[#0b1c30]">{selectedBBox.label}</span>
                </div>

                <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#c4c5d7]/40">
                  <span className="text-[10px] uppercase font-mono text-[#747686] block">
                    Extracted Optical Text
                  </span>
                  <span className="text-[14px] font-mono font-bold text-[#0037b0] break-words">
                    {selectedBBox.value}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-white p-2 rounded border border-[#c4c5d7]/30">
                    <span className="text-[9px] text-[#747686] block">OCR CONFIDENCE</span>
                    <span className="font-bold text-emerald-700 text-[13px]">
                      {selectedBBox.confidence}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-[#c4c5d7]/30">
                    <span className="text-[9px] text-[#747686] block">TENSOR TUPLE</span>
                    <span className="font-semibold text-[#434655] text-[11px]">
                      {selectedBBox.tensor}
                    </span>
                  </div>
                </div>

                {selectedBBox.field === 'amount' && (
                  <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-[#ba1a1a] text-[11px] flex flex-col gap-1">
                    <div className="font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">crisis_alert</span>
                      <span>Statutory Mismatch Alert</span>
                    </div>
                    <span>
                      Declared: <strong>₹35,00,000</strong> vs Extracted: <strong>₹15,00,000</strong>
                    </span>
                    <span className="font-mono font-semibold">
                      Deficit: ₹20,00,000 below mandatory APH 2026 threshold!
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons inside Inspector */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#c4c5d7]/30">
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0037b0] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>Override / Correct OCR Value</span>
                </button>
                <button
                  onClick={handleDispatchBankRequest}
                  className="w-full py-2 px-3 rounded-lg bg-white border border-[#c4c5d7]/50 text-[#0b1c30] hover:bg-[#eff4ff] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Re-Query Bank CBS SFMS</span>
                </button>
              </div>
            </div>

            {/* Forensic Triage Notes */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0037b0] text-[18px]">
                  security
                </span>
                <h4 className="text-[13px] font-bold text-[#0b1c30]">Forensic Triage Checklist</h4>
              </div>

              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded bg-[#eff4ff]/60">
                  <span className="text-[#434655]">Direct Bank Scan DPI:</span>
                  <span className="font-mono font-bold text-[#0b1c30]">300 DPI Certified</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#eff4ff]/60">
                  <span className="text-[#434655]">Lien Endorsement Seal:</span>
                  <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check</span> Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#eff4ff]/60">
                  <span className="text-[#434655]">Branch Signature Token:</span>
                  <span className="font-mono font-bold text-[#0b1c30]">ePass2003 DSC Active</span>
                </div>
              </div>

              <span className="text-[10px] text-[#747686] italic">
                * Note: Automated OCR heuristics require officer digital signature to release holds.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5-State Reconciliation Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">
              5-State Reconciliation Triangulation Matrix
            </h3>
            <p className="text-[12px] text-[#434655]">
              Cross-verifying Institutional Declaration, OCR Machine Tensors, and Core Bank API ledger
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Row 1: FDR Number */}
            <div
              onClick={() => handleSyncHighlight('fdr')}
              className="p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-[#c4c5d7]/40 cursor-pointer transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase font-mono text-[#0b1c30]">
                  Row 1: FDR Registration Number
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  MATCH
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[9px] text-[#747686] block">DECLARED</span>
                  <span className="font-bold text-[#0b1c30]">FDR-SBI-9928172</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block">MACHINE OCR</span>
                  <span className="font-bold text-[#0037b0]">9928172 (99.8%)</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block">BANK GATEWAY</span>
                  <span className="font-bold text-emerald-700">FDR-SBI-9928172</span>
                </div>
              </div>
            </div>

            {/* Row 2: Principal Amount (CRITICAL MISMATCH) */}
            <div
              onClick={() => handleSyncHighlight('amount')}
              className="p-3.5 rounded-xl bg-red-50/80 hover:bg-red-50 border-2 border-red-400 cursor-pointer transition-all flex flex-col gap-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase font-mono text-red-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">crisis_alert</span>
                  Row 2: Principal Deposit Amount
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-600 text-white flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">cancel</span>
                  CRITICAL MISMATCH ⚠️
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[9px] text-red-800 block">DECLARED</span>
                  <span className="font-bold text-red-700 text-[14px]">₹35,00,000</span>
                </div>
                <div>
                  <span className="text-[9px] text-red-800 block">MACHINE OCR</span>
                  <span className="font-bold text-[#0b1c30] text-[14px]">₹15,00,000</span>
                </div>
                <div>
                  <span className="text-[9px] text-red-800 block">BANK CONFIRMED</span>
                  <span className="font-bold text-red-700 text-[14px]">₹15,00,000</span>
                </div>
              </div>
              <div className="text-[11px] text-red-800 bg-white/80 p-2 rounded border border-red-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-red-700">report</span>
                <span>
                  Declared deficit of <strong>₹20,00,000</strong> below mandatory statutory deposit
                  tier for Engineering programs!
                </span>
              </div>
            </div>

            {/* Row 3: IFSC Code */}
            <div
              onClick={() => handleSyncHighlight('ifsc')}
              className="p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-[#c4c5d7]/40 cursor-pointer transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase font-mono text-[#0b1c30]">
                  Row 3: IFSC Code & Branch
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  MATCH
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[9px] text-[#747686] block">DECLARED</span>
                  <span className="font-bold text-[#0b1c30]">SBIN0004210</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block">MACHINE OCR</span>
                  <span className="font-bold text-[#0037b0]">SBIN0004210 (100%)</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block">BANK REGISTRY</span>
                  <span className="font-bold text-emerald-700">SBIN0004210</span>
                </div>
              </div>
            </div>

            {/* Row 4: Joint Holder Title */}
            <div
              onClick={() => handleSyncHighlight('lien')}
              className="p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-[#c4c5d7]/40 cursor-pointer transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase font-mono text-[#0b1c30]">
                  Row 4: Joint Holder Mandate
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  VERIFIED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[9px] text-[#747686] block uppercase font-mono">DECLARED</span>
                  <span className="font-semibold text-[#0b1c30]">
                    Member Secretary AICTE & President Vindhya
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block uppercase font-mono">OCR EXTRACTION</span>
                  <span className="font-semibold text-[#0037b0]">
                    Member Secretary, AICTE (96.5% confidence)
                  </span>
                </div>
              </div>
            </div>

            {/* Row 5: Tenor & Maturity */}
            <div
              onClick={() => handleSyncHighlight('issue')}
              className="p-3.5 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] border border-[#c4c5d7]/40 cursor-pointer transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase font-mono text-[#0b1c30]">
                  Row 5: Tenor & Maturity Schedule
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  10 YR TERM VERIFIED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[9px] text-[#747686] block uppercase">DEPOSIT TERM</span>
                  <span className="font-bold text-[#0b1c30]">120 Months (2022 - 2032)</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#747686] block uppercase">LIEN LOCK TYPE</span>
                  <span className="font-bold text-emerald-700">Auto-Roll Inactive (Statutory)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflict Resolution Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-[#c4c5d7]/40">
            <button
              onClick={handleTriggerHold}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Issue Statutory Show-Cause Notice</span>
            </button>
            <button
              onClick={() => setShowOverrideModal(true)}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Commit Officer Override</span>
            </button>
            <button
              onClick={handleDispatchBankRequest}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Re-Query Bank Gateway</span>
            </button>
          </div>
        </div>
      )}

      {/* Dual Signatory Deck Tab */}
      {activeTab === 'dual-sign' && (
        <div className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">
              Dual-Signatory Cryptographic Authorization Deck
            </h3>
            <p className="text-[12px] text-[#434655]">
              Simultaneous attestation by AICTE Scrutiny Directorate and Bank Nodal Officer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Signatory 1: AICTE Officer */}
            <div className="p-4 rounded-xl border border-[#c4c5d7]/50 bg-[#eff4ff]/50 flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0037b0] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#747686] uppercase block">
                    Party 1: Statutory Authority
                  </span>
                  <span className="text-[13px] font-bold text-[#0b1c30]">
                    AICTE Scrutiny Officer
                  </span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#c4c5d7]/30 flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#747686]">OFFICER:</span>
                  <span className="font-bold text-[#0b1c30]">Rajesh V. Sharma</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">ID / TOKEN:</span>
                  <span className="text-[#0037b0]">CRO-8821 (ePass2003)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">STATUS:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">check</span> Token Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Signatory 2: Bank Nodal Officer */}
            <div className="p-4 rounded-xl border border-[#c4c5d7]/50 bg-[#eff4ff]/50 flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#747686] uppercase block">
                    Party 2: Scheduled Bank
                  </span>
                  <span className="text-[13px] font-bold text-[#0b1c30]">
                    State Bank of India Nodal Desk
                  </span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#c4c5d7]/30 flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#747686]">MANAGER:</span>
                  <span className="font-bold text-[#0b1c30]">M. S. Narayanan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">BRANCH IFSC:</span>
                  <span className="text-[#0037b0]">SBIN0004210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">GATEWAY:</span>
                  <span className="text-emerald-700 font-bold">SFMS SFTP Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Seal Preview */}
          <div className="bg-[#213145] text-white p-4 rounded-xl border border-[#747686]/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#cad3ff]">
              <span>SHA-256 IMMUTABLE AUTHORIZATION HASH</span>
              <span className="text-emerald-400 font-bold">READY TO COMMIT</span>
            </div>
            <div className="font-mono text-[12px] bg-black/40 p-2.5 rounded text-[#dce1ff] break-all border border-white/10">
              0x92f8a110bbceb910245089128372651019283746501928374650192837465109
            </div>
          </div>

          {/* Dual-Sign Execution Button */}
          <button
            onClick={() => onDualSignCommit(selectedInstrument.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px] text-[#ffdcc3]">verified</span>
            <span>Authorize Dual-Signatory Mandate & Stamp Cryptographic Seal</span>
          </button>
        </div>
      )}

      {/* Officer OCR Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in fade-in zoom-in-95 border-t-4 border-[#0037b0]">
            <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#e5eeff] text-[#0037b0] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0b1c30]">
                    Override / Correct OCR Observation
                  </h3>
                  <span className="text-[11px] font-mono text-[#434655]">
                    Officer Token: CRO-8821 | AICTE-FDR-REG-2026
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#434655] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#ffdcc3] text-[#2f1500] p-3 rounded-xl text-[12px] flex items-start gap-2 border border-[#ffb77d]">
              <span className="material-symbols-outlined text-[#6b3700] text-[18px] shrink-0 mt-0.5">
                gavel
              </span>
              <span>
                Regulatory Mandate: Officer corrections require a statutory reason code and at
                least 15 characters of remarks to commit to the Central Immutable Ledger.
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase font-mono text-[#434655] block mb-1">
                  Target Field
                </label>
                <div className="bg-[#eff4ff] p-2.5 rounded-lg font-mono text-[13px] font-bold text-[#0b1c30] flex justify-between">
                  <span>Row 2: Principal Deposit Amount</span>
                  <span className="text-red-700">Current: ₹15,00,000</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                    Rectified Numeric Value (INR) *
                  </label>
                  <input
                    type="text"
                    value={overrideValue}
                    onChange={(e) => setOverrideValue(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 font-mono font-bold text-[14px] text-[#0b1c30] border border-[#c4c5d7]/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0037b0]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                    Reason Code *
                  </label>
                  <select
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] text-[#0b1c30] border border-[#c4c5d7]/50 focus:outline-none focus:bg-white"
                  >
                    <option value="Scan Smudge / Stamp Overlap">Scan Smudge / Stamp Overlap</option>
                    <option value="Annexure Page 2 Cross-Verification">
                      Annexure Page 2 Cross-Verification
                    </option>
                    <option value="Bank Manager Direct Confirmation">
                      Bank Manager Direct Confirmation
                    </option>
                    <option value="Handwritten Marginalia Interference">
                      Handwritten Marginalia Interference
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30]">
                    Mandatory Officer Justification *
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      overrideJustification.length >= 15 ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {overrideJustification.length} / 15 min chars
                  </span>
                </div>
                <textarea
                  value={overrideJustification}
                  onChange={(e) => setOverrideJustification(e.target.value)}
                  placeholder="Enter statutory rationale (e.g. Cross-verified with physical seal on annexure page 2 and certified by Branch Manager)..."
                  rows={3}
                  className="w-full bg-[#eff4ff] rounded-lg p-2.5 text-[12px] text-[#0b1c30] placeholder-[#747686] border border-[#c4c5d7]/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0037b0] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#c4c5d7]/30">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-semibold text-[13px] hover:bg-[#dce9ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={overrideJustification.trim().length < 15}
                onClick={handleOverrideSubmit}
                className="flex-1 py-2.5 rounded-xl bg-[#0037b0] text-white font-semibold text-[13px] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Commit Override</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
