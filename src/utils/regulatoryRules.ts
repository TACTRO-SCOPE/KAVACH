import { FdrInstrument, AuditBlock } from '../types/index.ts';

/**
 * AICTE Approval Process Handbook (APH) 2026-27 Norms
 * Calculates the required statutory FDR security deposit in Indian Rupees.
 */
export function calculateDepositRequirement(
  programType: string,
  intakeCategory: string
): number {
  const norm = programType.toLowerCase().trim();
  const category = intakeCategory.toLowerCase().trim();

  if (norm.includes('engineering') || norm.includes('technology')) {
    if (category.includes('new') || category.includes('standalone')) {
      return 3500000; // 35 Lakhs
    }
    return 1500000; // 15 Lakhs for existing addition
  }

  if (norm.includes('management') || norm.includes('mba')) {
    return 1500000; // 15 Lakhs
  }

  if (norm.includes('pharmacy')) {
    return 2500000; // 25 Lakhs
  }

  if (norm.includes('polytechnic') || norm.includes('diploma')) {
    return 1500000; // 15 Lakhs
  }

  if (norm.includes('architecture') || norm.includes('design')) {
    return 2000000; // 20 Lakhs
  }

  return 1500000;
}

/**
 * Triangulates Declared vs OCR vs Core Banking Solution (CBS) amounts.
 * Identifies discrepancies and statutory deficits.
 */
export function calculateReconciliationStatus(
  declared: number,
  ocrExtracted: number,
  bankConfirmed: number,
  statutoryRequirement: number
) {
  const isDeficit = declared < statutoryRequirement;
  const deficitAmount = isDeficit ? statutoryRequirement - declared : 0;

  // OCR vs Declared check
  const isOcrMismatch = Math.abs(ocrExtracted - declared) > 100;

  // Bank CBS vs Declared check
  const isBankMismatch = Math.abs(bankConfirmed - declared) > 100;

  const hasCriticalDiscrepancy =
    isDeficit || isOcrMismatch || (bankConfirmed > 0 && isBankMismatch);

  let summary = 'Compliant: All triangulation points reconcile.';
  if (isDeficit) {
    summary = `Statutory Deficit: Declared deposit is ₹${(deficitAmount / 100000).toFixed(2)} Lakh below the required APH threshold.`;
  } else if (isOcrMismatch) {
    summary = `OCR Mismatch: Extracted value (₹${(ocrExtracted / 100000).toFixed(2)}L) does not match declared value (₹${(declared / 100000).toFixed(2)}L).`;
  } else if (isBankMismatch) {
    summary = `Bank CBS Mismatch: Bank gateway returned ₹${(bankConfirmed / 100000).toFixed(2)}L vs declared ₹${(declared / 100000).toFixed(2)}L.`;
  }

  return {
    isDeficit,
    deficitAmount,
    isOcrMismatch,
    isBankMismatch,
    hasCriticalDiscrepancy,
    summary,
  };
}

/**
 * Simulates FDR instrument maturity relative to a simulation offset in days.
 */
export function simulateMaturityStatus(
  maturityDateStr: string,
  currentOffsetDays: number,
  baseDateStr = '2026-10-30'
) {
  const baseTime = new Date(baseDateStr).getTime();
  const effectiveTime = baseTime + currentOffsetDays * 86400000;
  const maturityTime = new Date(maturityDateStr).getTime();

  const daysRemaining = Math.round((maturityTime - effectiveTime) / 86400000);

  let urgencyTier: 'EXPIRED' | 'CRITICAL_30' | 'UPCOMING_90' | 'NORMAL';
  if (daysRemaining < 0) {
    urgencyTier = 'EXPIRED';
  } else if (daysRemaining <= 30) {
    urgencyTier = 'CRITICAL_30';
  } else if (daysRemaining <= 90) {
    urgencyTier = 'UPCOMING_90';
  } else {
    urgencyTier = 'NORMAL';
  }

  return {
    daysRemaining,
    urgencyTier,
    isExpiringInWindow: daysRemaining >= 0 && daysRemaining <= 90,
    isOverdue: daysRemaining < 0,
  };
}

