/**
 * Utility Module Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatAmount,
  parseAmount,
  groupCostsByPerson,
  getStatistics,
  debounce,
  exportToCSV,
  importFromCSV
} from '../src/js/utils.js';

describe('Utility Module', () => {
  describe('formatAmount', () => {
    it('should format integer to 2 decimal places', () => {
      expect(formatAmount('50')).toBe('50.00');
      expect(formatAmount(50)).toBe('50.00');
    });

    it('should format decimal to 2 decimal places', () => {
      expect(formatAmount('50.5')).toBe('50.50');
      // Note: JavaScript's toFixed uses banker's rounding
      // 50.555 rounded to 2 decimals is 50.55 (not 50.56)
      expect(formatAmount('50.555')).toBe('50.55');
    });

    it('should handle zero', () => {
      expect(formatAmount('0')).toBe('0.00');
      expect(formatAmount(0)).toBe('0.00');
    });

    it('should handle invalid input', () => {
      expect(formatAmount('invalid')).toBe('0.00');
      expect(formatAmount(null)).toBe('0.00');
      expect(formatAmount(undefined)).toBe('0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatAmount('-50')).toBe('-50.00');
    });

    it('should handle very small numbers', () => {
      expect(formatAmount('0.001')).toBe('0.00');
      expect(formatAmount('0.005')).toBe('0.01');
    });
  });

  describe('parseAmount', () => {
    it('should parse valid amounts', () => {
      expect(parseAmount('50')).toBe(50);
      expect(parseAmount('50.50')).toBe(50.5);
      expect(parseAmount('0')).toBe(0);
    });

    it('should return 0 for invalid input', () => {
      expect(parseAmount('invalid')).toBe(0);
      expect(parseAmount(null)).toBe(0);
      expect(parseAmount(undefined)).toBe(0);
    });
  });

  describe('groupCostsByPerson', () => {
    it('should group costs by person', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' },
        { person: 'Max', amount: '20.00', reason: 'Internet' }
      ];
      
      const result = groupCostsByPerson(costs);
      
      expect(result.Max).toHaveLength(2);
      expect(result.Anna).toHaveLength(1);
      expect(result.Max[0]).toEqual(costs[0]);
      expect(result.Max[1]).toEqual(costs[2]);
    });

    it('should return empty object for empty array', () => {
      expect(groupCostsByPerson([])).toEqual({});
    });

    it('should handle single cost', () => {
      const costs = [{ person: 'Max', amount: '50.00', reason: 'Einkaufen' }];
      const result = groupCostsByPerson(costs);
      
      expect(result.Max).toHaveLength(1);
      expect(result.Max[0]).toEqual(costs[0]);
    });
  });

  describe('getStatistics', () => {
    it('should calculate correct statistics', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' },
        { person: 'Max', amount: '20.00', reason: 'Internet' }
      ];
      
      const stats = getStatistics(costs);
      
      expect(stats.total).toBe(100);
      expect(stats.count).toBe(3);
      expect(stats.average).toBe(33.33);
      expect(stats.byPerson).toHaveLength(2);
    });

    it('should handle empty array', () => {
      const stats = getStatistics([]);
      
      expect(stats.total).toBe(0);
      expect(stats.count).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.byPerson).toHaveLength(0);
    });

    it('should calculate person totals correctly', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Max', amount: '20.00', reason: 'Internet' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' }
      ];
      
      const stats = getStatistics(costs);
      
      const maxStats = stats.byPerson.find(p => p.person === 'Max');
      const annaStats = stats.byPerson.find(p => p.person === 'Anna');
      
      expect(maxStats.total).toBe(70);
      expect(maxStats.count).toBe(2);
      expect(annaStats.total).toBe(30);
      expect(annaStats.count).toBe(1);
    });

    it('should handle invalid amount values', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: 'invalid', reason: 'Strom' }
      ];
      
      const stats = getStatistics(costs);
      
      expect(stats.total).toBe(50);
      expect(stats.count).toBe(2);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      // Call multiple times quickly
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      // Function should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time
      vi.advanceTimersByTime(100);
      
      // Function should have been called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2');
      
      vi.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('first');
      vi.advanceTimersByTime(50);
      
      debouncedFn('second');
      vi.advanceTimersByTime(50);
      
      // Still not called (timer was reset)
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      
      // Now called with second argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('exportToCSV', () => {
    it('should create downloadable CSV', () => {
      // Mock URL.createObjectURL and click
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = vi.fn();
      const mockClick = vi.fn();
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      const mockLink = {
        href: '',
        download: '',
        click: mockClick
      };
      
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' }
      ];
      
      exportToCSV(costs);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.download).toBe('haushaltskosten.csv');
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('importFromCSV', () => {
    it('should parse CSV string to costs array', () => {
      const csv = `Person;Betrag (€);Grund
Max;50.00;Einkaufen
Anna;30.00;Strom`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(2);
      expect(costs[0].person).toBe('Max');
      expect(costs[0].amount).toBe('50.00');
      expect(costs[0].reason).toBe('Einkaufen');
    });

    it('should handle CSV with quoted values', () => {
      const csv = `Person;Betrag (€);Grund
"Max";"50.00";"Einkaufen, Gemüse"`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(1);
      expect(costs[0].reason).toBe('Einkaufen, Gemüse');
    });

    it('should handle CSV with escaped quotes', () => {
      const csv = `Person;Betrag (€);Grund
"Max";"50.00";"Einkaufen ""Gemüse"""`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(1);
      expect(costs[0].reason).toBe('Einkaufen "Gemüse"');
    });

    it('should skip empty lines', () => {
      const csv = `Person;Betrag (€);Grund
Max;50.00;Einkaufen

Anna;30.00;Strom`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(2);
    });

    it('should handle missing reason', () => {
      const csv = `Person;Betrag (€);Grund
Max;50.00;`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(1);
      expect(costs[0].reason).toBe('');
    });

    it('should skip lines without person', () => {
      const csv = `Person;Betrag (€);Grund
;50.00;Einkaufen
Max;30.00;Strom`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(1);
      expect(costs[0].person).toBe('Max');
    });

    it('should handle lines with only 2 columns', () => {
      const csv = `Person;Betrag (€)
Max;50.00
Anna;30.00`;
      
      const costs = importFromCSV(csv);
      
      expect(costs).toHaveLength(2);
      expect(costs[0].reason).toBe('');
    });
  });
});
