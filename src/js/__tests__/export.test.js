/**
 * Tests for export/import functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  exportToCSV,
  exportToJSON,
  parseCSV,
  parseJSON
} from '../utils/export.js';

describe('exportToCSV', () => {
  it('should export costs to CSV format', () => {
    const costs = [
      { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel' },
      { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt' }
    ];
    
    const csv = exportToCSV(costs);
    const lines = csv.split('\n');
    
    expect(lines[0]).toBe('Person;Betrag (€);Grund;Kategorie');
    expect(lines[1]).toBe('"Max";"50.00";"Einkaufen";"Lebensmittel"');
    expect(lines[2]).toBe('"Anna";"30.00";"Strom";"Haushalt"');
  });

  it('should handle empty costs array', () => {
    const csv = exportToCSV([]);
    expect(csv).toBe('Person;Betrag (€);Grund;Kategorie');
  });

  it('should escape special characters in CSV', () => {
    const costs = [
      { person: 'Max;Test', amount: 50.00, reason: 'Einkaufen, mit Komma', category: '' }
    ];
    
    const csv = exportToCSV(costs);
    expect(csv).toContain('"Max;Test"');
    expect(csv).toContain('"Einkaufen, mit Komma"');
  });
});

describe('exportToJSON', () => {
  it('should export costs to JSON format', () => {
    const costs = [
      { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel' }
    ];
    
    const json = exportToJSON(costs);
    const parsed = JSON.parse(json);
    
    expect(parsed).toHaveLength(1);
    expect(parsed[0].person).toBe('Max');
    expect(parsed[0].amount).toBe(50.00);
  });

  it('should handle empty costs array', () => {
    const json = exportToJSON([]);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual([]);
  });
});

describe('parseCSV', () => {
  it('should parse CSV with header', () => {
    const csv = 'Person;Betrag (€);Grund;Kategorie\nMax;50.00;Einkaufen;Lebensmittel\nAnna;30.00;Strom;Haushalt';
    
    const costs = parseCSV(csv);
    
    expect(costs).toHaveLength(2);
    expect(costs[0].person).toBe('Max');
    expect(costs[0].amount).toBe(50.00);
    expect(costs[0].reason).toBe('Einkaufen');
    expect(costs[0].category).toBe('Lebensmittel');
  });

  it('should parse CSV without header', () => {
    const csv = 'Max;50.00;Einkaufen;Lebensmittel\nAnna;30.00;Strom;Haushalt';
    
    const costs = parseCSV(csv);
    
    expect(costs).toHaveLength(2);
    expect(costs[0].person).toBe('Max');
    expect(costs[1].person).toBe('Anna');
  });

  it('should handle empty CSV', () => {
    const costs = parseCSV('');
    expect(costs).toEqual([]);
  });

  it('should handle CSV with quoted values', () => {
    const csv = 'Person;Betrag (€);Grund\n"Max;Test";50.00;"Einkaufen, mit Komma"';
    
    const costs = parseCSV(csv);
    
    expect(costs[0].person).toBe('Max;Test');
    expect(costs[0].reason).toBe('Einkaufen, mit Komma');
  });
});

describe('parseJSON', () => {
  it('should parse valid JSON', () => {
    const json = '[{"person": "Max", "amount": 50.00, "reason": "Einkaufen", "category": "Lebensmittel"}]';
    
    const costs = parseJSON(json);
    
    expect(costs).toHaveLength(1);
    expect(costs[0].person).toBe('Max');
    expect(costs[0].amount).toBe(50.00);
  });

  it('should handle JSON with string amounts', () => {
    const json = '[{"person": "Max", "amount": "50.00", "reason": "Einkaufen"}]';
    
    const costs = parseJSON(json);
    
    expect(costs[0].amount).toBe(50.00);
  });

  it('should handle invalid JSON', () => {
    const costs = parseJSON('invalid json');
    expect(costs).toEqual([]);
  });

  it('should handle non-array JSON', () => {
    const costs = parseJSON('{"person": "Max"}');
    expect(costs).toEqual([]);
  });

  it('should filter out invalid entries', () => {
    const json = '[{"person": "", "amount": 50}, {"person": "Max", "amount": 50}]';
    
    const costs = parseJSON(json);
    
    expect(costs).toHaveLength(1);
    expect(costs[0].person).toBe('Max');
  });
});
