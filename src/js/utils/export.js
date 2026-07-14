/**
 * Utility functions for exporting and importing cost data
 */

import { sanitizeInput, formatCurrency } from './sanitize.js';
import { formatDate } from '../storage/index.js';

/**
 * Export costs to CSV format
 * @param {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} costs - Array of cost entries
 * @returns {string} CSV formatted string
 */
export function exportToCSV(costs) {
  const headers = ['Datum', 'Person', 'Betrag (€)', 'Grund', 'Kategorie'];
  
  const rows = costs.map(cost => [
    cost.date ? formatDate(cost.date) : '',
    cost.person,
    cost.amount.toFixed(2),
    cost.reason || '',
    cost.category || ''
  ]);
  
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(';'))
  ].join('\n');
  
  return csvContent;
}

/**
 * Export costs to JSON format
 * @param {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} costs - Array of cost entries
 * @returns {string} JSON formatted string
 */
export function exportToJSON(costs) {
  return JSON.stringify(costs, null, 2);
}

/**
 * Trigger a file download in the browser
 * @param {string} content - Content to download
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export costs as CSV file
 * @param {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} costs - Array of cost entries
 */
export function exportCostsAsCSV(costs) {
  const csv = exportToCSV(costs);
  downloadFile(csv, `haushaltskosten_${formatDate(new Date().toISOString().split('T')[0])}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export costs as JSON file
 * @param {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} costs - Array of cost entries
 */
export function exportCostsAsJSON(costs) {
  const json = exportToJSON(costs);
  downloadFile(json, `haushaltskosten_${formatDate(new Date().toISOString().split('T')[0])}.json`, 'application/json;charset=utf-8;');
}

/**
 * Parse date string (DD.MM.YYYY or YYYY-MM-DD)
 * @param {string} dateStr - Date string to parse
 * @returns {string} Date in YYYY-MM-DD format
 */
export function parseDate(dateStr) {
  if (!dateStr) return '';
  
  // Try YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Try DD.MM.YYYY format
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  return '';
}

/**
 * Parse CSV content into costs array
 * @param {string} csvContent - CSV formatted string
 * @returns {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} Array of cost entries
 */
export function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  
  // Skip header if present
  const hasHeader = lines[0].toLowerCase().includes('person') || 
                   lines[0].toLowerCase().includes('betrag') ||
                   lines[0].toLowerCase().includes('datum');
  const startIndex = hasHeader ? 1 : 0;
  
  return lines.slice(startIndex).map(line => {
    const values = line.split(';').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    
    // Handle different CSV formats (with or without date)
    let date = '';
    let person = values[0] || '';
    let amount = parseFloat(values[1]) || 0;
    let reason = values[2] || '';
    let category = values[3] || '';
    
    // If first value looks like a date (YYYY-MM-DD or DD.MM.YYYY)
    if (/^\d{4}-\d{2}-\d{2}$/.test(values[0]) || /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(values[0])) {
      date = parseDate(values[0]);
      person = values[1] || '';
      amount = parseFloat(values[2]) || 0;
      reason = values[3] || '';
      category = values[4] || '';
    }
    
    // If amount is in first column (wrong order)
    if (!isNaN(parseFloat(person)) && isNaN(amount)) {
      [person, amount] = [amount, parseFloat(person)];
    }
    
    return {
      person: sanitizeInput(person),
      amount: amount,
      reason: sanitizeInput(reason),
      category: sanitizeInput(category) || undefined,
      date: date || undefined
    };
  }).filter(cost => cost.person); // Filter out invalid entries
}

/**
 * Parse JSON content into costs array
 * @param {string} jsonContent - JSON formatted string
 * @returns {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} Array of cost entries
 */
export function parseJSON(jsonContent) {
  try {
    const parsed = JSON.parse(jsonContent);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.map(cost => ({
      person: sanitizeInput(cost.person || ''),
      amount: typeof cost.amount === 'number' ? cost.amount : parseFloat(cost.amount) || 0,
      reason: sanitizeInput(cost.reason || ''),
      category: sanitizeInput(cost.category || '') || undefined,
      date: cost.date ? String(cost.date) : undefined
    })).filter(cost => cost.person);
  } catch (e) {
    console.error('Fehler beim Parsen von JSON:', e);
    return [];
  }
}

/**
 * Read a file and parse its content
 * @param {File} file - File object from input
 * @param {string} type - Type of file ('csv' or 'json')
 * @returns {Promise<Array<{person: string, amount: number, reason: string, category?: string, date?: string}>>} Promise with parsed costs
 */
export function readFile(file, type) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (type === 'csv') {
          resolve(parseCSV(content));
        } else if (type === 'json') {
          resolve(parseJSON(content));
        } else {
          reject(new Error('Unsupported file type'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
}
