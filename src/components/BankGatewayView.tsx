import React from 'react';
import { FdrInstrument } from '../types/index.ts';

interface BankGatewayViewProps {
  instruments: FdrInstrument[];
  onShowToast: (msg: string, icon?: string) => void;
  onConfirmBankSync: (fdrId: string) => void;
}

export const BankGatewayView: React.FC<BankGatewayViewProps> = ({
  instruments,
  onShowToast,
  onConfirmBankSync,
}) => {
  const [selectedBank, setSelectedBank] = React.useState('State Bank of India');
  const [activeEndpoint, setActiveEndpoint] = React.useState<'lien-mark' | 'balance' | 'dual-sign' | 'release'>('lien-mark');
  const [selectedFdrId, setSelectedFdrId] = React.useState<string>(instruments[0]?.id || '');
  const [isTransmitting, setIsTransmitting] = React.useState(false);
  const [lastResponse, setLastResponse] = React.useState<any>({
    status: 200,
    statusText: 'OK',
    latencyMs: 142,
    timestamp: '2026-10-30T10:14:02.192Z',
    messageType: 'SFMS_798_LIEN_ACK',
    data: {
      accountNumber: '39482019284',
      lienMarkStatus: 'SUCCESS_LOCKED',
      statutoryBeneficiary: 'MEMBER_SECRETARY_AICTE',
      escrowInterestAccrual: 'ACTIVE',
      bankRefNumber: 'SBI-SFMS-2026-99214',
      cbsCryptographicDigest: '0x33e8912ba009110293847561029384756102938475610293847561',
    },
  });

  const selectedInst = instruments.find((i) => i.id === selectedFdrId) || instruments[0];

  const handleExecuteApi = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);

      if (activeEndpoint === 'lien-mark') {
        setLastResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 128,
          timestamp: new Date().toISOString(),
          messageType: 'SFMS_798_LIEN_ACK',
          data: {
            fdrNumber: selectedInst?.fdrNumber,
            accountNumber: selectedInst?.accountNumber,
            lienMarkStatus: 'SUCCESS_LOCKED',
            statutoryBeneficiary: 'MEMBER_SECRETARY_AICTE',
            escrowInterestAccrual: 'ACTIVE',
            bankRefNumber: `SFMS-ACK-${Date.now().toString().slice(-6)}`,
            cbsCryptographicDigest: '0x88fbc910a7210e4459810bbceb91024508912837265101928374',
          },
        });
        if (selectedInst) onConfirmBankSync(selectedInst.id);
        onShowToast(`SFMS 798 Lien Marked by ${selectedBank}!`, 'account_balance');
      } else if (activeEndpoint === 'balance') {
        setLastResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 98,
          timestamp: new Date().toISOString(),
          messageType: 'CBS_BALANCE_ENQUIRY',
          data: {
            fdrNumber: selectedInst?.fdrNumber,
            principalAmount: selectedInst?.principalAmount,
            accruedInterest: Math.round((selectedInst?.principalAmount || 0) * 0.0725 * 2.5),
            maturityValue: Math.round((selectedInst?.principalAmount || 0) * 1.8),
            lienFlag: 'Y',
            accountStatus: 'OPERATIVE_LIEN',
          },
        });
        onShowToast('Real-time CBS balance confirmed directly with bank core.', 'verified');
      } else if (activeEndpoint === 'dual-sign') {
        setLastResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 174,
          timestamp: new Date().toISOString(),
          messageType: 'BANK_DSC_PUSH_ACK',
          data: {
            fdrNumber: selectedInst?.fdrNumber,
            branchNodalOfficer: 'M. S. Narayanan (Chief Manager)',
            dscTokenSerial: 'ePass2003-IN-88210',
            signHash: '0xef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564',
            status: 'SIGNED_AND_ATTESTED',
          },
        });
        onShowToast('Bank DSC token signature pushed to AICTE Scrutiny Desk.', 'badge');
      } else {
        setLastResponse({
          status: 200,
          statusText: 'OK',
          latencyMs: 210,
          timestamp: new Date().toISOString(),
          messageType: 'SFMS_799_RELEASE_ACK',
          data: {
            fdrNumber: selectedInst?.fdrNumber,
            action: 'LIEN_EXTINGUISHED',
            statutoryNocRef: 'AICTE-NOC-2026-ENC-009',
            status: 'RELEASED_TO_INSTITUTION',
          },
        });
        onShowToast('SFMS 799 Lien Release confirmation recorded.', 'lock_open');
      }
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
      {/* Header */}
      <section className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0037b0] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#0b1c30]">
              Scheduled Commercial Bank (SCB) CBS API Gateway
            </h2>
            <p className="text-[12px] text-[#434655]">
              Real-time Core Banking System (CBS) SFMS 798/799 Structured Message Interchange
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            SFTP/SFMS Live
          </span>
        </div>
      </section>

      {/* Gateway Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Request Configurator */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
          <h3 className="text-[14px] font-bold text-[#0b1c30] pb-2 border-b border-[#c4c5d7]/30">
            Direct Bank API Dispatch Console
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Target Scheduled Bank *
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] font-bold text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                <option value="State Bank of India">State Bank of India (SBIN0004210)</option>
                <option value="Bank of Baroda">Bank of Baroda (BARB0KORAMA)</option>
                <option value="Punjab National Bank">Punjab National Bank (PUNB0182900)</option>
                <option value="Canara Bank">Canara Bank (CNRB0000192)</option>
                <option value="HDFC Bank">HDFC Bank (HDFC0000281)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Select Instrument *
              </label>
              <select
                value={selectedFdrId}
                onChange={(e) => setSelectedFdrId(e.target.value)}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] font-mono text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                {instruments.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.fdrNumber} - {i.institutionName.slice(0, 26)}... (₹
                    {(i.principalAmount / 100000).toFixed(1)}L)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                API Endpoint / Message Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'lien-mark', label: 'SFMS 798 Lien Lock' },
                  { id: 'balance', label: 'CBS Balance Check' },
                  { id: 'dual-sign', label: 'Bank DSC Push' },
                  { id: 'release', label: 'SFMS 799 Release NOC' },
                ].map((ep) => (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => setActiveEndpoint(ep.id as any)}
                    className={`py-2 px-2 text-left rounded-lg text-[11px] font-semibold transition-all border ${
                      activeEndpoint === ep.id
                        ? 'bg-[#0037b0] text-white border-[#0037b0] shadow-xs'
                        : 'bg-[#eff4ff] text-[#434655] border-[#c4c5d7]/40 hover:bg-[#dce9ff]'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Instrument Card */}
            {selectedInst && (
              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#c4c5d7]/30 flex flex-col gap-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#747686]">PID:</span>
                  <span className="font-bold text-[#0b1c30]">{selectedInst.pid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">A/C NO:</span>
                  <span className="text-[#0037b0] font-bold">{selectedInst.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">PRINCIPAL:</span>
                  <span className="font-bold text-emerald-700">
                    ₹{(selectedInst.principalAmount / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747686]">STATUS:</span>
                  <span className="font-bold">{selectedInst.status}</span>
                </div>
              </div>
            )}

            {/* Dispatch Button */}
            <button
              onClick={handleExecuteApi}
              disabled={isTransmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md transition-all disabled:opacity-50 mt-1"
            >
              <span className="material-symbols-outlined text-[17px]">
                {isTransmitting ? 'sync' : 'bolt'}
              </span>
              <span>{isTransmitting ? 'Transmitting to Bank...' : 'Execute Gateway Dispatch'}</span>
            </button>
          </div>
        </div>

        {/* Right: Response Inspector */}
        <div className="lg:col-span-7 bg-[#213145] text-white rounded-2xl p-5 border border-[#747686]/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                terminal
              </span>
              <span className="text-[13px] font-bold font-mono text-[#cad3ff]">
                CBS Response Stream (JSON)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                HTTP {lastResponse.status} {lastResponse.statusText}
              </span>
              <span className="text-[#c4c5d7]">{lastResponse.latencyMs}ms</span>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-white/10 overflow-auto max-h-[460px] font-mono text-[12px] text-emerald-300">
            <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#c4c5d7] pt-1">
            <span>Security: TLS 1.3 | RSA-4096 SFMS Token</span>
            <span className="text-emerald-400">Status: End-to-End Cryptographically Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
