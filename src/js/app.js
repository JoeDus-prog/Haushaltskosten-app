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
  filterCostsByDate,
  getAllCategories,
  getCurrentDate,
  initializeStorage,
  importCosts,
  clearAllCosts
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
function handleFormSubmit(person, amount, reason, category, date) {
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
  addCost(person, amount, reason, category, date);
  
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
  const allCosts = loadCosts();
  const filteredCosts = applyFilters(allCosts);
  
  // Find the actual index in the full list
  const actualIndex = allCosts.findIndex(cost => {
    return cost.person === filteredCosts[index]?.person &&
           cost.amount === filteredCosts[index]?.amount &&
           cost.date === filteredCosts[index]?.date;
  });
  
  if (actualIndex !== -1) {
    deleteCost(actualIndex);
    updateCostList();
    updateChart();
  }
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
function updateCostList() {
  const allCosts = loadCosts();
  const filteredCosts = applyFilters(allCosts);
  
  renderCosts(filteredCosts);
}

/**
 * Update the chart with current data
 */
function updateChart() {
  const allCosts = loadCosts();
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
  const allCosts = loadCosts();
  const filteredCosts = applyFilters(allCosts);
  exportCostsAsCSV(filteredCosts);
}

/**
 * Handle JSON export
 */
function handleExportJSON() {
  const allCosts = loadCosts();
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

  // DOM-Elemente für Kategorien und Datum hinzufügen
  addCategoryAndDateElements();

  // Kosten laden und anzeigen
  const costs = loadCosts();
  renderCosts(costs);
  
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
  updateChart();
}

/**
 * Add category and date elements to DOM
 */
function addCategoryAndDateElements() {
  // Kategorie-Input zum Formular hinzufügen (falls nicht vorhanden)
  if (!document.getElementById('category')) {
    const form = document.getElementById('costForm');
    if (form) {
      const categoryGroup = document.createElement('div');
      categoryGroup.className = 'form-group';
      categoryGroup.innerHTML = `
        <select id="category" aria-label="Kategorie">
          <option value="">Keine Kategorie</option>
          <option value="Lebensmittel">Lebensmittel</option>
          <option value="Haushalt">Haushalt</option>
          <option value="Miete">Miete</option>
          <option value="Strom">Strom</option>
          <option value="Internet">Internet</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>
      `;
      form.insertBefore(categoryGroup, form.lastElementChild);
    }
  }
  
  // Datum-Input zum Formular hinzufügen (falls nicht vorhanden)
  if (!document.getElementById('date')) {
    const form = document.getElementById('costForm');
    if (form) {
      const dateGroup = document.createElement('div');
      dateGroup.className = 'form-group';
      dateGroup.innerHTML = `
        <input type="date" id="date" aria-label="Datum" value="${getCurrentDate()}">
      `;
      form.insertBefore(dateGroup, form.lastElementChild);
    }
  }
  
  // Datums-Filter hinzufügen (falls nicht vorhanden)
  if (!document.getElementById('dateFilter')) {
    const filterGroup = document.querySelector('.filter-group');
    if (filterGroup) {
      const dateFilterHTML = `
        <span style="margin: 0 10px;">|</span>
        <label for="dateFilter">Zeitraum:</label>
        <select id="dateFilter" aria-label="Zeitraum filtern">
          <option value="">Alle Daten</option>
        </select>
        <div id="customDateContainer" style="display: none; margin-top: 10px; gap: 10px; flex-wrap: wrap;">
          <input type="date" id="customDateStart" aria-label="Startdatum">
          <span>bis</span>
          <input type="date" id="customDateEnd" aria-label="Enddatum">
          <button id="applyCustomDate" class="btn btn-secondary" style="margin-left: 10px;">Anwenden</button>
        </div>
      `;
      filterGroup.insertAdjacentHTML('beforeend', dateFilterHTML);
    }
  }
  
  // Export/Import Buttons hinzufügen (falls nicht vorhanden)
  if (!document.getElementById('exportCSV')) {
    const summary = document.getElementById('summary');
    if (summary) {
      const exportGroup = document.createElement('div');
      exportGroup.className = 'export-group';
      exportGroup.innerHTML = `
        <button id="exportCSV" class="btn btn-secondary">Export (CSV)</button>
        <button id="exportJSON" class="btn btn-secondary">Export (JSON)</button>
        <input type="file" id="importFile" accept=".csv,.json" style="display: none;">
        <button id="importBtn" class="btn btn-secondary">Import</button>
        <button id="clearAll" class="btn btn-danger">Alle löschen</button>
      `;
      summary.after(exportGroup);
    }
  }
  
  // Chart Container hinzufügen (falls nicht vorhanden)
  if (!document.getElementById('costChart')) {
    const costList = document.getElementById('costList');
    if (costList) {
      const chartContainer = document.createElement('div');
      chartContainer.className = 'chart-container';
      chartContainer.innerHTML = '<canvas id="costChart"></canvas>';
      costList.after(chartContainer);
    }
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
