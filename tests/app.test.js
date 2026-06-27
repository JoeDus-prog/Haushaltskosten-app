/**
 * Tests für die Haushaltskosten-App
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get store() {
      return store;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Import functions from modules
import { loadCosts, saveCosts } from '../src/storage.js';
import { calculateTotal, formatCurrency, escapeHtml, createCostElement } from '../src/utils.js';

describe('Haushaltskosten-App', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('loadCosts()', () => {
    test('sollte leeres Array zurückgeben, wenn kein Eintrag vorhanden ist', () => {
      const costs = loadCosts();
      expect(costs).toEqual([]);
    });

    test('sollte Kosten aus localStorage laden', () => {
      const testCosts = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' },
      ];
      localStorage.setItem('haushaltskosten', JSON.stringify(testCosts));

      const costs = loadCosts();
      expect(costs).toEqual(testCosts);
    });

    test('sollte leeres Array zurückgeben bei ungültigem JSON', () => {
      localStorage.setItem('haushaltskosten', 'invalid json');

      const costs = loadCosts();
      expect(costs).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('saveCosts()', () => {
    test('sollte Kosten in localStorage speichern', () => {
      const testCosts = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
      ];

      saveCosts(testCosts);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'haushaltskosten',
        JSON.stringify(testCosts)
      );
    });

    test('sollte nur gültige Einträge speichern', () => {
      const costsWithInvalid = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        null,
        { person: '', amount: '10.00' },
        { person: 'Anna' },
      ];

      saveCosts(costsWithInvalid);

      const saved = JSON.parse(localStorage.getItem('haushaltskosten'));
      expect(saved).toHaveLength(1);
      expect(saved[0].person).toBe('Max');
    });

    test('sollte leeres Array speichern bei Fehler', () => {
      // Mock localStorage.setItem to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const testCosts = [{ person: 'Max', amount: '50.00' }];
      saveCosts(testCosts);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'haushaltskosten',
        JSON.stringify([])
      );

      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe('calculateTotal()', () => {
    test('sollte 0 zurückgeben bei leerer Liste', () => {
      const total = calculateTotal([]);
      expect(total).toBe(0);
    });

    test('sollte Summe korrekt berechnen', () => {
      const costs = [
        { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
        { person: 'Anna', amount: '30.00', reason: 'Strom' },
      ];

      const total = calculateTotal(costs);
      expect(total).toBe(80);
    });

    test('sollte ungültige Beträge ignorieren', () => {
      const costs = [
        { person: 'Max', amount: '50.00' },
        { person: 'Anna', amount: 'invalid' },
        { person: 'Test', amount: '25.50' },
      ];

      const total = calculateTotal(costs);
      expect(total).toBe(75.5);
    });

    test('sollte 0 für undefined/NaN Beträge zurückgeben', () => {
      const costs = [
        { person: 'Max', amount: undefined },
        { person: 'Anna', amount: NaN },
      ];

      const total = calculateTotal(costs);
      expect(total).toBe(0);
    });
  });

  describe('formatCurrency()', () => {
    test('sollte Zahl mit 2 Dezimalstellen formatieren', () => {
      expect(formatCurrency(50)).toBe('50.00');
      expect(formatCurrency(50.5)).toBe('50.50');
      expect(formatCurrency(50.123)).toBe('50.12');
    });

    test('sollte String in Zahl umwandeln', () => {
      expect(formatCurrency('50')).toBe('50.00');
      expect(formatCurrency('50.5')).toBe('50.50');
    });

    test('sollte 0.00 für ungültige Werte zurückgeben', () => {
      expect(formatCurrency('invalid')).toBe('0.00');
      expect(formatCurrency(null)).toBe('0.00');
      expect(formatCurrency(undefined)).toBe('0.00');
      expect(formatCurrency(NaN)).toBe('0.00');
    });
  });

  describe('escapeHtml()', () => {
    test('sollte HTML-Sonderzeichen escapen', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('&')).toBe('&amp;');
      expect(escapeHtml('"')).toBe('&quot;');
    });

    test('sollte leeren String für null/undefined zurückgeben', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    test('sollte normalen Text unverändert lassen', () => {
      expect(escapeHtml('Max')).toBe('Max');
      expect(escapeHtml('Einkaufen')).toBe('Einkaufen');
    });
  });

  describe('createCostElement()', () => {
    beforeEach(() => {
      // Setup DOM for createCostElement
      document.body.innerHTML = '<div id="test"></div>';
    });

    test('sollte li-Element mit korrekter Struktur erstellen', () => {
      const cost = { person: 'Max', amount: '50.00', reason: 'Einkaufen' };
      const element = createCostElement(cost, 0);

      expect(element.tagName).toBe('LI');
      expect(element.className).toBe('cost-item');
      expect(element.getAttribute('data-index')).toBe('0');
    });

    test('sollte Person und Betrag anzeigen', () => {
      const cost = { person: 'Max', amount: '50.00' };
      const element = createCostElement(cost, 0);

      expect(element.innerHTML).toContain('Max');
      expect(element.innerHTML).toContain('50.00€');
    });

    test('sollte Grund anzeigen falls vorhanden', () => {
      const cost = { person: 'Max', amount: '50.00', reason: 'Einkaufen' };
      const element = createCostElement(cost, 0);

      expect(element.innerHTML).toContain('(Einkaufen)');
    });

    test('sollte Grund nicht anzeigen falls nicht vorhanden', () => {
      const cost = { person: 'Max', amount: '50.00' };
      const element = createCostElement(cost, 0);

      expect(element.innerHTML).not.toContain('(');
    });

    test('sollte Lösch-Button mit korrektem Index enthalten', () => {
      const cost = { person: 'Max', amount: '50.00' };
      const element = createCostElement(cost, 5);

      expect(element.innerHTML).toContain('data-index="5"');
      expect(element.innerHTML).toContain('Löschen');
    });

    test('sollte HTML escapen', () => {
      const cost = { person: '<script>', amount: '50.00', reason: '<b>test</b>' };
      const element = createCostElement(cost, 0);

      expect(element.innerHTML).not.toContain('<script>');
      expect(element.innerHTML).not.toContain('<b>');
      expect(element.innerHTML).toContain('&lt;script&gt;');
    });
  });
});

// Integration Tests

describe('Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('sollte Kosten speichern und laden können', () => {
    const testCosts = [
      { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
      { person: 'Anna', amount: '30.00', reason: 'Strom' },
    ];

    saveCosts(testCosts);
    const loadedCosts = loadCosts();

    expect(loadedCosts).toEqual(testCosts);
  });

  test('sollte Gesamtbetrag nach Speichern und Laden korrekt berechnen', () => {
    const testCosts = [
      { person: 'Max', amount: '50.00' },
      { person: 'Anna', amount: '30.00' },
    ];

    saveCosts(testCosts);
    const loadedCosts = loadCosts();
    const total = calculateTotal(loadedCosts);

    expect(total).toBe(80);
  });

  test('sollte leere oder ungültige Einträge filtern', () => {
    const costsWithInvalid = [
      { person: 'Max', amount: '50.00' },
      null,
      { person: '', amount: '10.00' },
      { person: 'Anna' },
      { person: 'Test', amount: '25.50' },
    ];

    saveCosts(costsWithInvalid);
    const loadedCosts = loadCosts();

    expect(loadedCosts).toHaveLength(2);
    expect(loadedCosts[0].person).toBe('Max');
    expect(loadedCosts[1].person).toBe('Test');
  });
});
