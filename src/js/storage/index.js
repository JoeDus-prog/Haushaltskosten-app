/**
 * Storage functions for managing costs in localStorage
 */

const STORAGE_KEY = 'haushaltskosten';

/**
 * @typedef {Object} Cost
 * @property {string} person - Name der Person
 * @property {number} amount - Betrag (als Number)
 * @property {string} [reason] - Optional: Grund für die Ausgabe
 * @property {string} [category] - Optional: Kategorie
 * @property {string} [date] - Optional: Datum (YYYY-MM-DD)
 */

/**
 * Get current date as YYYY-MM-DD string
 * @returns {string} Current date in YYYY-MM-DD format
 */
export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display (DD.MM.YYYY)
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

/**
 * Load costs from localStorage
 * @returns {Cost[]} Array of cost entries
 */
export function loadCosts() {
  try {
    const savedCosts = localStorage.getItem(STORAGE_KEY);
    if (!savedCosts) return [];
    
    const parsed = JSON.parse(savedCosts);
    
    // Normalize amounts to numbers and add default date if missing
    return parsed.map(cost => ({
      ...cost,
      amount: typeof cost.amount === 'number' ? cost.amount : parseFloat(cost.amount) || 0,
      date: cost.date || getCurrentDate()
    }));
  } catch (e) {
    console.error('Fehler beim Laden der Kosten:', e);
    return [];
  }
}

/**
 * Save costs to localStorage
 * @param {Cost[]} costs - Array of cost entries to save
 */
export function saveCosts(costs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

/**
 * Add a new cost entry
 * @param {string} person - Person name
 * @param {number|string} amount - Amount
 * @param {string} [reason] - Optional reason
 * @param {string} [category] - Optional category
 * @param {string} [date] - Optional date (YYYY-MM-DD)
 */
export function addCost(person, amount, reason = '', category = '', date = '') {
  const costs = loadCosts();
  costs.push({ 
    person, 
    amount: parseFloat(amount), 
    reason: reason || undefined,
    category: category || undefined,
    date: date || getCurrentDate()
  });
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
 * @param {Cost[]} [costs] - Optional array of costs (defaults to loaded costs)
 * @returns {number} Total amount
 */
export function calculateTotal(costs = null) {
  const costsToUse = costs || loadCosts();
  return costsToUse.reduce((total, cost) => total + (cost.amount || 0), 0);
}

/**
 * Calculate total by category
 * @param {Cost[]} [costs] - Optional array of costs
 * @returns {Object.<string, number>} Totals by category
 */
export function calculateTotalByCategory(costs = null) {
  const costsToUse = costs || loadCosts();
  const totals = {};
  
  costsToUse.forEach(cost => {
    const category = cost.category || 'Ohne Kategorie';
    totals[category] = (totals[category] || 0) + (cost.amount || 0);
  });
  
  return totals;
}

/**
 * Calculate total by person
 * @param {Cost[]} [costs] - Optional array of costs
 * @returns {Object.<string, number>} Totals by person
 */
export function calculateTotalByPerson(costs = null) {
  const costsToUse = costs || loadCosts();
  const totals = {};
  
  costsToUse.forEach(cost => {
    totals[cost.person] = (totals[cost.person] || 0) + (cost.amount || 0);
  });
  
  return totals;
}

/**
 * Filter costs by category
 * @param {string} [category] - Category to filter by (empty = all)
 * @returns {Cost[]} Filtered costs
 */
export function filterCostsByCategory(category = '') {
  const costs = loadCosts();
  if (!category) return costs;
  return costs.filter(cost => cost.category === category);
}

/**
 * Filter costs by date range
 * @param {string} [dateFilter] - Date filter ('today', 'week', 'month', 'year', 'custom')
 * @param {string} [startDate] - Start date for custom range (YYYY-MM-DD)
 * @param {string} [endDate] - End date for custom range (YYYY-MM-DD)
 * @returns {Cost[]} Filtered costs
 */
export function filterCostsByDate(dateFilter = '', startDate = '', endDate = '') {
  const costs = loadCosts();
  const today = new Date();
  
  if (!dateFilter) return costs;
  
  return costs.filter(cost => {
    if (!cost.date) return true;
    
    const costDate = new Date(cost.date + 'T00:00:00');
    
    switch (dateFilter) {
      case 'today':
        return costDate.toDateString() === today.toDateString();
      
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return costDate >= weekAgo && costDate <= today;
      
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        return costDate >= monthAgo && costDate <= today;
      
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        return costDate >= yearAgo && costDate <= today;
      
      case 'custom':
        if (!startDate || !endDate) return true;
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T23:59:59');
        return costDate >= start && costDate <= end;
      
      default:
        return true;
    }
  });
}

/**
 * Get all unique categories
 * @returns {string[]} Array of unique categories
 */
export function getAllCategories() {
  const costs = loadCosts();
  const categories = new Set();
  
  costs.forEach(cost => {
    if (cost.category) {
      categories.add(cost.category);
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Get all unique dates
 * @returns {string[]} Array of unique dates (YYYY-MM-DD)
 */
export function getAllDates() {
  const costs = loadCosts();
  const dates = new Set();
  
  costs.forEach(cost => {
    if (cost.date) {
      dates.add(cost.date);
    }
  });
  
  return Array.from(dates).sort().reverse();
}

/**
 * Get date range for custom filter
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Object} Object with start and end dates
 */
export function getDateRange(startDate, endDate) {
  return { startDate, endDate };
}

/**
 * Initialize storage with default costs if empty
 */
export function initializeStorage() {
  const costs = loadCosts();
  if (costs.length === 0) {
    saveCosts([
      { person: 'Max', amount: 50.00, reason: 'Einkaufen', category: 'Lebensmittel', date: getCurrentDate() },
      { person: 'Anna', amount: 30.00, reason: 'Strom', category: 'Haushalt', date: getCurrentDate() }
    ]);
  }
}

/**
 * Clear all costs
 */
export function clearAllCosts() {
  saveCosts([]);
}

/**
 * Import costs from external source
 * @param {Cost[]} newCosts - Costs to import
 */
export function importCosts(newCosts) {
  const existingCosts = loadCosts();
  const mergedCosts = [...existingCosts, ...newCosts.map(cost => ({
    ...cost,
    date: cost.date || getCurrentDate()
  }))];
  saveCosts(mergedCosts);
}
