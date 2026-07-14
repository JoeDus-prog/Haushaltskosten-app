/**
 * Tests for storage functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  loadCosts, 
  saveCosts, 
  addCost, 
  deleteCost,
  calculateTotal,
  calculateTotalByCategory,
  calculateTotalByPerson,
  filterCostsByCategory,
  filterCostsByDate,
  getAllCategories,
  getCurrentDate,
  formatDate,
  initializeStorage,
  clearAllCosts,
  importCosts
} from '../storage/index.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get store() {
      return store;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Date for consistent testing
const mockDate = new Date('2025-01-15T12:00:00Z');
vi.stubGlobal('Date', class extends Date {
  constructor(...args) {
    if (args.length === 0) {
      return mockDate;
    }
    return new Date(...args);
  }
  
  static now() {
    return mockDate.getTime();
  }
});

describe('storage functions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getCurrentDate', () => {
    it('should return current date in YYYY-MM-DD format', () => {
      const date = getCurrentDate();
      expect(date).toBe('2025-01-15');
    });
  });

  describe('formatDate', () => {
    it('should format YYYY-MM-DD to DD.MM.YYYY', () => {
      expect(formatDate('2025-01-15')).toBe('15.01.2025');
      expect(formatDate('2025-12-31')).toBe('31.12.2025');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('loadCosts', () => {
    it('should return empty array when localStorage is empty', () => {
      const costs = loadCosts();
      expect(costs).toEqual([]);
    });

    it('should return parsed costs from localStorage', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const costs = loadCosts();
      expect(costs).toEqual(testCosts);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('haushaltskosten', 'invalid json');
      
      const costs = loadCosts();
      expect(costs).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it('should normalize string amounts to numbers', () => {
      const testCosts = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const costs = loadCosts();
      expect(costs[0].amount).toBe(50.00);
      expect(typeof costs[0].amount).toBe('number');
    });

    it('should add default date if missing', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const costs = loadCosts();
      expect(costs[0].date).toBe('2025-01-15');
    });
  });

  describe('saveCosts', () => {
    it('should save costs to localStorage', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' }
      ];
      
      saveCosts(testCosts);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'haushaltskosten',
        JSON.stringify(testCosts)
      );
    });
  });

  describe('addCost', () => {
    it('should add a new cost to localStorage', () => {
      const initialCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      addCost('Anna', '30.00', 'Strom', 'Haushalt', '2025-01-14');
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(2);
      expect(savedCosts[1]).toEqual({ 
        person: 'Anna', 
        amount: 30.00, 
        reason: 'Strom',
        category: 'Haushalt',
        date: '2025-01-14'
      });
    });

    it('should use current date if none provided', () => {
      addCost('Max', '50.00', 'Einkaufen', 'Lebensmittel');
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts[0].date).toBe('2025-01-15');
    });
  });

  describe('deleteCost', () => {
    it('should delete a cost by index', () => {
      const initialCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      deleteCost(0);
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(1);
      expect(savedCosts[0]).toEqual({ person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' });
    });

    it('should do nothing for invalid index', () => {
      const initialCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      deleteCost(-1);
      deleteCost(100);
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(1);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total of all costs', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      
      const total = calculateTotal(testCosts);
      expect(total).toBe(80.00);
    });

    it('should return 0 for empty array', () => {
      const total = calculateTotal([]);
      expect(total).toBe(0);
    });

    it('should handle missing amounts', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 0, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' },
        { person: 'Test', reason: 'Kein Betrag', category: 'Sonstiges', date: '2025-01-13' }
      ];
      
      const total = calculateTotal(testCosts);
      expect(total).toBe(50.00);
    });

    it('should load costs from localStorage if none provided', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const total = calculateTotal();
      expect(total).toBe(50.00);
    });
  });

  describe('calculateTotalByCategory', () => {
    it('should calculate total by category', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' },
        { person: 'Max', amount: 20.00, reason: 'Obst', category: 'Lebensmittel', date: '2025-01-13' }
      ];
      
      const totals = calculateTotalByCategory(testCosts);
      expect(totals['Lebensmittel']).toBe(70.00);
      expect(totals['Haushalt']).toBe(30.00);
    });

    it('should handle costs without category', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      
      const totals = calculateTotalByCategory(testCosts);
      expect(totals['Ohne Kategorie']).toBe(50.00);
      expect(totals['Haushalt']).toBe(30.00);
    });
  });

  describe('calculateTotalByPerson', () => {
    it('should calculate total by person', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' },
        { person: 'Max', amount: 20.00, reason: 'Obst', category: 'Lebensmittel', date: '2025-01-13' }
      ];
      
      const totals = calculateTotalByPerson(testCosts);
      expect(totals['Max']).toBe(70.00);
      expect(totals['Anna']).toBe(30.00);
    });
  });

  describe('filterCostsByCategory', () => {
    it('should filter costs by category', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByCategory('Lebensmittel');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('Lebensmittel');
    });

    it('should return all costs for empty category', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByCategory('');
      expect(filtered).toHaveLength(2);
    });
  });

  describe('filterCostsByDate', () => {
    it('should filter costs by today', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByDate('today');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toBe('2025-01-15');
    });

    it('should filter costs by week', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-08' },
        { person: 'Test', amount: 10.00, reason: 'Alt', category: 'Sonstiges', date: '2024-12-31' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByDate('week');
      expect(filtered).toHaveLength(2);
      expect(filtered.some(c => c.date === '2025-01-15')).toBe(true);
      expect(filtered.some(c => c.date === '2025-01-08')).toBe(true);
      expect(filtered.some(c => c.date === '2024-12-31')).toBe(false);
    });

    it('should filter costs by month', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2024-12-31' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByDate('month');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toBe('2025-01-15');
    });

    it('should filter costs by year', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2024-12-31' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByDate('year');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toBe('2025-01-15');
    });

    it('should filter costs by custom date range', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-10' },
        { person: 'Test', amount: 10.00, reason: 'Alt', category: 'Sonstiges', date: '2025-01-05' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByDate('custom', '2025-01-10', '2025-01-15');
      expect(filtered).toHaveLength(2);
      expect(filtered.some(c => c.date === '2025-01-15')).toBe(true);
      expect(filtered.some(c => c.date === '2025-01-10')).toBe(true);
      expect(filtered.some(c => c.date === '2025-01-05')).toBe(false);
    });

    it('should return all costs for empty date filter', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const filtered = filterCostsByDate('');
      expect(filtered).toHaveLength(2);
    });
  });

  describe('getAllCategories', () => {
    it('should return all unique categories', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' },
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' },
        { person: 'Test', amount: 10.00, reason: 'Obst', category: 'Lebensmittel', date: '2025-01-13' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const categories = getAllCategories();
      expect(categories).toEqual(['Haushalt', 'Lebensmittel']);
    });

    it('should return empty array for costs without categories', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const categories = getAllCategories();
      expect(categories).toEqual([]);
    });
  });

  describe('initializeStorage', () => {
    it('should add default costs if storage is empty', () => {
      initializeStorage();
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(2);
      expect(savedCosts[0].person).toBe('Max');
      expect(savedCosts[1].person).toBe('Anna');
      expect(savedCosts[0].date).toBe('2025-01-15');
    });

    it('should not override existing costs', () => {
      const existingCosts = [
        { person: 'Test', amount: 100.00, reason: 'Test', category: 'Sonstiges', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(existingCosts));
      
      initializeStorage();
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toEqual(existingCosts);
    });
  });

  describe('clearAllCosts', () => {
    it('should clear all costs', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      clearAllCosts();
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toEqual([]);
    });
  });

  describe('importCosts', () => {
    it('should import new costs', () => {
      const existingCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: '2025-01-15' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(existingCosts));
      
      const newCosts = [
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: '2025-01-14' }
      ];
      
      importCosts(newCosts);
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(2);
    });

    it('should add default date to imported costs without date', () => {
      const newCosts = [
        { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt' }
      ];
      
      importCosts(newCosts);
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts[0].date).toBe('2025-01-15');
    });
  });
});
