/**
 * DOM manipulation functions for the cost list
 */

import { sanitizeInput, formatCurrency } from '../utils/index.js';

// DOM-Elemente cachen
const elements = {
  costForm: document.getElementById('costForm'),
  person: document.getElementById('person'),
  amount: document.getElementById('amount'),
  reason: document.getElementById('reason'),
  category: document.getElementById('category'),
  costList: document.getElementById('costList'),
  totalAmount: document.getElementById('totalAmount'),
  categoryFilter: document.getElementById('categoryFilter')
};

/**
 * Render all costs in the list
 * @param {Array<{person: string, amount: number, reason: string, category?: string}>} costs - Array of cost entries to render
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

  // Jeden Kosteneintrag hinzufügen
  costs.forEach((cost, index) => {
    const li = document.createElement('div');
    li.setAttribute('role', 'listitem');
    li.dataset.index = index;
    li.dataset.category = cost.category || '';
    li.innerHTML = `
      <div class="cost-info">
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
    const total = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
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

    onSubmit(person, amount, reason, category);

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
    onFilter(e.target.value);
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
 * @param {'person' | 'amount' | 'reason' | 'category'} field - Field to focus on
 */
export function focusField(field) {
  const fieldMap = {
    person: elements.person,
    amount: elements.amount,
    reason: elements.reason,
    category: elements.category
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
