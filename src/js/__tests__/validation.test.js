/**
 * Tests for validation functions
 */

import { describe, it, expect } from 'vitest';
import { 
  validateAmount, 
  validatePerson, 
  validateReason,
  validateCost 
} from '../validation/index.js';

describe('validateAmount', () => {
  it('should accept valid positive numbers', () => {
    expect(validateAmount('50.00')).toBe(true);
    expect(validateAmount('0')).toBe(true);
    expect(validateAmount('100')).toBe(true);
    expect(validateAmount('0.99')).toBe(true);
  });

  it('should reject empty strings', () => {
    expect(validateAmount('')).toBe(false);
    expect(validateAmount('   ')).toBe(false);
  });

  it('should reject negative numbers', () => {
    expect(validateAmount('-10')).toBe(false);
    expect(validateAmount('-0.01')).toBe(false);
  });

  it('should reject non-numeric strings', () => {
    expect(validateAmount('abc')).toBe(false);
    expect(validateAmount('fifty')).toBe(false);
    expect(validateAmount('50,00')).toBe(false); // Komma statt Punkt
  });

  it('should reject null/undefined', () => {
    expect(validateAmount(null)).toBe(false);
    expect(validateAmount(undefined)).toBe(false);
  });
});

describe('validatePerson', () => {
  it('should accept valid names', () => {
    expect(validatePerson('Max')).toBe(true);
    expect(validatePerson('Anna')).toBe(true);
    expect(validatePerson('Max Mustermann')).toBe(true);
    expect(validatePerson('A'.repeat(50))).toBe(true); // Maximal 50 Zeichen
  });

  it('should reject empty names', () => {
    expect(validatePerson('')).toBe(false);
    expect(validatePerson('   ')).toBe(false);
  });

  it('should reject names that are too long', () => {
    expect(validatePerson('A'.repeat(51))).toBe(false);
  });

  it('should reject null/undefined', () => {
    expect(validatePerson(null)).toBe(false);
    expect(validatePerson(undefined)).toBe(false);
  });
});

describe('validateReason', () => {
  it('should accept valid reasons', () => {
    expect(validateReason('Einkaufen')).toBe(true);
    expect(validateReason('Stromrechnung')).toBe(true);
    expect(validateReason('A'.repeat(100))).toBe(true); // Maximal 100 Zeichen
  });

  it('should accept empty reason', () => {
    expect(validateReason('')).toBe(true);
    expect(validateReason(null)).toBe(true);
    expect(validateReason(undefined)).toBe(true);
  });

  it('should reject reasons that are too long', () => {
    expect(validateReason('A'.repeat(101))).toBe(false);
  });

  it('should reject reasons with only whitespace', () => {
    expect(validateReason('   ')).toBe(false);
  });
});

describe('validateCost', () => {
  it('should accept valid cost entries', () => {
    expect(validateCost({ person: 'Max', amount: '50.00', reason: 'Einkaufen' })).toBe(true);
    expect(validateCost({ person: 'Anna', amount: '30', reason: '' })).toBe(true);
    expect(validateCost({ person: 'Test', amount: '0.99' })).toBe(true);
  });

  it('should reject invalid cost entries', () => {
    expect(validateCost({ person: '', amount: '50', reason: 'Test' })).toBe(false);
    expect(validateCost({ person: 'Max', amount: '-10', reason: 'Test' })).toBe(false);
    expect(validateCost({ person: 'Max', amount: 'abc', reason: 'Test' })).toBe(false);
    expect(validateCost({ person: 'Max', amount: '50', reason: 'A'.repeat(101) })).toBe(false);
  });
});