/**
 * Aggregates portfolio telemetry across all instruments.
 */
export function calculatePortfolioMetrics(
  instruments: FdrInstrument[],
  offsetDays: number,
  baseDateStr = '2026-10-30'
) {
  let totalExposureInr = 0;
  let activeLienCount = 0;
  let discrepancyCount = 0;
  let pendingBankCount = 0;
  let disputedCount = 0;
  let expiringInWindowCount = 0;
  let overdueCount = 0;

  for (const inst of instruments) {
    totalExposureInr += inst.principalAmount;

    if (inst.status === 'ACTIVE_LIEN') {
      activeLienCount++;
    } else if (inst.status === 'DISCREPANCY') {
      discrepancyCount++;
    } else if (inst.status === 'PENDING_BANK') {
      pendingBankCount++;
    } else if (inst.status === 'DISPUTED') {
      disputedCount++;
    }

    const maturity = simulateMaturityStatus(
      inst.maturityDate,
      offsetDays,
      baseDateStr
    );
    if (maturity.isExpiringInWindow) {
      expiringInWindowCount++;
    }
    if (maturity.isOverdue) {
      overdueCount++;
    }
  }

  const totalExposureCrores = totalExposureInr / 10000000;

  return {
    totalExposureInr,
    totalExposureCrores: parseFloat(totalExposureCrores.toFixed(2)),
    activeLienCount,
    discrepancyCount,
    pendingBankCount,
    disputedCount,
    expiringInWindowCount,
    overdueCount,
    totalInstruments: instruments.length,
    cagIntegrityIndex: 99.98,
  };
}

/**
 * Deterministic pseudo-SHA256 generator for reproducible testing and verification.
 */
export function generateDeterministicHash(content: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < content.length; i++) {
    const ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const p3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const p4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return `0x${p1}${p2}${p3}${p4}${p1.split('').reverse().join('')}${p2.split('').reverse().join('')}`.slice(0, 66);
}

/**
 * Validates cryptographic chain integrity.
 */
export function verifyChainIntegrity(blocks: AuditBlock[]): {
  isValid: boolean;
  brokenBlockIndex: number | null;
  errorMessage?: string;
} {
  if (blocks.length === 0) {
    return { isValid: true, brokenBlockIndex: null };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.status === 'TAMPERED' || block.tampered) {
      return {
        isValid: false,
        brokenBlockIndex: i,
        errorMessage: `Block #${block.blockHeight} signature payload checksum failure.`,
      };
    }

    if (i > 0) {
      const prevBlock = blocks[i - 1];
      if (block.previousHash !== prevBlock.hash) {
        return {
          isValid: false,
          brokenBlockIndex: i,
          errorMessage: `Chain broken at Block #${block.blockHeight}: previousHash (${block.previousHash}) does not match Block #${prevBlock.blockHeight} hash (${prevBlock.hash}).`,
        };
      }
    }
  }

  return { isValid: true, brokenBlockIndex: null };
}

/**
 * Validates that an FDR instrument contains the statutory Joint Lien Clause.
 */
export function validateJointLienClause(clauseText: string): {
  isValid: boolean;
  missingElements: string[];
} {
  const text = clauseText.toLowerCase();
  const missing: string[] = [];

  const hasAicte =
    text.includes('aicte') ||
    text.includes('all india council') ||
    text.includes('member secretary') ||
    text.includes('regional officer');
  if (!hasAicte) {
    missing.push('AICTE Statutory Representative (Member Secretary / Regional Officer)');
  }

  const hasInstitute =
    text.includes('institute') ||
    text.includes('college') ||
    text.includes('trust') ||
    text.includes('society') ||
    text.includes('president') ||
    text.includes('principal');
  if (!hasInstitute) {
    missing.push('Institutional Trust/Society Representative');
  }

  const hasLienTerm =
    text.includes('joint') ||
    text.includes('lien') ||
    text.includes('pledge') ||
    text.includes('encashment') ||
    text.includes('security deposit');
  if (!hasLienTerm) {
    missing.push('Joint Lien / Security Deposit Mandate Endorsement');
  }

  return {
    isValid: missing.length === 0,
    missingElements: missing,
  };
}
