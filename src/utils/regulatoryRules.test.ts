import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDepositRequirement,
  calculateReconciliationStatus,
  simulateMaturityStatus,
  calculatePortfolioMetrics,
  verifyChainIntegrity,
  validateJointLienClause,
  generateDeterministicHash,
} from './regulatoryRules.ts';
import { FdrInstrument, AuditBlock } from '../types/index.ts';

test('calculateDepositRequirement computes correct statutory tiers', () => {
  assert.equal(calculateDepositRequirement('Engineering', 'New Institute'), 3500000);
  assert.equal(calculateDepositRequirement('Engineering', 'Additional Intake'), 1500000);
  assert.equal(calculateDepositRequirement('Management', 'New Institute'), 1500000);
  assert.equal(calculateDepositRequirement('Pharmacy', 'New Institute'), 2500000);
  assert.equal(calculateDepositRequirement('Architecture', 'New'), 2000000);
});

test('calculateReconciliationStatus detects deficit and discrepancies', () => {
  // Compliant case
  const compliant = calculateReconciliationStatus(3500000, 3500000, 3500000, 3500000);
  assert.equal(compliant.hasCriticalDiscrepancy, false);
  assert.equal(compliant.isDeficit, false);

  // Deficit case: declared 15L against 35L requirement
  const deficit = calculateReconciliationStatus(1500000, 1500000, 1500000, 3500000);
  assert.equal(deficit.hasCriticalDiscrepancy, true);
  assert.equal(deficit.isDeficit, true);
  assert.equal(deficit.deficitAmount, 2000000);

  // OCR mismatch case: declared 35L, OCR read 15L
  const ocrMismatch = calculateReconciliationStatus(3500000, 1500000, 1500000, 3500000);
  assert.equal(ocrMismatch.hasCriticalDiscrepancy, true);
  assert.equal(ocrMismatch.isOcrMismatch, true);
});

test('simulateMaturityStatus calculates day offsets and urgency correctly', () => {
  // Maturity on 2026-11-20, base date 2026-10-30 -> 21 days remaining
  const status0 = simulateMaturityStatus('2026-11-20', 0, '2026-10-30');
  assert.equal(status0.daysRemaining, 21);
  assert.equal(status0.urgencyTier, 'CRITICAL_30');
  assert.equal(status0.isExpiringInWindow, true);

  // Advanced by 30 days -> daysRemaining becomes -9 (expired)
  const status30 = simulateMaturityStatus('2026-11-20', 30, '2026-10-30');
  assert.equal(status30.daysRemaining, -9);
  assert.equal(status30.urgencyTier, 'EXPIRED');
  assert.equal(status30.isOverdue, true);
});

test('validateJointLienClause verifies all required statutory parties', () => {
  const validClause =
    'FDR pledged in the joint name of Member Secretary, AICTE and President, Vindhya Educational Trust.';
  const resValid = validateJointLienClause(validClause);
  assert.equal(resValid.isValid, true);
  assert.equal(resValid.missingElements.length, 0);

  const missingAicte = 'Fixed Deposit in name of President, Vindhya Educational Trust only.';
  const resMissing = validateJointLienClause(missingAicte);
  assert.equal(resMissing.isValid, false);
  assert.ok(resMissing.missingElements.some((e) => e.includes('AICTE')));
});

test('verifyChainIntegrity checks block linkages and flags tamper', () => {
  const hash0 = generateDeterministicHash('block0');
  const hash1 = generateDeterministicHash('block1' + hash0);

  const cleanChain: AuditBlock[] = [
    {
      blockHeight: 1,
      timestamp: '2026-10-30T10:00:00Z',
      hash: hash0,
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      fdrId: 'FDR-001',
      actionType: 'LIEN_CREATION',
      actorRole: 'HQ_ADMIN',
      actorName: 'Dr. V. Rao',
      signature: 'SIG-001',
      status: 'VALID',
      dataSummary: 'Lien created',
      payload: {},
    },
    {
      blockHeight: 2,
      timestamp: '2026-10-30T10:05:00Z',
      hash: hash1,
      previousHash: hash0,
      fdrId: 'FDR-001',
      actionType: 'DUAL_SIGN_ATTEST',
      actorRole: 'SCRUTINY_OFFICER',
      actorName: 'Rajesh V. Sharma',
      signature: 'SIG-002',
      status: 'VALID',
      dataSummary: 'Dual sign approved',
      payload: {},
    },
  ];

  const cleanResult = verifyChainIntegrity(cleanChain);
  assert.equal(cleanResult.isValid, true);

  // Tamper test: corrupt previousHash
  const tamperedChain: AuditBlock[] = [
    cleanChain[0],
    {
      ...cleanChain[1],
      previousHash: '0xBADHASH9999999999999999999999999999999999999999999999999999999999',
    },
  ];

  const tamperedResult = verifyChainIntegrity(tamperedChain);
  assert.equal(tamperedResult.isValid, false);
  assert.equal(tamperedResult.brokenBlockIndex, 1);
});
