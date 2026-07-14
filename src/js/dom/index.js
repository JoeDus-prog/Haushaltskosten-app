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
  costList: document.getElementById('costList'),
  totalAmount: document.getElementById('totalAmount')
};

/**
 * Render all costs in the list
 * @param {Array<{person: string, amount: number, reason: string}>} costs - Array of cost entries to render
 */
export function renderCosts(costs) {
  // Liste leeren
  elements.costList.innerHTML = '';

  // Jeden Kosteneintrag hinzufügen
  costs.forEach((cost, index) => {
    const li = document.createElement('div');
    li.setAttribute('role', 'listitem');
    li.dataset.index = index;
    li.innerHTML = `
      <div class="cost-info">
        <span class="cost-person">${sanitizeInput(cost.person)}</span>:
        <span class="cost-amount">${formatCurrency(cost.amount)}</span>
        ${cost.reason ? `<span class="cost-reason">(${sanitizeInput(cost.reason)})</span>` : ''}
      </div>
      <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">Löschen</button>
    `;
    elements.costList.appendChild(li);
  });

  // Gesamtbetrag aktualisieren
  const total = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  elements.totalAmount.textContent = formatCurrency(total);
}

/**
 * Initialize form event listeners
 * @param {Function} onSubmit - Callback function for form submission
 */
export function initForm(onSubmit) {
  elements.costForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const person = elements.person.value.trim();
    const amount = elements.amount.value.trim();
    const reason = elements.reason.value.trim();

    onSubmit(person, amount, reason);

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
 * Show an error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
  alert(message);
}

/**
 * Focus on a form field
 * @param {'person' | 'amount' | 'reason'} field - Field to focus on
 */
export function focusField(field) {
  const fieldMap = {
    person: elements.person,
    amount: elements.amount,
    reason: elements.reason
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
