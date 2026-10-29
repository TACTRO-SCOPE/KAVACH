import React from 'react';
import { FdrInstrument, NavigationTab } from '../types/index.ts';
import { calculateDepositRequirement, validateJointLienClause } from '../utils/regulatoryRules.ts';

interface SubmitFdrViewProps {
  onSubmitInstrument: (inst: FdrInstrument) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const SubmitFdrView: React.FC<SubmitFdrViewProps> = ({
  onSubmitInstrument,
  onNavigateTab,
  onShowToast,
}) => {
  const [pid, setPid] = React.useState('1-402918210');
  const [instituteName, setInstituteName] = React.useState(
    'Vindhya Institute of Technology & Science'
  );
  const [region, setRegion] = React.useState<'CRO' | 'NRO' | 'WRO' | 'SRO' | 'ERO' | 'NWRO' | 'SWRO' | 'SCRO'>('CRO');
  const [programType, setProgramType] = React.useState('Engineering Degree (UG/PG)');
  const [intakeCategory, setIntakeCategory] = React.useState('New Institute');

  const [bankName, setBankName] = React.useState('State Bank of India');
  const [branch, setBranch] = React.useState('TT Nagar Main Branch, Bhopal');
  const [ifsc, setIfsc] = React.useState('SBIN0004210');
  const [accountNumber, setAccountNumber] = React.useState('39482019284');
  const [fdrNumber, setFdrNumber] = React.useState('FDR-SBI-2026-9912');
  const [principalAmount, setPrincipalAmount] = React.useState('35,00,000');
  const [tenorMonths, setTenorMonths] = React.useState(120);
  const [jointClause, setJointClause] = React.useState(
    'FDR pledged in the joint name of Member Secretary, AICTE and President, Vindhya Educational Trust'
  );

  const [isScanning, setIsScanning] = React.useState(false);
  const [scanCompleted, setScanCompleted] = React.useState(false);

  const statutoryReq = calculateDepositRequirement(programType, intakeCategory);
  const clauseValidation = validateJointLienClause(jointClause);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      onShowToast('Laser OCR completed: 14 fields extracted with 99.6% confidence.', 'fact_check');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNumeric = parseInt(principalAmount.replace(/,/g, ''), 10) || 3500000;

    const newInst: FdrInstrument = {
      id: `fdr-${Date.now()}`,
      fdrNumber,
      pid,
      institutionName: instituteName,
      region,
      bankName,
      branch,
      ifsc,
      accountNumber,
      principalAmount: amountNumeric,
      declaredAmount: amountNumeric,
      ocrExtractedAmount: amountNumeric,
      bankConfirmedAmount: amountNumeric,
      issueDate: '2026-10-30',
      maturityDate: '2036-10-30',
      tenorMonths,
      interestRate: 7.25,
      jointHolderClause: jointClause,
      status: amountNumeric < statutoryReq ? 'DISCREPANCY' : 'PENDING_BANK',
      confidenceScore: 99.6,
      tamperFlag: false,
      renewalCount: 0,
      remarks: 'Fresh submission registered through statutory institution intake portal.',
      discrepancyNote:
        amountNumeric < statutoryReq
          ? `Statutory Shortfall: ₹${((statutoryReq - amountNumeric) / 100000).toFixed(2)} Lakh below norm.`
          : undefined,
    };

    onSubmitInstrument(newInst);
    onShowToast(`FDR ${fdrNumber} submitted to Regional Scrutiny Desk!`, 'upload_file');
    onNavigateTab('portfolio');
  };

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
      {/* Header */}
      <section className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0037b0] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[24px]">upload_file</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#0b1c30]">
              Statutory FDR Intake & Joint Lien Registration
            </h2>
            <p className="text-[12px] text-[#434655]">
              AICTE Approval Process Handbook (APH) 2026-27 Compliance Intake
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] uppercase">
          Form Form-APH-FDR
        </span>
      </section>

      {/* Intake Wizard Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Step 1: Institutional Profile & APH Tier Calculation */}
        <div className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
            <span className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0037b0] text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              Institution & Academic Category
            </span>
            <div className="text-[11px] font-mono font-bold text-[#0037b0] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#c4c5d7]/40">
              APH Statutory Deposit: ₹{(statutoryReq / 100000).toFixed(2)} Lakhs
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Permanent Institute ID (PID) *
              </label>
              <input
                type="text"
                value={pid}
                onChange={(e) => setPid(e.target.value)}
                required
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 text-[12px] font-mono text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0037b0]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                AICTE Regional Directorate *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] font-mono text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                <option value="CRO">CRO (Central - Bhopal)</option>
                <option value="WRO">WRO (Western - Mumbai)</option>
                <option value="SRO">SRO (Southern - Chennai)</option>
                <option value="SWRO">SWRO (South-West - Bengaluru)</option>
                <option value="ERO">ERO (Eastern - Kolkata)</option>
                <option value="NRO">NRO (Northern - Kanpur)</option>
                <option value="NWRO">NWRO (North-West - Chandigarh)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                required
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 text-[12px] font-bold text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0037b0]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Program Type *
              </label>
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                <option value="Engineering Degree (UG/PG)">Engineering Degree (UG/PG)</option>
                <option value="Management / MBA">Management / MBA</option>
                <option value="Pharmacy Degree (B.Pharm/M.Pharm)">Pharmacy Degree</option>
                <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                <option value="Architecture & Planning">Architecture & Planning</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Intake Category *
              </label>
              <select
                value={intakeCategory}
                onChange={(e) => setIntakeCategory(e.target.value)}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                <option value="New Institute">New Technical Institute</option>
                <option value="Additional Intake / Division">Additional Intake / Division</option>
                <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Bank Deposit Specifics */}
        <div className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
            <span className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0037b0] text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              Scheduled Commercial Bank FDR Details
            </span>
            <span className="text-[11px] font-mono text-[#434655]">RBI Scheduled Bank Only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Bank Name *
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                <option value="State Bank of India">State Bank of India</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
                <option value="Canara Bank">Canara Bank</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Branch IFSC Code *
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                required
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 text-[12px] font-mono text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                FDR Reg. Number *
              </label>
              <input
                type="text"
                value={fdrNumber}
                onChange={(e) => setFdrNumber(e.target.value)}
                required
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 text-[12px] font-mono font-bold text-[#0037b0] border border-[#c4c5d7]/40 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Account Number *
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 text-[12px] font-mono text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Deposit Amount (INR) *
              </label>
              <input
                type="text"
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(e.target.value)}
                required
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-3 text-[14px] font-mono font-bold text-[#0037b0] border border-[#c4c5d7]/40 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase font-mono text-[#0b1c30] block mb-1">
                Deposit Tenor (Months) *
              </label>
              <select
                value={tenorMonths}
                onChange={(e) => setTenorMonths(parseInt(e.target.value, 10))}
                className="w-full h-10 bg-[#eff4ff] rounded-lg px-2 text-[12px] font-mono text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white"
              >
                <option value={120}>120 Months (10 Years Mandate)</option>
                <option value={96}>96 Months (8 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Mandatory AICTE Joint Lien Clause */}
        <div className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
            <span className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0037b0] text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              Statutory Joint Lien Endorsement Mandate
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                clauseValidation.isValid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {clauseValidation.isValid ? 'verified' : 'error'}
              </span>
              {clauseValidation.isValid ? 'Clause Validated' : 'Missing Clause Terms'}
            </span>
          </div>

          <textarea
            value={jointClause}
            onChange={(e) => setJointClause(e.target.value)}
            rows={2}
            className="w-full bg-[#eff4ff] rounded-lg p-2.5 text-[12px] font-serif text-[#0b1c30] border border-[#c4c5d7]/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0037b0]"
          />

          {!clauseValidation.isValid && (
            <div className="text-[11px] text-red-700 bg-red-50 p-2 rounded border border-red-200">
              Missing required statutory terms: {clauseValidation.missingElements.join(', ')}
            </div>
          )}
        </div>

        {/* Step 4: Certificate Scan Simulation */}
        <div className="bg-white rounded-2xl p-5 border border-[#c4c5d7]/50 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#c4c5d7]/30">
            <span className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0037b0] text-white text-[11px] font-bold flex items-center justify-center">
                4
              </span>
              Physical FDR Certificate Upload & Automated OCR Laser Extraction
            </span>
            <span className="text-[11px] font-mono text-[#0037b0]">Auto-Triage Active</span>
          </div>

          <div className="p-6 border-2 border-dashed border-[#c4c5d7] rounded-xl flex flex-col items-center justify-center text-center gap-2 bg-[#eff4ff]/30">
            <span className="material-symbols-outlined text-[36px] text-[#0037b0]">
              document_scanner
            </span>
            <span className="text-[13px] font-bold text-[#0b1c30]">
              {scanCompleted
                ? 'FDR_Certificate_Scanned_SBIN0004210.pdf (300 DPI Verified)'
                : 'Upload Direct Bank Scan or Run Simulated OCR Extraction'}
            </span>
            <span className="text-[11px] text-[#434655]">
              System automatically runs neural 14-point bounding box tensor extraction.
            </span>

            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="mt-2 py-2 px-4 rounded-lg bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-semibold text-[12px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isScanning ? 'sync' : 'bolt'}
              </span>
              <span>{isScanning ? 'Running Laser Scan...' : 'Run Simulated OCR Extraction'}</span>
            </button>
          </div>
        </div>

        {/* Submit to Pipeline */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-[#0037b0] hover:bg-[#1d4ed8] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px] text-[#ffdcc3]">
            check_circle
          </span>
          <span>Submit FDR Instrument to AICTE Scrutiny Pipeline</span>
        </button>
      </form>
    </div>
  );
};
