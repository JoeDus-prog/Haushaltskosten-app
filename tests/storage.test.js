/**
 * Storage Module Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCosts,
  setCosts,
  addCost,
  removeCost,
  calculateTotal,
  initializeStorage
} from '../src/js/storage.js';

// Mock localStorage
const createLocalStorageMock = () => {
  const store = {};
  return {
    getItem: vi.fn((key) => {
      const value = store[key];
      return value === undefined ? null : value;
    }),
    setItem: vi.fn((key, value) => {
      store[key] = value !== undefined ? value.toString() : undefined;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get store() {
      return store;
    }
  };
};

describe('Storage Module', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    global.localStorage = localStorageMock;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCosts', () => {
    it('should return empty array when no costs exist', () => {
      const costs = getCosts();
      expect(costs).toEqual([]);
    });

    it('should return parsed costs from localStorage', () => {
      const testCosts = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' }
      ];
      localStorageMock.setItem('haushaltskosten', JSON.stringify(testCosts));
      
      const costs = getCosts();
      expect(costs).toEqual(testCosts);
    });

    it('should return empty array for invalid JSON', () => {
      localStorageMock.setItem('haushaltskosten', 'invalid json');
      
      // Should not throw, but return []
      expect(() => getCosts()).not.toThrow();
      const costs = getCosts();
      expect(costs).toEqual([]);
    });

    it('should return empty array when localStorage returns null', () => {
      // Don't set anything, so getItem returns null
      const costs = getCosts();
      expect(costs).toEqual([]);
    });
  });

  describe('setCosts', () => {
    it('should save costs to localStorage', () => {
      const costs = [{ person: 'Max', amount: '50.00', reason: 'Einkaufen' }];
      setCosts(costs);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'haushaltskosten',
        JSON.stringify(costs)
      );
    });

    it('should handle empty array', () => {
      setCosts([]);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'haushaltskosten',
        JSON.stringify([])
      );
    });
  });

  describe('addCost', () => {
    it('should add a new cost to existing costs', () => {
      const initialCosts = [{ person: 'Max', amount: '50.00', reason: 'Einkaufen' }];
      localStorageMock.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      const newCost = { person: 'Anna', amount: '30.00', reason: 'Strom' };
      addCost(newCost);
      
      const costs = getCosts();
      expect(costs).toHaveLength(2);
      expect(costs[1]).toEqual(newCost);
    });

    it('should add first cost when no costs exist', () => {
      const newCost = { person: 'Max', amount: '50.00', reason: 'Einkaufen' };
      addCost(newCost);
      
      const costs = getCosts();
      expect(costs).toHaveLength(1);
      expect(costs[0]).toEqual(newCost);
    });
  });

  describe('removeCost', () => {
    it('should remove cost by index', () => {
      const initialCosts = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' },
        { person: 'Tom', amount: '20.00', reason: 'Internet' }
      ];
      localStorageMock.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      removeCost(1);
      
      const costs = getCosts();
      expect(costs).toHaveLength(2);
      expect(costs[0]).toEqual(initialCosts[0]);
      expect(costs[1]).toEqual(initialCosts[2]);
    });

    it('should not remove anything for invalid index', () => {
      const initialCosts = [{ person: 'Max', amount: '50.00', reason: 'Einkaufen' }];
      localStorageMock.setItem('haushaltskosten', JSON.stringify(initialCosts));
      
      removeCost(-1);
      removeCost(100);
      
      const costs = getCosts();
      expect(costs).toHaveLength(1);
    });

    it('should not throw for empty costs array', () => {
      localStorageMock.setItem('haushaltskosten', JSON.stringify([]));
      
      expect(() => removeCost(0)).not.toThrow();
    });
  });

  describe('calculateTotal', () => {
    it('should return 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('should calculate total from costs', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' }
      ];
      expect(calculateTotal(costs)).toBe(80);
    });

    it('should handle invalid amount values', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: 'invalid', reason: 'Strom' }
      ];
      expect(calculateTotal(costs)).toBe(50);
    });

    it('should handle missing amount values', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', reason: 'Strom' }
      ];
      expect(calculateTotal(costs)).toBe(50);
    });

    it('should handle undefined amount values', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: undefined, reason: 'Strom' }
      ];
      expect(calculateTotal(costs)).toBe(50);
    });
  });

  describe('initializeStorage', () => {
    it('should add default costs when storage is empty', () => {
      localStorageMock.setItem('haushaltskosten', JSON.stringify([]));
      
      initializeStorage();
      
      const costs = getCosts();
      expect(costs).toHaveLength(2);
      expect(costs[0]).toEqual({ person: 'Max', amount: '50.00', reason: 'Einkaufen' });
      expect(costs[1]).toEqual({ person: 'Anna', amount: '30.00', reason: 'Strom' });
    });

    it('should not modify existing costs', () => {
      const existingCosts = [{ person: 'Test', amount: '10.00', reason: 'Test' }];
      localStorageMock.setItem('haushaltskosten', JSON.stringify(existingCosts));
      
      initializeStorage();
      
      const costs = getCosts();
      expect(costs).toEqual(existingCosts);
    });

    it('should add default costs when storage returns null', () => {
      // Don't set anything, so getItem returns null
      initializeStorage();
      
      const costs = getCosts();
      expect(costs).toHaveLength(2);
    });
  });
});
