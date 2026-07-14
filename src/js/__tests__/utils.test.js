/**
 * Tests for utility functions
 */

import { describe, it, expect } from 'vitest';
import { sanitizeInput, formatCurrency } from '../utils/sanitize.js';

describe('sanitizeInput', () => {
  it('should return empty string for null/undefined', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput('')).toBe('');
  });

  it('should escape HTML special characters', () => {
    expect(sanitizeInput('<script>')).toBe('&lt;script&gt;');
    expect(sanitizeInput('a & b')).toBe('a &amp; b');
    expect(sanitizeInput('"test"')).toBe('&quot;test&quot;');
    expect(sanitizeInput("'test'")).toBe('&#39;test&#39;');
  });

  it('should handle complex XSS attempts', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
  });

  it('should preserve normal text', () => {
    expect(sanitizeInput('Normaler Text')).toBe('Normaler Text');
    expect(sanitizeInput('Max Mustermann')).toBe('Max Mustermann');
    expect(sanitizeInput('Einkaufen für 50€')).toBe('Einkaufen für 50€');
  });
});

describe('formatCurrency', () => {
  it('should format numbers with 2 decimal places', () => {
    expect(formatCurrency(50)).toBe('50.00€');
    expect(formatCurrency(50.5)).toBe('50.50€');
    expect(formatCurrency(50.05)).toBe('50.05€');
    expect(formatCurrency(0)).toBe('0.00€');
  });

  it('should handle floating point precision', () => {
    expect(formatCurrency(0.1 + 0.2)).toBe('0.30€'); // JavaScript floating point
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1000)).toBe('1000.00€');
    expect(formatCurrency(123456.789)).toBe('123456.79€');
  });
});
