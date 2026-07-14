/**
 * DOM manipulation functions for the cost list
 */

import { sanitizeInput, formatCurrency } from '../utils/index.js';
import { formatDate } from '../storage/index.js';

// DOM-Elemente cachen
const elements = {
  costForm: document.getElementById('costForm'),
  person: document.getElementById('person'),
  amount: document.getElementById('amount'),
  reason: document.getElementById('reason'),
  category: document.getElementById('category'),
  date: document.getElementById('date'),
  costList: document.getElementById('costList'),
  totalAmount: document.getElementById('totalAmount'),
  categoryFilter: document.getElementById('categoryFilter'),
  dateFilter: document.getElementById('dateFilter'),
  customDateStart: document.getElementById('customDateStart'),
  customDateEnd: document.getElementById('customDateEnd'),
  applyCustomDate: document.getElementById('applyCustomDate')
};

/**
 * Render all costs in the list
 * @param {Array<{person: string, amount: number, reason: string, category?: string, date?: string}>} costs - Array of cost entries to render
 */
export function renderCosts(costs) {
  // Liste leeren
  if (elements.costList) {
    elements.costList.innerHTML = '';
  }

  if (!costs || costs.length === 0) {
    if (elements.costList) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'Keine Kosten vorhanden. Füge welche hinzu!';
      elements.costList.appendChild(emptyMessage);
    }
    return;
  }

  // Sort by date (newest first)
  const sortedCosts = [...costs].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  // Jeden Kosteneintrag hinzufügen
  sortedCosts.forEach((cost, index) => {
    const li = document.createElement('div');
    li.setAttribute('role', 'listitem');
    li.dataset.index = index;
    li.dataset.category = cost.category || '';
    li.dataset.date = cost.date || '';
    li.innerHTML = `
      <div class="cost-info">
        ${cost.date ? `<span class="cost-date">${formatDate(cost.date)}</span>` : ''}
        <span class="cost-person">${sanitizeInput(cost.person)}</span>:
        <span class="cost-amount">${formatCurrency(cost.amount)}</span>
        ${cost.reason ? `<span class="cost-reason">(${sanitizeInput(cost.reason)})</span>` : ''}
        ${cost.category ? `<span class="cost-category">[${sanitizeInput(cost.category)}]</span>` : ''}
      </div>
      <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">Löschen</button>
    `;
    if (elements.costList) {
      elements.costList.appendChild(li);
    }
  });

  // Gesamtbetrag aktualisieren
  if (elements.totalAmount) {
    const total = sortedCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
    elements.totalAmount.textContent = formatCurrency(total);
  }
}

/**
 * Update category filter dropdown
 * @param {string[]} categories - Array of category names
 */
export function updateCategoryFilter(categories) {
  if (!elements.categoryFilter) return;
  
  // Aktuelle Auswahl speichern
  const currentValue = elements.categoryFilter.value;
  
  elements.categoryFilter.innerHTML = '<option value="">Alle Kategorien</option>';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    elements.categoryFilter.appendChild(option);
  });
  
  // Auswahl wiederherstellen
  if (categories.includes(currentValue)) {
    elements.categoryFilter.value = currentValue;
  }
}

/**
 * Update date filter dropdown
 */
export function updateDateFilter() {
  if (!elements.dateFilter) return;
  
  const dateOptions = [
    { value: '', label: 'Alle Daten' },
    { value: 'today', label: 'Heute' },
    { value: 'week', label: 'Letzte 7 Tage' },
    { value: 'month', label: 'Letzter Monat' },
    { value: 'year', label: 'Letztes Jahr' },
    { value: 'custom', label: 'Benutzerdefiniert' }
  ];
  
  elements.dateFilter.innerHTML = '';
  dateOptions.forEach(option => {
    const optElement = document.createElement('option');
    optElement.value = option.value;
    optElement.textContent = option.label;
    elements.dateFilter.appendChild(optElement);
  });
}

/**
 * Show/hide custom date inputs
 * @param {boolean} show - Whether to show custom date inputs
 */
export function toggleCustomDateInputs(show) {
  const customDateContainer = document.getElementById('customDateContainer');
  if (customDateContainer) {
    customDateContainer.style.display = show ? 'flex' : 'none';
  }
}

/**
 * Initialize form event listeners
 * @param {Function} onSubmit - Callback function for form submission
 */
export function initForm(onSubmit) {
  if (!elements.costForm) return;
  
  elements.costForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const person = elements.person.value.trim();
    const amount = elements.amount.value.trim();
    const reason = elements.reason ? elements.reason.value.trim() : '';
    const category = elements.category ? elements.category.value : '';
    const date = elements.date ? elements.date.value : '';

    onSubmit(person, amount, reason, category, date);

    // Formular zurücksetzen
    elements.costForm.reset();
    elements.person.focus();
  });
}

/**
 * Initialize event delegation for delete buttons
 * @param {Function} onDelete - Callback function for delete button click
 */
export function initEventDelegation(onDelete) {
  if (!elements.costList) return;
  
  elements.costList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      if (!isNaN(index)) {
        onDelete(index);
      }
    }
  });
}

/**
 * Initialize category filter listener
 * @param {Function} onFilter - Callback function for filter change
 */
export function initCategoryFilter(onFilter) {
  if (!elements.categoryFilter) return;
  
  elements.categoryFilter.addEventListener('change', (e) => {
    onFilter('category', e.target.value);
  });
}

/**
 * Initialize date filter listener
 * @param {Function} onFilter - Callback function for filter change
 */
export function initDateFilter(onFilter) {
  if (!elements.dateFilter) return;
  
  elements.dateFilter.addEventListener('change', (e) => {
    const value = e.target.value;
    toggleCustomDateInputs(value === 'custom');
    
    if (value === 'custom') {
      // Use current dates as default
      if (elements.customDateStart) {
        elements.customDateStart.value = new Date().toISOString().split('T')[0];
      }
      if (elements.customDateEnd) {
        elements.customDateEnd.value = new Date().toISOString().split('T')[0];
      }
    } else {
      onFilter('date', value, '', '');
    }
  });
}

/**
 * Initialize custom date apply button
 * @param {Function} onFilter - Callback function for filter change
 */
export function initCustomDateApply(onFilter) {
  if (!elements.applyCustomDate) return;
  
  elements.applyCustomDate.addEventListener('click', () => {
    const startDate = elements.customDateStart ? elements.customDateStart.value : '';
    const endDate = elements.customDateEnd ? elements.customDateEnd.value : '';
    onFilter('date', 'custom', startDate, endDate);
  });
}

/**
 * Show an error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
  alert(message);
}

/**
 * Focus on a form field
 * @param {'person' | 'amount' | 'reason' | 'category' | 'date'} field - Field to focus on
 */
export function focusField(field) {
  const fieldMap = {
    person: elements.person,
    amount: elements.amount,
    reason: elements.reason,
    category: elements.category,
    date: elements.date
  };
  fieldMap[field]?.focus();
}

/**
 * Get form elements
 * @returns {Object} Form elements
 */
export function getElements() {
  return elements;
}
