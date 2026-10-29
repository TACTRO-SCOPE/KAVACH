export type PersonaRole =
  | 'HQ_ADMIN'
  | 'SCRUTINY_OFFICER'
  | 'REGIONAL_OFFICER'
  | 'INSTITUTION_USER'
  | 'BANK_USER'
  | 'VIGILANCE_LEGAL'
  | 'FINANCE_OFFICER'
  | 'AUDITOR';

export type FdrStatus =
  | 'ALL'
  | 'ACTIVE_LIEN'
  | 'DISCREPANCY'
  | 'PENDING_BANK'
  | 'MATURED'
  | 'DISPUTED'
  | 'RELEASE_PENDING'
  | 'RELEASED';

export interface FdrInstrument {
  id: string;
  fdrNumber: string;
  pid: string;
  institutionName: string;
  region: 'CRO' | 'NRO' | 'WRO' | 'SRO' | 'ERO' | 'NWRO' | 'SWRO' | 'SCRO';
  bankName: string;
  branch: string;
  ifsc: string;
  accountNumber: string;
  principalAmount: number; // in INR
  declaredAmount: number;
  ocrExtractedAmount: number;
  bankConfirmedAmount: number;
  issueDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
  tenorMonths: number;
  interestRate: number; // e.g. 7.25%
  jointHolderClause: string;
  status: FdrStatus;
  confidenceScore: number; // 0 - 100
  tamperFlag: boolean;
  lineageParentId?: string;
  renewalCount: number;
  remarks?: string;
  discrepancyNote?: string;
  dualSignApprovedByAicte?: boolean;
  dualSignApprovedByBank?: boolean;
  aicteSignerName?: string;
  bankSignerName?: string;
  aicteSignHash?: string;
  bankSignHash?: string;
  signedAt?: string;
}

export interface AuditBlock {
  blockHeight: number;
  timestamp: string;
  hash: string;
  previousHash: string;
  fdrId: string;
  actionType:
    | 'LIEN_CREATION'
    | 'OCR_TRIANGULATION'
    | 'DISCREPANCY_FLAG'
    | 'OFFICER_OVERRIDE'
    | 'DUAL_SIGN_ATTEST'
    | 'BANK_CBS_SYNC'
    | 'RENEWAL_ROLLOVER'
    | 'LIEN_RELEASE_MANDATE'
    | 'CAG_INSPECTION_SEAL';
  actorRole: PersonaRole;
  actorName: string;
  signature: string;
  status: 'VALID' | 'TAMPERED';
  tampered?: boolean;
  dataSummary: string;
  payload: Record<string, unknown>;
}

export interface SihScenario {
  step: number;
  title: string;
  req: string;
  role: PersonaRole;
  entity: string;
  asset: string;
  desc: string;
  actionText: string;
  actionIcon: string;
  feedback: string;
  toastIcon: string;
  filterTarget?: FdrStatus;
  targetRoute?: string;
}

export type NavigationTab =
  | 'portfolio'
  | 'scrutiny'
  | 'release-lineage'
  | 'audit-ledger'
  | 'submit'
  | 'bank-gateway';

export interface BoundingBoxInfo {
  id: string;
  label: string;
  field: string;
  top: string;
  left: string;
  width: string;
  height: string;
  value: string;
  confidence: number;
  tensor: string;
  status: 'MATCH' | 'MISMATCH' | 'VERIFIED';
}
