/**
 * Haushaltskosten-App
 * Hauptmodul - Verwaltung von Haushaltskosten mit Firebase/localStorage
 */

import { 
  validateAmount, 
  validatePerson, 
  validateReason 
} from './validation/index.js';
import { 
  loadCosts, 
  addCost, 
  deleteCost, 
  calculateTotalByCategory,
  calculateTotalByPerson,
  filterCostsByCategory,
  filterCostsByDate,
  getAllCategories,
  getCurrentDate,
  initializeStorage,
  importCosts,
  clearAllCosts,
  setCostsUpdateCallback,
  unsubscribeFromFirebase
} from './storage/index.js';
import { 
  renderCosts, 
  updateCategoryFilter,
  updateDateFilter,
  toggleCustomDateInputs,
  initForm, 
  initEventDelegation,
  initCategoryFilter,
  initDateFilter,
  initCustomDateApply,
  showError,
  focusField 
} from './dom/index.js';
import { 
  exportCostsAsCSV,
  exportCostsAsJSON,
  readFile 
} from './utils/export.js';
import { isFirebaseEnabled } from './firebase/index.js';

// State
let currentFilters = {
  category: '',
  date: '',
  startDate: '',
  endDate: ''
};

// Default categories
const DEFAULT_CATEGORIES = [
  'Lebensmittel',
  'Haushalt', 
  'Miete',
  'Strom',
  'Internet',
  'Sonstiges'
];

/**
 * Handle form submission
 * @param {string} person - Person name
 * @param {string} amount - Amount as string
 * @param {string} reason - Optional reason
 * @param {string} category - Optional category
 * @param {string} date - Optional date (YYYY-MM-DD)
 */
async function handleFormSubmit(person, amount, reason, category, date) {
  // Validierung
  if (!validatePerson(person)) {
    showError('Bitte geben Sie einen gültigen Namen ein (1-50 Zeichen).');
    focusField('person');
    return;
  }

  if (!validateAmount(amount)) {
    showError('Bitte geben Sie einen gültigen Betrag ein (positive Zahl).');
    focusField('amount');
    return;
  }

  if (!validateReason(reason)) {
    showError('Der Grund darf maximal 100 Zeichen lang sein.');
    focusField('reason');
    return;
  }

  // Kosten hinzufügen
  await addCost(person, amount, reason, category, date);
  
  // Liste aktualisieren
  updateCostList();
  updateChart();
  updateCategoryFilterOptions();
}

/**
 * Handle cost deletion
 * @param {number} index - Index of cost to delete
 */
async function handleDeleteCost(index) {
  const allCosts = await loadCosts();
  const filteredCosts = applyFilters(allCosts);
  
  // Find the actual cost object
  const costToDelete = filteredCosts[index];
  if (!costToDelete) return;
  
  // Delete by ID (for Firebase) or index (for localStorage)
  if (isFirebaseEnabled() && costToDelete.id) {
    await deleteCost(costToDelete.id);
  } else {
    await deleteCost(index);
  }
  
  updateCostList();
  updateChart();
}

/**
 * Handle filter change
 * @param {string} filterType - Type of filter ('category' or 'date')
 * @param {string} value - Filter value
 * @param {string} [startDate] - Start date for custom range
 * @param {string} [endDate] - End date for custom range
 */
function handleFilterChange(filterType, value, startDate = '', endDate = '') {
  if (filterType === 'category') {
    currentFilters.category = value;
  } else if (filterType === 'date') {
    currentFilters.date = value;
    currentFilters.startDate = startDate;
    currentFilters.endDate = endDate;
  }
  
  updateCostList();
}

/**
 * Apply all filters to costs
 * @param {Array} costs - Array of costs
 * @returns {Array} Filtered costs
 */
function applyFilters(costs) {
  let filtered = [...costs];
  
  // Apply category filter
  if (currentFilters.category) {
    filtered = filterCostsByCategory(currentFilters.category);
  }
  
  // Apply date filter
  if (currentFilters.date) {
    filtered = filterCostsByDate(
      currentFilters.date,
      currentFilters.startDate,
      currentFilters.endDate
    );
  }
  
  return filtered;
}

/**
 * Update the cost list based on current filters
 */
async function updateCostList() {
  const allCosts = await loadCosts();
  const filteredCosts = applyFilters(allCosts);
  
  renderCosts(filteredCosts);
}

/**
 * Update the chart with current data
 */
async function updateChart() {
  const allCosts = await loadCosts();
  const filteredCosts = applyFilters(allCosts);
  const totalsByPerson = calculateTotalByPerson(filteredCosts);
  const totalsByCategory = calculateTotalByCategory(filteredCosts);
  
  renderChart(totalsByPerson, totalsByCategory);
}

