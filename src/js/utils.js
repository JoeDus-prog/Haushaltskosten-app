/**
 * Utility Module
 * Helper functions for the Haushaltskosten-App
 */

/**
 * Format amount to always have 2 decimal places
 * @param {string|number} amount - Amount to format
 * @returns {string} Formatted amount with 2 decimal places
 */
export function formatAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  // Use toFixed(2) which rounds to 2 decimal places
  return num.toFixed(2);
}

/**
 * Parse amount string to float
 * @param {string} amount - Amount string to parse
 * @returns {number} Parsed amount
 */
export function parseAmount(amount) {
  const num = parseFloat(amount);
  return isNaN(num) ? 0 : num;
}

/**
 * Group costs by person
 * @param {Array} costs - Array of cost objects
 * @returns {Object} Costs grouped by person
 */
export function groupCostsByPerson(costs) {
  return costs.reduce((acc, cost) => {
    if (!acc[cost.person]) {
      acc[cost.person] = [];
    }
    acc[cost.person].push(cost);
    return acc;
  }, {});
}

/**
 * Calculate statistics from costs
 * @param {Array} costs - Array of cost objects
 * @returns {Object} Statistics object
 */
export function getStatistics(costs) {
  const total = calculateTotal(costs);
  const count = costs.length;
  const average = count > 0 ? total / count : 0;
  
  const byPerson = groupCostsByPerson(costs);
  const personTotals = Object.entries(byPerson).map(([person, personCosts]) => ({
    person,
    total: personCosts.reduce((sum, cost) => sum + parseFloat(cost.amount) || 0, 0),
    count: personCosts.length
  }));
  
  return {
    total,
    count,
    average: parseFloat(average.toFixed(2)),
    byPerson: personTotals
  };
}

/**
 * Calculate total from costs array
 * @param {Array} costs - Array of cost objects
 * @returns {number} Total amount
 */
function calculateTotal(costs) {
  return costs.reduce((total, cost) => {
    const amount = parseFloat(cost.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Export costs to CSV format
 * @param {Array} costs - Array of cost objects
 */
export function exportToCSV(costs) {
  const headers = ['Person', 'Betrag (€)', 'Grund'];
  const rows = costs.map(cost => [
    cost.person,
    cost.amount,
    cost.reason || ''
  ]);
  
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(';'))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'haushaltskosten.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import costs from CSV string
 * @param {string} csv - CSV string to import
 * @returns {Array} Array of cost objects
 */
export function importFromCSV(csv) {
  const lines = csv.split('\n');
  const costs = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Parse CSV line handling quoted values
    const values = parseCSVLine(lines[i]);
    
    if (values.length >= 2) {
      const person = values[0].trim();
      const amount = values[1].trim();
      const reason = values.length >= 3 ? values[2].trim() : '';
      
      if (person && amount) {
        costs.push({ person, amount, reason });
      }
    }
  }
  
  return costs;
}

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - CSV line to parse
 * @returns {Array} Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}
