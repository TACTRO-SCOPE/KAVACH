import React from 'react';
import {
  FdrInstrument,
  PersonaRole,
  FdrStatus,
  NavigationTab,
} from '../types/index.ts';
import { calculatePortfolioMetrics, simulateMaturityStatus } from '../utils/regulatoryRules.ts';

interface PortfolioViewProps {
  instruments: FdrInstrument[];
  activeRole: PersonaRole;
  onRoleChange: (role: PersonaRole) => void;
  offsetDays: number;
  onOffsetChange: (days: number, label: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectInstrumentForScrutiny: (fdr: FdrInstrument) => void;
  onOpenReportModal: (fdr?: FdrInstrument) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onJumpScenario: (scenarioId: number) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  instruments,
  activeRole,
  onRoleChange,
  offsetDays,
  onOffsetChange,
  onNavigateTab,
  onSelectInstrumentForScrutiny,
  onOpenReportModal,
  onShowToast,
  onJumpScenario,
}) => {
  const [statusFilter, setStatusFilter] = React.useState<FdrStatus>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  const metrics = calculatePortfolioMetrics(instruments, offsetDays);

  const roles: { id: PersonaRole; label: string }[] = [
    { id: 'HQ_ADMIN', label: 'HQ_ADMIN (National)' },
    { id: 'SCRUTINY_OFFICER', label: 'Scrutiny Officer' },
    { id: 'REGIONAL_OFFICER', label: 'Regional Officer (CRO)' },
    { id: 'INSTITUTION_USER', label: 'Institution (PID: 1-402918210)' },
    { id: 'BANK_USER', label: 'Bank (SBI Bhopal Main)' },
    { id: 'VIGILANCE_LEGAL', label: 'Vigilance & Legal' },
    { id: 'FINANCE_OFFICER', label: 'Finance Officer' },
    { id: 'AUDITOR', label: 'Auditor (CAG-Empanelled)' },
  ];

  const filteredInstruments = instruments.filter((inst) => {
    const matchesFilter = statusFilter === 'ALL' || inst.status === statusFilter;
    const matchesSearch =
      inst.fdrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.pid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: FdrStatus) => {
    switch (status) {
      case 'ACTIVE_LIEN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            ACTIVE LIEN
          </span>
        );
      case 'DISCREPANCY':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-red-50 text-red-700 border border-red-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">warning</span>
            DISCREPANCY HOLD
          </span>
        );
      case 'PENDING_BANK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">pending</span>
            PENDING BANK
          </span>
        );
      case 'MATURED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-blue-50 text-blue-800 border border-blue-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">alarm</span>
            MATURED (ACTION REQ)
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-purple-50 text-purple-800 border border-purple-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">gavel</span>
            DISPUTED LIEN
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-700 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  const getSimulatedDateText = () => {
    if (offsetDays === 0) return '30 Oct 2026 (Live Anchor)';
    if (offsetDays === 30) return '29 Nov 2026 (+30d Offset)';
    if (offsetDays === 60) return '29 Dec 2026 (+60d Offset)';
    if (offsetDays === 90) return '28 Jan 2027 (+90d Offset)';
    return `Simulated (+${offsetDays}d)`;
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
      {/* SIH Evaluator Top Bar & Control Console */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#c4c5d7]/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0037b0] animate-ping"></span>
            <span className="text-[12px] font-bold text-[#0037b0] uppercase tracking-wider font-mono">
              SIH 2026 Jury Mode Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#434655] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#c4c5d7]/30 font-semibold">
              Build v4.2.9-prod
            </span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Merkle Tree Valid
            </span>
          </div>
        </div>

        {/* 8-Role Persona Switcher Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] text-[#434655] font-semibold">
              Evaluator Persona (Active Stakeholder Authority):
            </span>
            <span className="text-[11px] font-mono font-bold text-[#0037b0] bg-[#e5eeff] px-2 py-0.5 rounded">
              {activeRole}
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {roles.map((r) => {
              const isSelected = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    onRoleChange(r.id);
                    onShowToast(`Persona switched to: ${r.id}`, 'manage_accounts');
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#0037b0] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#dce9ff]'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time-Travel Demo Clock Simulator */}
        <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#c4c5d7]/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">
                history_toggle_off
              </span>
              <span className="text-[12px] text-[#0b1c30] font-bold">
                Executive Time-Travel Clock Simulator
              </span>
            </div>
            <span className="text-[12px] font-mono text-[#0037b0] font-bold bg-white px-2 py-0.5 rounded shadow-xs">
              {getSimulatedDateText()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            <button
              onClick={() => onOffsetChange(0, '30 Oct 2026 (Live Anchor)')}
              className={`py-1.5 px-2 text-center rounded text-[11px] font-semibold transition-all ${
                offsetDays === 0
                  ? 'bg-[#0037b0] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              Real (Live)
            </button>
            <button
              onClick={() => onOffsetChange(30, '29 Nov 2026 (+30d)')}
              className={`py-1.5 px-2 text-center rounded text-[11px] font-semibold transition-all ${
                offsetDays === 30
                  ? 'bg-[#0037b0] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              +30 Days
            </button>
            <button
              onClick={() => onOffsetChange(60, '29 Dec 2026 (+60d)')}
              className={`py-1.5 px-2 text-center rounded text-[11px] font-semibold transition-all ${
                offsetDays === 60
                  ? 'bg-[#0037b0] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              +60 Days
            </button>
            <button
              onClick={() => onOffsetChange(90, '28 Jan 2027 (+90d)')}
              className={`py-1.5 px-2 text-center rounded text-[11px] font-semibold transition-all ${
                offsetDays === 90
                  ? 'bg-[#0037b0] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff]'
              }`}
            >
              +90 Days
            </button>
            <button
              onClick={() => onOffsetChange(0, '30 Oct 2026 (Live Anchor)')}
              className="py-1.5 px-2 text-center rounded text-[11px] font-medium bg-white/70 text-[#434655] hover:text-[#0b1c30] hover:bg-white"
            >
              Reset Live
            </button>
          </div>
        </div>

        {/* Simulation Alert Banner */}
        {offsetDays > 0 && (
          <div className="bg-[#ffdcc3] text-[#2f1500] p-3 rounded-xl flex items-start gap-2.5 border border-[#ffb77d] shadow-xs animate-in fade-in duration-150">
            <span className="material-symbols-outlined text-[#6b3700] text-[20px] shrink-0 mt-0.5">
              update
            </span>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold leading-tight font-mono">
                TIME-TRAVEL SIMULATION ACTIVE: +{offsetDays} Days Offset
              </span>
              <span className="text-[11px] text-[#6b3700] mt-0.5 leading-normal">
                Maturity triggers advanced by {offsetDays} days. {metrics.expiringInWindowCount}{' '}
                instruments marked expiring within upcoming regulatory window. Sandbox recalculation
                in effect.
              </span>
            </div>
          </div>
        )}

        {/* 7-Scenario Quick-Jump Evaluator Pills */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#434655] font-mono">
            SIH Quick-Jump Scenarios:
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1.5">
            {[
              { id: 1, label: 'S1 New Submission', role: 'INSTITUTION_USER' },
              { id: 2, label: 'S2 Discrepancy Hold', role: 'SCRUTINY_OFFICER' },
              { id: 3, label: 'S3 Bank Verification', role: 'BANK_USER' },
              { id: 4, label: 'S4 Time-Travel +60d', role: 'FINANCE_OFFICER' },
              { id: 5, label: 'S5 Renewal Lineage', role: 'REGIONAL_OFFICER' },
              { id: 6, label: 'S6 Release & NOC', role: 'HQ_ADMIN' },
              { id: 7, label: 'S7 CAG Audit Test', role: 'AUDITOR' },
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => onJumpScenario(sc.id)}
                className="shrink-0 px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[11px] font-mono border border-[#c4c5d7]/30 shadow-xs flex items-center gap-1 transition-all"
              >
                <span className="text-[#0037b0] font-bold">S{sc.id}</span>
                <span>{sc.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Metric Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[18px] font-bold text-[#0b1c30] font-['Public_Sans']">
            National Portfolio Telemetry
          </h2>
          <span className="text-[11px] font-mono text-[#434655] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Live Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Card 1: Total Exposure */}
          <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#434655] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Total Exposure</span>
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">
                account_balance
              </span>
            </div>
            <div>
              <div className="text-[20px] font-bold font-mono text-[#0037b0] leading-tight">
                ₹{metrics.totalExposureCrores} Cr
              </div>
              <span className="text-[10px] text-[#434655]">
                {metrics.totalInstruments} instruments pledged
              </span>
            </div>
          </div>

          {/* Card 2: Active Verified Liens */}
          <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#434655] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Active Liens</span>
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                verified
              </span>
            </div>
            <div>
              <div className="text-[20px] font-bold font-mono text-emerald-700 leading-tight">
                {metrics.activeLienCount}
              </div>
              <span className="text-[10px] text-emerald-700">100% GIGW Certified</span>
            </div>
          </div>

          {/* Card 3: Dual-Sign Pending */}
          <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#434655] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Pending Bank</span>
              <span className="material-symbols-outlined text-amber-600 text-[18px]">pending</span>
            </div>
            <div>
              <div className="text-[20px] font-bold font-mono text-amber-700 leading-tight">
                {metrics.pendingBankCount}
              </div>
              <span className="text-[10px] text-amber-700">Awaiting SFMS 798</span>
            </div>
          </div>

          {/* Card 4: Discrepancy Holds */}
          <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#434655] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Discrepancy</span>
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">warning</span>
            </div>
            <div>
              <div className="text-[20px] font-bold font-mono text-[#ba1a1a] leading-tight">
                {metrics.discrepancyCount}
              </div>
              <span className="text-[10px] text-[#ba1a1a]">AI Deficit flagged</span>
            </div>
          </div>

          {/* Card 5: Disputed Breaches */}
          <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#434655] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Disputes</span>
              <span className="material-symbols-outlined text-purple-600 text-[18px]">gavel</span>
            </div>
            <div>
              <div className="text-[20px] font-bold font-mono text-purple-700 leading-tight">
                {metrics.disputedCount}
              </div>
              <span className="text-[10px] text-purple-700">Lien clause violations</span>
            </div>
          </div>

          {/* Card 6: CAG Integrity */}
          <div className="bg-white p-3.5 rounded-xl border border-[#c4c5d7]/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#434655] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">CAG Audit</span>
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">
                verified_user
              </span>
            </div>
            <div>
              <div className="text-[20px] font-bold font-mono text-[#0037b0] leading-tight">
                {metrics.cagIntegrityIndex}%
              </div>
              <span className="text-[10px] text-[#434655]">SHA-256 Validated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Instrument Ledger */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">
              Regulatory FDR Instrument Ledger
            </h3>
            <p className="text-[12px] text-[#434655]">
              Real-time multi-bureau ledger monitoring and scrutiny pipeline
            </p>
          </div>

          {/* Actions & Submit Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('submit')}
              className="h-9 px-3 rounded-lg bg-[#0037b0] hover:bg-[#1d4ed8] text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Intake New FDR</span>
            </button>
            <button
              onClick={() => onOpenReportModal()}
              className="h-9 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span className="hidden sm:inline">Export Audit</span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-[#c4c5d7]/30">
          {/* Status Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'ALL', label: 'All Instruments' },
              { id: 'ACTIVE_LIEN', label: 'Active Lien' },
              { id: 'DISCREPANCY', label: 'Discrepancy Hold' },
              { id: 'PENDING_BANK', label: 'Pending Bank' },
              { id: 'MATURED', label: 'Matured' },
              { id: 'DISPUTED', label: 'Disputed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as FdrStatus)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  statusFilter === f.id
                    ? 'bg-[#0037b0] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#747686]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FDR No, PID, College..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#eff4ff] border border-[#c4c5d7]/40 text-[12px] text-[#0b1c30] placeholder-[#747686] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0037b0]"
            />
          </div>
        </div>

        {/* Instruments Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredInstruments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#434655] flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-[#747686]">
                find_in_page
              </span>
              <p className="text-[13px] font-medium">No instruments match the current filters.</p>
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[12px] text-[#0037b0] font-semibold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredInstruments.map((inst) => {
              const maturity = simulateMaturityStatus(inst.maturityDate, offsetDays);

              return (
                <div
                  key={inst.id}
                  className="p-4 rounded-xl border border-[#c4c5d7]/50 hover:border-[#0037b0]/50 bg-[#eff4ff]/30 hover:bg-[#eff4ff]/60 transition-all shadow-xs flex flex-col justify-between gap-3"
                >
                  {/* Top Bar: Bank Logo & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#c4c5d7]/40 flex items-center justify-center text-[#0037b0] shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">account_balance</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold font-mono text-[#0b1c30]">
                            {inst.fdrNumber}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#434655] border border-[#c4c5d7]/40">
                            {inst.region}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#434655] block truncate max-w-[200px]">
                          {inst.bankName} • {inst.ifsc}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(inst.status)}
                  </div>

                  {/* Institution Details */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#c4c5d7]/30 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#434655] font-mono">PID: {inst.pid}</span>
                      <span className="text-[#0037b0] font-mono font-semibold">
                        {inst.tenorMonths} Mos ({inst.interestRate}%)
                      </span>
                    </div>
                    <div className="text-[12px] font-bold text-[#0b1c30] leading-tight line-clamp-1">
                      {inst.institutionName}
                    </div>
                  </div>

                  {/* Principal & Discrepancy Note */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#747686] block text-[10px] uppercase font-mono">
                        Principal Secured
                      </span>
                      <span className="text-[15px] font-bold font-mono text-[#0037b0]">
                        ₹{(inst.principalAmount / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>
                    <div>
                      <span className="text-[#747686] block text-[10px] uppercase font-mono">
                        Maturity Horizon
                      </span>
                      <span
                        className={`text-[12px] font-mono font-bold block ${
                          maturity.isOverdue
                            ? 'text-red-700'
                            : maturity.isExpiringInWindow
                            ? 'text-amber-700'
                            : 'text-[#0b1c30]'
                        }`}
                      >
                        {inst.maturityDate} ({maturity.daysRemaining}d left)
                      </span>
                    </div>
                  </div>

                  {inst.discrepancyNote && (
                    <div className="text-[11px] text-[#ba1a1a] bg-red-50 p-2 rounded border border-red-200 flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">
                        report
                      </span>
                      <span>{inst.discrepancyNote}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-[#c4c5d7]/30">
                    <button
                      onClick={() => {
                        onSelectInstrumentForScrutiny(inst);
                        onNavigateTab('scrutiny');
                      }}
                      className="py-1.5 px-2 rounded-lg bg-[#0037b0] text-white hover:bg-[#1d4ed8] text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">fact_check</span>
                      <span>Scrutinize</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab('release-lineage')}
                      className="py-1.5 px-2 rounded-lg bg-white border border-[#c4c5d7]/50 text-[#0b1c30] hover:bg-[#eff4ff] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">account_tree</span>
                      <span>Lineage</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab('bank-gateway')}
                      className="py-1.5 px-2 rounded-lg bg-white border border-[#c4c5d7]/50 text-[#0b1c30] hover:bg-[#eff4ff] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                      <span>CBS Sync</span>
                    </button>

                    <button
                      onClick={() => onOpenReportModal(inst)}
                      className="py-1.5 px-2 rounded-lg bg-white border border-[#c4c5d7]/50 text-[#0b1c30] hover:bg-[#eff4ff] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">description</span>
                      <span>GIGW PDF</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