/**
 * Update category filter dropdown with current categories
 */
function updateCategoryFilterOptions() {
  const allCategories = getAllCategories();
  const categories = [...new Set([...DEFAULT_CATEGORIES, ...allCategories])];
  updateCategoryFilter(categories);
}

/**
 * Render chart using Chart.js
 * @param {Object.<string, number>} totalsByPerson - Totals by person
 * @param {Object.<string, number>} totalsByCategory - Totals by category
 */
function renderChart(totalsByPerson, totalsByCategory) {
  const chartContainer = document.getElementById('costChart');
  if (!chartContainer) return;
  
  const ctx = chartContainer.getContext('2d');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (chartContainer.chart) {
    chartContainer.chart.destroy();
  }
  
  // Create new chart
  chartContainer.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(totalsByPerson),
      datasets: [{
        data: Object.values(totalsByPerson),
        backgroundColor: [
          '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400', '#34495e'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: isFirebaseEnabled() ? 'Ausgaben nach Person (Firebase)' : 'Ausgaben nach Person',
          font: {
            size: 16
          }
        }
      }
    }
  });
}

/**
 * Handle CSV export
 */
async function handleExportCSV() {
  const allCosts = await loadCosts();
  const filteredCosts = applyFilters(allCosts);
  exportCostsAsCSV(filteredCosts);
}

/**
 * Handle JSON export
 */
async function handleExportJSON() {
  const allCosts = await loadCosts();
  const filteredCosts = applyFilters(allCosts);
  exportCostsAsJSON(filteredCosts);
}

/**
 * Handle file import
 * @param {Event} event - File input change event
 */
async function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const fileType = file.name.endsWith('.csv') ? 'csv' : 'json';
    const costs = await readFile(file, fileType);
    
    if (costs.length > 0) {
      await importCosts(costs);
      updateCostList();
      updateChart();
      updateCategoryFilterOptions();
      showError(`${costs.length} Kosten erfolgreich importiert!`);
    } else {
      showError('Keine gültigen Kosten in der Datei gefunden.');
    }
  } catch (error) {
    showError(`Fehler beim Import: ${error.message}`);
  } finally {
    // Reset file input
    event.target.value = '';
  }
}

/**
 * Handle clear all costs
 */
async function handleClearAll() {
  if (confirm('Möchtest du wirklich alle Kosten löschen?')) {
    await clearAllCosts();
    updateCostList();
    updateChart();
  }
}

/**
 * Initialize the application
 */
async function init() {
  // Storage initialisieren
  initializeStorage((costs) => {
    // Callback für Echtzeit-Updates
    updateCostList();
    updateChart();
    updateCategoryFilterOptions();
  });

  // Kosten laden und anzeigen
  await updateCostList();
  
  // Kategorien-Filter aktualisieren
  updateCategoryFilterOptions();
  
  // Datums-Filter aktualisieren
  updateDateFilter();

  // Formular initialisieren
  initForm(handleFormSubmit);
  
  // Event Delegation initialisieren
  initEventDelegation(handleDeleteCost);
  
  // Kategorien-Filter initialisieren
  initCategoryFilter(handleFilterChange);
  
  // Datums-Filter initialisieren
  initDateFilter(handleFilterChange);
  
  // Benutzerdefiniertes Datum initialisieren
  initCustomDateApply(handleFilterChange);
  
  // Export/Import Buttons initialisieren
  initExportImportButtons();
  
  // Chart initialisieren
  await updateChart();
  
  // Status anzeigen
  if (isFirebaseEnabled()) {
    console.log('✅ Firebase ist aktiviert - Daten werden synchronisiert');
  } else {
    console.log('ℹ️ Firebase ist deaktiviert - Nutze localStorage');
  }
}

/**
 * Initialize export/import button event listeners
 */
function initExportImportButtons() {
  const exportCSVBtn = document.getElementById('exportCSV');
  const exportJSONBtn = document.getElementById('exportJSON');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');
  const clearAllBtn = document.getElementById('clearAll');
  
  if (exportCSVBtn) {
    exportCSVBtn.addEventListener('click', handleExportCSV);
  }
  
  if (exportJSONBtn) {
    exportJSONBtn.addEventListener('click', handleExportJSON);
  }
  
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImport);
  }
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', handleClearAll);
  }
}

// beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', init);

// Cleanup beim Verlassen der Seite
window.addEventListener('beforeunload', () => {
  unsubscribeFromFirebase();
});
