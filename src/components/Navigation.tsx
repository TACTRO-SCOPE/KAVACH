import React from 'react';
import { NavigationTab } from '../types/index.ts';

interface NavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  discrepancyCount: number;
  pendingBankCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  discrepancyCount,
  pendingBankCount,
}) => {
  const tabs: {
    id: NavigationTab;
    label: string;
    icon: string;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'portfolio', label: 'Portfolio', icon: 'account_balance_wallet' },
    {
      id: 'scrutiny',
      label: 'Scrutiny Desk',
      icon: 'fact_check',
      badge: discrepancyCount,
      badgeColor: 'bg-[#ba1a1a]',
    },
    { id: 'release-lineage', label: 'Release Lineage', icon: 'published_with_changes' },
    { id: 'audit-ledger', label: 'SHA-256 Ledger', icon: 'receipt_long' },
    { id: 'submit', label: 'Submit FDR', icon: 'upload_file' },
    {
      id: 'bank-gateway',
      label: 'CBS Gateway',
      icon: 'account_balance',
      badge: pendingBankCount,
      badgeColor: 'bg-[#6b3700]',
    },
  ];

  return (
    <>
      {/* Desktop Secondary Navigation Bar (Fixed right below header) */}
      <div className="hidden md:block fixed top-16 left-0 right-0 z-30 bg-[#eff4ff]/95 backdrop-blur-md border-b border-[#c4c5d7]/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#0037b0] text-white shadow-xs'
                      : 'text-[#434655] hover:text-[#0b1c30] hover:bg-[#dce9ff]/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono text-white font-bold ${
                        tab.badgeColor || 'bg-[#ba1a1a]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Fixed Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-xl border-t border-[#c4c5d7]/40 shadow-lg pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 relative transition-colors ${
                  isActive ? 'text-[#0037b0] font-bold' : 'text-[#434655] hover:text-[#0b1c30]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-transform ${
                      isActive ? 'scale-110' : ''
                    }`}
                  >
                    {tab.icon}
                  </span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-mono text-white font-bold ${
                        tab.badgeColor || 'bg-[#ba1a1a]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-['Public_Sans'] leading-tight mt-0.5 truncate max-w-[56px]">
                  {tab.label.split(' ')[0]}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-[#0037b0]"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
