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
  initializeStorage 
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

describe('storage functions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('loadCosts', () => {
    it('should return empty array when localStorage is empty', () => {
      const costs = loadCosts();
      expect(costs).toEqual([]);
    });

    it('should return parsed costs from localStorage', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' },
        { person: 'Anna', amount: 30.00, reason: 'Strom' }
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
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const costs = loadCosts();
      expect(costs[0].amount).toBe(50.00);
      expect(typeof costs[0].amount).toBe('number');
    });
  });

  describe('saveCosts', () => {
    it('should save costs to localStorage', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' }
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
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      addCost('Anna', '30.00', 'Strom');
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(2);
      expect(savedCosts[1]).toEqual({ person: 'Anna', amount: 30.00, reason: 'Strom' });
    });

    it('should handle empty localStorage', () => {
      addCost('Max', '50.00', 'Einkaufen');
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(1);
      expect(savedCosts[0]).toEqual({ person: 'Max', amount: 50.00, reason: 'Einkaufen' });
    });
  });

  describe('deleteCost', () => {
    it('should delete a cost by index', () => {
      const initialCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' },
        { person: 'Anna', amount: 30.00, reason: 'Strom' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      deleteCost(0);
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(1);
      expect(savedCosts[0]).toEqual({ person: 'Anna', amount: 30.00, reason: 'Strom' });
    });

    it('should do nothing for invalid index', () => {
      const initialCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' }
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
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' },
        { person: 'Anna', amount: 30.00, reason: 'Strom' }
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
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' },
        { person: 'Anna', amount: 0, reason: 'Strom' },
        { person: 'Test', reason: 'Kein Betrag' }
      ];
      
      const total = calculateTotal(testCosts);
      expect(total).toBe(50.00);
    });

    it('should load costs from localStorage if none provided', () => {
      const testCosts = [
        { person: 'Max', amount: 50.00, reason: 'Einkaufen' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const total = calculateTotal();
      expect(total).toBe(50.00);
    });
  });

  describe('initializeStorage', () => {
    it('should add default costs if storage is empty', () => {
      initializeStorage();
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toHaveLength(2);
      expect(savedCosts[0]).toEqual({ person: 'Max', amount: 50.00, reason: 'Einkaufen' });
      expect(savedCosts[1]).toEqual({ person: 'Anna', amount: 30.00, reason: 'Strom' });
    });

    it('should not override existing costs', () => {
      const existingCosts = [
        { person: 'Test', amount: 100.00, reason: 'Test' }
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(existingCosts));
      
      initializeStorage();
      
      const savedCosts = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(savedCosts).toEqual(existingCosts);
    });
  });
});
