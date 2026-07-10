/**
 * Haushaltskosten-App
 * Main application module
 */

import { 
  getCosts, 
  addCost, 
  removeCost, 
  calculateTotal,
  initializeStorage 
} from './storage.js';
import { 
  sanitizeInput, 
  validatePerson, 
  validateAmount, 
  validateReason 
} from './validation.js';
import { formatAmount } from './utils.js';

// DOM-Elemente cachen
const elements = {
  costForm: document.getElementById('costForm'),
  person: document.getElementById('person'),
  amount: document.getElementById('amount'),
  reason: document.getElementById('reason'),
  costList: document.getElementById('costList'),
  totalAmount: document.getElementById('totalAmount')
};

// Kosten in der Liste anzeigen
function renderCosts() {
  const costs = getCosts();
  
  // Liste leeren
  elements.costList.innerHTML = '';

  if (costs.length === 0) {
    elements.costList.innerHTML = `
      <li class="empty-message">
        Keine Kosten vorhanden. Füge einen neuen Eintrag hinzu!
      </li>
    `;
    elements.totalAmount.textContent = '0€';
    return;
  }

  // Jeden Kosteneintrag hinzufügen
  costs.forEach((cost, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;
    li.innerHTML = `
      <div class="cost-info">
        <span class="cost-person">${sanitizeInput(cost.person)}</span>:
        <span class="cost-amount">${sanitizeInput(cost.amount)}€</span>
        ${cost.reason ? `<span class="cost-reason">(${sanitizeInput(cost.reason)})</span>` : ''}
      </div>
      <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">Löschen</button>
    `;
    elements.costList.appendChild(li);
  });

  // Gesamtbetrag aktualisieren
  const total = calculateTotal(costs);
  elements.totalAmount.textContent = `${formatAmount(total)}€`;
}

// Formular-Event-Listener mit Event Delegation
function initForm() {
  elements.costForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const person = elements.person.value.trim();
    const amount = elements.amount.value.trim();
    const reason = elements.reason.value.trim();

    // Validierung
    if (!validatePerson(person)) {
      alert('Bitte geben Sie einen gültigen Namen ein (1-50 Zeichen).');
      elements.person.focus();
      return;
    }

    if (!validateAmount(amount)) {
      alert('Bitte geben Sie einen gültigen Betrag ein (positive Zahl).');
      elements.amount.focus();
      return;
    }

    if (reason && !validateReason(reason)) {
      alert('Der Grund darf maximal 100 Zeichen lang sein.');
      elements.reason.focus();
      return;
    }

    // Betrag als Zahl formatieren (2 Dezimalstellen)
    const amountNum = formatAmount(amount);

    // Kosten hinzufügen
    addCost({
      person: sanitizeInput(person),
      amount: amountNum,
      reason: sanitizeInput(reason)
    });

    // Formular zurücksetzen
    elements.costForm.reset();
    elements.person.focus();
    
    // Liste aktualisieren
    renderCosts();
  });
}

// Event Delegation für Lösch-Buttons
function initEventDelegation() {
  elements.costList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      if (!isNaN(index)) {
        // Bestätigungsdialog
        if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
          removeCost(index);
          renderCosts();
        }
      }
    }
  });
}

// Auto-Focus und Enter-Navigation
function initFormNavigation() {
  // Auto-Focus auf erstes Feld
  elements.person.focus();
  
  // Enter-Navigation
  elements.person.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elements.amount.focus();
    }
  });
  
  elements.amount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elements.reason.focus();
    }
  });
  
  elements.reason.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elements.costForm.dispatchEvent(new Event('submit'));
    }
  });
}

// Initialisierung
function init() {
  // Storage initialisieren
  initializeStorage();

  // Kosten anzeigen
  renderCosts();

  // Formular initialisieren
  initForm();
  
  // Event Delegation initialisieren
  initEventDelegation();
  
  // Formular-Navigation initialisieren
  initFormNavigation();
}

// beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', init);
