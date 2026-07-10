/**
 * Storage Module
 * Handles all localStorage operations for the Haushaltskosten-App
 */

const STORAGE_KEY = 'haushaltskosten';

/**
 * Get all costs from localStorage
 * @returns {Array} Array of cost objects
 */
export function getCosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    // If JSON parsing fails, return empty array
    return [];
  }
}

/**
 * Save costs to localStorage
 * @param {Array} costs - Array of cost objects to save
 */
export function setCosts(costs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

/**
 * Add a new cost to localStorage
 * @param {Object} cost - Cost object to add
 */
export function addCost(cost) {
  const costs = getCosts();
  costs.push(cost);
  setCosts(costs);
}

/**
 * Remove a cost by index from localStorage
 * @param {number} index - Index of cost to remove
 */
export function removeCost(index) {
  const costs = getCosts();
  if (index >= 0 && index < costs.length) {
    costs.splice(index, 1);
    setCosts(costs);
  }
}

/**
 * Calculate total amount from all costs
 * @param {Array} costs - Array of cost objects
 * @returns {number} Total amount
 */
export function calculateTotal(costs) {
  return costs.reduce((total, cost) => {
    const amount = parseFloat(cost.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
}

/**
 * Initialize with default costs if none exist
 */
export function initializeStorage() {
  const costs = getCosts();
  if (costs.length === 0) {
    setCosts([
      { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
      { person: 'Anna', amount: '30.00', reason: 'Strom' }
    ]);
  }
}
