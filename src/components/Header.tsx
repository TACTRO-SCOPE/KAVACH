import React from 'react';
import { PersonaRole } from '../types/index.ts';

interface HeaderProps {
  activeRole: PersonaRole;
  onRoleChange: (role: PersonaRole) => void;
  offsetDays: number;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  offsetDays,
  unreadCount,
  onOpenNotifications,
  onOpenReportModal,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const roles: { role: PersonaRole; label: string; desc: string }[] = [
    { role: 'HQ_ADMIN', label: 'HQ Admin (National)', desc: 'AICTE Apex Regulatory Directorate' },
    { role: 'SCRUTINY_OFFICER', label: 'Scrutiny Officer', desc: 'Regional Office Scrutiny Desk' },
    { role: 'REGIONAL_OFFICER', label: 'Regional Officer (CRO)', desc: 'Central Regional Directorate' },
    { role: 'INSTITUTION_USER', label: 'Institution (PID: 1-402918210)', desc: 'Vindhya Institute Principal' },
    { role: 'BANK_USER', label: 'Bank Nodal (SBI Bhopal)', desc: 'Scheduled Commercial Bank Gateway' },
    { role: 'VIGILANCE_LEGAL', label: 'Vigilance & Legal', desc: 'Statutory Disputes & Encashment' },
    { role: 'FINANCE_OFFICER', label: 'Finance Officer', desc: 'Treasury & Liquidity Horizon' },
    { role: 'AUDITOR', label: 'Auditor (CAG-Empanelled)', desc: 'Comptroller & Auditor General' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#c4c5d7]/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand & Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0037b0] flex items-center justify-center text-white shadow-sm ring-2 ring-[#cad3ff] shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">assured_workload</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#0037b0] uppercase font-mono truncate">
                  AICTE • FDR-KAVACH
                </span>
                <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-[#dae2fd] text-[#131b2e] font-mono font-semibold">
                  GIGW 3.0
                </span>
              </div>
              <h1 className="text-[14px] sm:text-[17px] font-bold text-[#0b1c30] leading-tight truncate font-['Public_Sans']">
                Regulatory FinTech Portal
              </h1>
            </div>
          </div>

          {/* Quick Status Badges (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 px-2.5 rounded-lg bg-[#eff4ff] border border-[#c4c5d7]/40 flex items-center gap-1.5 text-[#0b1c30]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[12px] font-mono font-medium">T+0 CBS Live</span>
            </div>

            <div className="h-8 px-2.5 rounded-lg bg-[#eff4ff] border border-[#c4c5d7]/40 flex items-center gap-1.5 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#0037b0] text-[15px]">verified_user</span>
              <span className="text-[12px] font-medium">Dual-Sign Ready</span>
            </div>

            {offsetDays > 0 && (
              <div className="h-8 px-2.5 rounded-lg bg-[#ffdcc3] border border-[#ffb77d] flex items-center gap-1.5 text-[#6b3700]">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span className="text-[12px] font-mono font-bold">+{offsetDays}d Sim</span>
              </div>
            )}
          </div>

          {/* User Controls & Persona Switcher */}
          <div className="flex items-center gap-2">
            {/* GIGW Export Quick Button */}
            <button
              onClick={onOpenReportModal}
              title="View GIGW 3.0 Statutory Report"
              className="hidden sm:flex h-9 px-3 rounded-lg bg-white border border-[#c4c5d7]/50 text-[#0b1c30] hover:bg-[#e5eeff] text-[12px] font-semibold items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0037b0]">description</span>
              <span>GIGW Report</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-lg bg-white border border-[#c4c5d7]/40 flex items-center justify-center text-[#434655] hover:text-[#0037b0] hover:bg-[#e5eeff] transition-colors"
              aria-label="View notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Active Persona Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="h-9 px-3 rounded-lg bg-[#1d4ed8] hover:bg-[#0037b0] text-white flex items-center gap-1.5 text-[12px] font-semibold shadow-xs transition-all"
                aria-expanded={showRoleMenu}
              >
                <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                <span className="hidden sm:inline font-mono">{activeRole}</span>
                <span className="sm:hidden font-mono">{activeRole.slice(0, 4)}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#c4c5d7]/60 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-[#c4c5d7]/30">
                    <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider block font-mono">
                      Switch Evaluator Persona
                    </span>
                    <span className="text-[11px] text-[#747686]">Simulate statutory stakeholder authority</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          onRoleChange(r.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex flex-col gap-0.5 hover:bg-[#eff4ff] transition-colors ${
                          activeRole === r.role ? 'bg-[#e5eeff] border-l-4 border-[#0037b0]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold text-[#0b1c30]">{r.label}</span>
                          {activeRole === r.role && (
                            <span className="material-symbols-outlined text-[16px] text-[#0037b0]">check</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#434655]">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
