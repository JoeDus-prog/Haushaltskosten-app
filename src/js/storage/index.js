/**
 * Storage functions for managing costs in localStorage
 */

const STORAGE_KEY = 'haushaltskosten';

/**
 * Load costs from localStorage
 * @returns {Array<{person: string, amount: number, reason: string}>} Array of cost entries
 */
export function loadCosts() {
  try {
    const savedCosts = localStorage.getItem(STORAGE_KEY);
    if (!savedCosts) return [];
    
    const parsed = JSON.parse(savedCosts);
    
    // Normalize amounts to numbers (for backward compatibility)
    return parsed.map(cost => ({
      ...cost,
      amount: typeof cost.amount === 'number' ? cost.amount : parseFloat(cost.amount) || 0
    }));
  } catch (e) {
    console.error('Fehler beim Laden der Kosten:', e);
    return [];
  }
}

/**
 * Save costs to localStorage
 * @param {Array<{person: string, amount: number, reason: string}>} costs - Array of cost entries to save
 */
export function saveCosts(costs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

/**
 * Add a new cost entry
 * @param {string} person - Person name
 * @param {number} amount - Amount
 * @param {string} [reason] - Optional reason
 */
export function addCost(person, amount, reason = '') {
  const costs = loadCosts();
  costs.push({ person, amount: parseFloat(amount), reason });
  saveCosts(costs);
}

/**
 * Delete a cost entry by index
 * @param {number} index - Index of the cost entry to delete
 */
export function deleteCost(index) {
  const costs = loadCosts();
  if (index >= 0 && index < costs.length) {
    costs.splice(index, 1);
    saveCosts(costs);
  }
}

/**
 * Calculate total amount of all costs
 * @param {Array<{person: string, amount: number, reason: string}>} [costs] - Optional array of costs (defaults to loaded costs)
 * @returns {number} Total amount
 */
export function calculateTotal(costs = null) {
  const costsToUse = costs || loadCosts();
  return costsToUse.reduce((total, cost) => total + (cost.amount || 0), 0);
}

/**
 * Initialize storage with default costs if empty
 */
export function initializeStorage() {
  const costs = loadCosts();
  if (costs.length === 0) {
    saveCosts([
      { person: 'Max', amount: 50.00, reason: 'Einkaufen' },
      { person: 'Anna', amount: 30.00, reason: 'Strom' }
    ]);
  }
}
