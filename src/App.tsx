/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PersonaRole,
  NavigationTab,
  FdrInstrument,
  AuditBlock,
  SihScenario,
} from './types/index.ts';
import {
  INITIAL_INSTRUMENTS,
  INITIAL_AUDIT_BLOCKS,
  SIH_SCENARIOS,
} from './utils/mockData.ts';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { PortfolioView } from './components/PortfolioView.tsx';
import { ScrutinyConsoleView } from './components/ScrutinyConsoleView.tsx';
import { ReleaseLineageView } from './components/ReleaseLineageView.tsx';
import { AuditLedgerView } from './components/AuditLedgerView.tsx';
import { SubmitFdrView } from './components/SubmitFdrView.tsx';
import { BankGatewayView } from './components/BankGatewayView.tsx';
import { PitchCopilot } from './components/PitchCopilot.tsx';
import { GigwReportModal } from './components/GigwReportModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { Toast } from './components/Toast.tsx';
import { generateDeterministicHash } from './utils/regulatoryRules.ts';

export default function App() {
  const [activeRole, setActiveRole] = React.useState<PersonaRole>('HQ_ADMIN');
  const [currentTab, setCurrentTab] = React.useState<NavigationTab>('portfolio');
  const [offsetDays, setOffsetDays] = React.useState<number>(0);
  const [instruments, setInstruments] = React.useState<FdrInstrument[]>(INITIAL_INSTRUMENTS);
  const [selectedInstrument, setSelectedInstrument] = React.useState<FdrInstrument>(
    INITIAL_INSTRUMENTS[0]
  );
  const [auditBlocks, setAuditBlocks] = React.useState<AuditBlock[]>(INITIAL_AUDIT_BLOCKS);
  const [copilotStepIndex, setCopilotStepIndex] = React.useState<number>(0);

  // Modals & Notifications
  const [showReportModal, setShowReportModal] = React.useState<boolean>(false);
  const [reportInstrument, setReportInstrument] = React.useState<FdrInstrument | undefined>();
  const [showNotificationsModal, setShowNotificationsModal] = React.useState<boolean>(false);

  const [notifications, setNotifications] = React.useState<
    {
      id: string;
      title: string;
      desc: string;
      time: string;
      icon: string;
      type: 'alert' | 'info' | 'success';
    }[]
  >([
    {
      id: 'notif-1',
      title: 'Discrepancy Hold Flagged',
      desc: 'FDR-SBI-9928172 declared ₹35L vs Extracted ₹15L (Deficit: ₹20L).',
      time: '10:02 AM',
      icon: 'warning',
      type: 'alert',
    },
    {
      id: 'notif-2',
      title: 'SFMS 798 Acknowledgment',
      desc: 'Canara Bank confirmed direct CBS lien lock for Matunga branch.',
      time: '11:45 AM',
      icon: 'account_balance',
      type: 'success',
    },
    {
      id: 'notif-3',
      title: 'CAG Merkle Tree Validated',
      desc: 'National Portfolio cryptographic attestation stamp confirmed.',
      time: '01:10 PM',
      icon: 'verified_user',
      type: 'info',
    },
  ]);

  // Toast state
  const [toast, setToast] = React.useState<{ message: string; icon: string; visible: boolean }>({
    message: '',
    icon: 'info',
    visible: false,
  });

  const showToast = (message: string, icon = 'info') => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Time-Travel Clock Simulator Handler
  const handleOffsetChange = (days: number, label: string) => {
    setOffsetDays(days);
    if (days === 0) {
      showToast('Time Clock reset to Live Statutory Anchor (30 Oct 2026)', 'restart_alt');
    } else {
      showToast(`Time Clock advanced by +${days} days. Sandbox recalculated.`, 'schedule');
    }
  };

  // Quick Jump Scenario Handler
  const handleJumpScenario = (scenarioId: number) => {
    const sc = SIH_SCENARIOS.find((s) => s.step === scenarioId);
    if (sc) {
      setCopilotStepIndex(scenarioId - 1);
      setActiveRole(sc.role);
      if (sc.targetRoute) setCurrentTab(sc.targetRoute as NavigationTab);
      showToast(sc.feedback, sc.toastIcon);
    }
  };

  // Copilot Pitch Execution Handler
  const handleExecuteScenario = (scenario: SihScenario) => {
    setActiveRole(scenario.role);

    if (scenario.step === 1) {
      setCurrentTab('scrutiny');
      setSelectedInstrument(instruments[0]);
    } else if (scenario.step === 2) {
      setCurrentTab('scrutiny');
      setSelectedInstrument(instruments[0]);
    } else if (scenario.step === 3) {
      setCurrentTab('bank-gateway');
    } else if (scenario.step === 4) {
      setOffsetDays(60);
      setCurrentTab('portfolio');
    } else if (scenario.step === 5) {
      setCurrentTab('release-lineage');
    } else if (scenario.step === 6) {
      setCurrentTab('release-lineage');
    } else if (scenario.step === 7) {
      setCurrentTab('audit-ledger');
    }

    showToast(scenario.feedback, scenario.toastIcon);
  };

  // Officer Override Commit Handler
  const handleCommitOverride = (
    _field: string,
    newValue: number,
    reason: string,
    justification: string
  ) => {
    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === selectedInstrument.id) {
          return {
            ...inst,
            principalAmount: newValue,
            ocrExtractedAmount: newValue,
            status: 'ACTIVE_LIEN',
            discrepancyNote: undefined,
            remarks: `Officer Override: ${reason} - ${justification}`,
          };
        }
        return inst;
      })
    );

    setSelectedInstrument((prev) => ({
      ...prev,
      principalAmount: newValue,
      ocrExtractedAmount: newValue,
      status: 'ACTIVE_LIEN',
      discrepancyNote: undefined,
      remarks: `Officer Override: ${reason} - ${justification}`,
    }));

    // Append to audit blocks
    const newBlockHeight = auditBlocks.length + 1041;
    const prevHash = auditBlocks[auditBlocks.length - 1]?.hash || '0x00';
    const newHash = generateDeterministicHash(
      `block${newBlockHeight}${prevHash}${selectedInstrument.fdrNumber}`
    );

    const newBlock: AuditBlock = {
      blockHeight: newBlockHeight,
      timestamp: new Date().toISOString(),
      hash: newHash,
      previousHash: prevHash,
      fdrId: selectedInstrument.fdrNumber,
      actionType: 'OFFICER_OVERRIDE',
      actorRole: activeRole,
      actorName: 'Rajesh V. Sharma (CRO-8821)',
      signature: 'DSC-Token-CRO-8821-OVERRIDE',
      status: 'VALID',
      dataSummary: `Officer Override committed for ${selectedInstrument.fdrNumber}: ${reason} (₹${(
        newValue / 100000
      ).toFixed(2)} Lakhs).`,
      payload: { rectifiedAmount: newValue, reason, justification },
    };

    setAuditBlocks((prev) => [...prev, newBlock]);
  };

  // Dual Signatory Commit Handler
  const handleDualSignCommit = (fdrId: string) => {
    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === fdrId) {
          return {
            ...inst,
            status: 'ACTIVE_LIEN',
            dualSignApprovedByAicte: true,
            dualSignApprovedByBank: true,
            aicteSignerName: 'Rajesh V. Sharma (CRO-8821)',
            bankSignerName: 'M. S. Narayanan (SBI Nodal)',
            signedAt: new Date().toLocaleString(),
          };
        }
        return inst;
      })
    );

    const newBlockHeight = auditBlocks.length + 1041;
    const prevHash = auditBlocks[auditBlocks.length - 1]?.hash || '0x00';
    const newHash = generateDeterministicHash(`dualSign${newBlockHeight}${prevHash}`);

    const newBlock: AuditBlock = {
      blockHeight: newBlockHeight,
      timestamp: new Date().toISOString(),
      hash: newHash,
      previousHash: prevHash,
      fdrId: selectedInstrument.fdrNumber,
      actionType: 'DUAL_SIGN_ATTEST',
      actorRole: 'SCRUTINY_OFFICER',
      actorName: 'AICTE Scrutiny & SBI Branch Nodal Joint Desk',
      signature: 'DUAL-DSC-TOKEN-STAMPED',
      status: 'VALID',
      dataSummary: `Dual-signatory verification completed for ${selectedInstrument.fdrNumber}. Statutory joint lien active.`,
      payload: { dualSigned: true },
    };

    setAuditBlocks((prev) => [...prev, newBlock]);
    showToast('Dual-Signatory Mandate Authorized & Cryptographically Stamped!', 'verified_user');
  };

  // Submit New Instrument Handler
  const handleSubmitInstrument = (newInst: FdrInstrument) => {
    setInstruments((prev) => [newInst, ...prev]);

    const newBlockHeight = auditBlocks.length + 1041;
    const prevHash = auditBlocks[auditBlocks.length - 1]?.hash || '0x00';
    const newHash = generateDeterministicHash(`intake${newBlockHeight}${newInst.fdrNumber}`);

    const newBlock: AuditBlock = {
      blockHeight: newBlockHeight,
      timestamp: new Date().toISOString(),
      hash: newHash,
      previousHash: prevHash,
      fdrId: newInst.fdrNumber,
      actionType: 'LIEN_CREATION',
      actorRole: 'INSTITUTION_USER',
      actorName: newInst.institutionName,
      signature: 'INST-AUTH-TOKEN',
      status: 'VALID',
      dataSummary: `New FDR deposit instrument registered for PID ${newInst.pid} (₹${(
        newInst.principalAmount / 100000
      ).toFixed(2)}L).`,
      payload: { pid: newInst.pid, amount: newInst.principalAmount },
    };

    setAuditBlocks((prev) => [...prev, newBlock]);
  };

  // Tamper Block Simulation Handler
  const handleTamperBlock = () => {
    setAuditBlocks((prev) =>
      prev.map((b, idx) => {
        if (idx === 2) {
          return {
            ...b,
            status: 'TAMPERED',
            tampered: true,
            hash: '0xBAD_CORRUPTED_HASH_999999999999999999999999999999999999999999999999',
            dataSummary: '⚠️ TAMPERED RECORD: Principal amount altered from ₹15L to ₹50L without DSC token.',
          };
        }
        return b;
      })
    );
    showToast('Simulated Cryptographic Tamper in Block #1043!', 'warning');
  };

  // Restore Clean Chain Handler
  const handleRestoreChain = () => {
    setAuditBlocks(INITIAL_AUDIT_BLOCKS);
    showToast('Restored Clean Merkle Chain. All hashes verified.', 'restore');
  };

  // Bank CBS Sync Callback
  const handleConfirmBankSync = (fdrId: string) => {
    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === fdrId) {
          return {
            ...inst,
            status: 'ACTIVE_LIEN',
            bankConfirmedAmount: inst.principalAmount,
          };
        }
        return inst;
      })
    );
  };

  const discrepancyCount = instruments.filter((i) => i.status === 'DISCREPANCY').length;
  const pendingBankCount = instruments.filter((i) => i.status === 'PENDING_BANK').length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Public_Sans']">
      {/* Top Header */}
      <Header
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        offsetDays={offsetDays}
        unreadCount={notifications.length}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenReportModal={() => {
          setReportInstrument(selectedInstrument);
          setShowReportModal(true);
        }}
      />

      {/* Navigation (Top desktop tabs & bottom mobile nav) */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        discrepancyCount={discrepancyCount}
        pendingBankCount={pendingBankCount}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {currentTab === 'portfolio' && (
          <PortfolioView
            instruments={instruments}
            activeRole={activeRole}
            onRoleChange={setActiveRole}
            offsetDays={offsetDays}
            onOffsetChange={handleOffsetChange}
            onNavigateTab={setCurrentTab}
            onSelectInstrumentForScrutiny={(fdr) => {
              setSelectedInstrument(fdr);
              setCurrentTab('scrutiny');
            }}
            onOpenReportModal={(fdr) => {
              setReportInstrument(fdr || selectedInstrument);
              setShowReportModal(true);
            }}
            onShowToast={showToast}
            onJumpScenario={handleJumpScenario}
          />
        )}

        {currentTab === 'scrutiny' && (
          <ScrutinyConsoleView
            selectedInstrument={selectedInstrument}
            onCommitOverride={handleCommitOverride}
            onDualSignCommit={handleDualSignCommit}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'release-lineage' && (
          <ReleaseLineageView
            instruments={instruments}
            onNavigateTab={setCurrentTab}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'audit-ledger' && (
          <AuditLedgerView
            blocks={auditBlocks}
            onTamperBlock={handleTamperBlock}
            onRestoreChain={handleRestoreChain}
            onShowToast={showToast}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        )}

        {currentTab === 'submit' && (
          <SubmitFdrView
            onSubmitInstrument={handleSubmitInstrument}
            onNavigateTab={setCurrentTab}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'bank-gateway' && (
          <BankGatewayView
            instruments={instruments}
            onShowToast={showToast}
            onConfirmBankSync={handleConfirmBankSync}
          />
        )}
      </main>

      {/* SIH Jury Pitch Copilot Floating Dock */}
      <PitchCopilot
        scenarios={SIH_SCENARIOS}
        currentStepIndex={copilotStepIndex}
        onSelectStep={setCopilotStepIndex}
        onExecuteScenario={handleExecuteScenario}
        onReset={() => {
          setCopilotStepIndex(0);
          setActiveRole('HQ_ADMIN');
          setCurrentTab('portfolio');
          setOffsetDays(0);
          showToast('Copilot reset to Scenario 1.', 'restart_alt');
        }}
        activeRole={activeRole}
      />

      {/* GIGW 3.0 Report Modal */}
      {showReportModal && (
        <GigwReportModal
          instrument={reportInstrument || selectedInstrument}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onClear={() => setNotifications([])}
        />
      )}

      {/* Floating Action Toast */}
      <Toast message={toast.message} icon={toast.icon} visible={toast.visible} />
    </div>
  );
}
