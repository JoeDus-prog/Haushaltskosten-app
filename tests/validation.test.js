/**
 * Validation Module Tests
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  validatePerson,
  validateAmount,
  validateReason,
  validateCost
} from '../src/js/validation.js';

describe('Validation Module', () => {
  describe('sanitizeInput', () => {
    it('should return empty string for null/undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput('')).toBe('');
    });

    it('should escape HTML special characters', () => {
      expect(sanitizeInput('<script>')).toBe('&lt;script&gt;');
      expect(sanitizeInput('</script>')).toBe('&lt;/script&gt;');
      expect(sanitizeInput('"test"')).toBe('&quot;test&quot;');
      expect(sanitizeInput("'test'")).toBe('&#39;test&#39;');
    });

    it('should handle multiple special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should not modify safe input', () => {
      expect(sanitizeInput('Max')).toBe('Max');
      expect(sanitizeInput('Einkaufen')).toBe('Einkaufen');
      expect(sanitizeInput('50.00')).toBe('50.00');
    });
  });

  describe('validatePerson', () => {
    it('should return true for valid person names', () => {
      expect(validatePerson('Max')).toBe(true);
      expect(validatePerson('Anna')).toBe(true);
      expect(validatePerson('Anna Müller')).toBe(true);
      expect(validatePerson('a'.repeat(50))).toBe(true);
    });

    it('should return false for empty names', () => {
      expect(validatePerson('')).toBe(false);
      expect(validatePerson('   ')).toBe(false);
      expect(validatePerson(null)).toBe(false);
      expect(validatePerson(undefined)).toBe(false);
    });

    it('should return false for names longer than 50 characters', () => {
      expect(validatePerson('a'.repeat(51))).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(validatePerson('  Max  ')).toBe(true);
    });
  });

  describe('validateAmount', () => {
    it('should return true for valid amounts', () => {
      expect(validateAmount('50')).toBe(true);
      expect(validateAmount('50.00')).toBe(true);
      expect(validateAmount('0')).toBe(true);
      expect(validateAmount('0.00')).toBe(true);
      expect(validateAmount('123.45')).toBe(true);
    });

    it('should return false for empty amounts', () => {
      expect(validateAmount('')).toBe(false);
      expect(validateAmount('   ')).toBe(false);
      expect(validateAmount(null)).toBe(false);
      expect(validateAmount(undefined)).toBe(false);
    });

    it('should return false for negative amounts', () => {
      expect(validateAmount('-50')).toBe(false);
      expect(validateAmount('-0.01')).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(validateAmount('abc')).toBe(false);
      expect(validateAmount('50abc')).toBe(false);
      expect(validateAmount('NaN')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(validateAmount(' 50 ')).toBe(true);
    });

    it('should return false for special characters', () => {
      expect(validateAmount('50,00')).toBe(false);
      expect(validateAmount('50 €')).toBe(false);
    });
  });

  describe('validateReason', () => {
    it('should return true for empty reason', () => {
      expect(validateReason('')).toBe(true);
      expect(validateReason(null)).toBe(true);
      expect(validateReason(undefined)).toBe(true);
    });

    it('should return true for valid reasons', () => {
      expect(validateReason('Einkaufen')).toBe(true);
      expect(validateReason('a'.repeat(100))).toBe(true);
    });

    it('should return false for reasons longer than 100 characters', () => {
      expect(validateReason('a'.repeat(101))).toBe(false);
    });

    it('should return true for whitespace-only reasons (optional field)', () => {
      // Whitespace-only is considered valid for optional fields
      expect(validateReason('   ')).toBe(true);
    });

    it('should trim whitespace', () => {
      expect(validateReason('  Einkaufen  ')).toBe(true);
    });
  });

  describe('validateCost', () => {
    it('should return valid for complete cost object', () => {
      const cost = { person: 'Max', amount: '50.00', reason: 'Einkaufen' };
      const result = validateCost(cost);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return valid for cost without reason', () => {
      const cost = { person: 'Max', amount: '50.00' };
      const result = validateCost(cost);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid person', () => {
      const cost = { person: '', amount: '50.00' };
      const result = validateCost(cost);
      expect(result.isValid).toBe(false);
      expect(result.errors.person).toBeDefined();
    });

    it('should return errors for invalid amount', () => {
      const cost = { person: 'Max', amount: '-50' };
      const result = validateCost(cost);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBeDefined();
    });

    it('should return errors for invalid reason', () => {
      const cost = { person: 'Max', amount: '50.00', reason: 'a'.repeat(101) };
      const result = validateCost(cost);
      expect(result.isValid).toBe(false);
      expect(result.errors.reason).toBeDefined();
    });

    it('should return multiple errors', () => {
      const cost = { person: '', amount: '-50', reason: 'a'.repeat(101) };
      const result = validateCost(cost);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(3);
    });
  });
});
