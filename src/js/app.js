/**
 * Haushaltskosten-App
 * Hauptmodul - Verwaltung von Haushaltskosten mit localStorage
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
  getAllCategories,
  initializeStorage,
  importCosts,
  clearAllCosts
} from './storage/index.js';
import { 
  renderCosts, 
  updateCategoryFilter,
  initForm, 
  initEventDelegation,
  initCategoryFilter,
  showError,
  focusField 
} from './dom/index.js';
import { 
  exportCostsAsCSV,
  exportCostsAsJSON,
  readFile 
} from './utils/export.js';

// State
let currentFilter = '';

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
 */
function handleFormSubmit(person, amount, reason, category) {
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
  addCost(person, amount, reason, category);
  
  // Liste aktualisieren
  updateCostList();
  updateChart();
  updateCategoryFilterOptions();
}

/**
 * Handle cost deletion
 * @param {number} index - Index of cost to delete
 */
function handleDeleteCost(index) {
  deleteCost(index);
  updateCostList();
  updateChart();
}

/**
 * Handle category filter change
 * @param {string} category - Selected category
 */
function handleFilterChange(category) {
  currentFilter = category;
  updateCostList();
}

/**
 * Update the cost list based on current filter
 */
function updateCostList() {
  const allCosts = loadCosts();
  const filteredCosts = currentFilter 
    ? filterCostsByCategory(currentFilter)
    : allCosts;
  
  renderCosts(filteredCosts);
}

/**
 * Update the chart with current data
 */
function updateChart() {
  const costs = loadCosts();
  const totalsByPerson = calculateTotalByPerson(costs);
  const totalsByCategory = calculateTotalByCategory(costs);
  
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
          text: 'Ausgaben nach Person',
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
function handleExportCSV() {
  const costs = loadCosts();
  exportCostsAsCSV(costs);
}

/**
 * Handle JSON export
 */
function handleExportJSON() {
  const costs = loadCosts();
  exportCostsAsJSON(costs);
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
      importCosts(costs);
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
function handleClearAll() {
  if (confirm('Möchtest du wirklich alle Kosten löschen?')) {
    clearAllCosts();
    updateCostList();
    updateChart();
  }
}

/**
 * Initialize the application
 */
function init() {
  // Storage initialisieren
  initializeStorage();

  // Kosten laden und anzeigen
  const costs = loadCosts();
  renderCosts(costs);
  
  // Kategorien-Filter aktualisieren
  updateCategoryFilterOptions();

  // Formular initialisieren
  initForm(handleFormSubmit);
  
  // Event Delegation initialisieren
  initEventDelegation(handleDeleteCost);
  
  // Kategorien-Filter initialisieren
  initCategoryFilter(handleFilterChange);
  
  // Export/Import Buttons initialisieren
  initExportImportButtons();
  
  // Chart initialisieren
  updateChart();
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
