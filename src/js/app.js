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
  initializeStorage 
} from './storage/index.js';
import { 
  renderCosts, 
  initForm, 
  initEventDelegation,
  showError,
  focusField 
} from './dom/index.js';

/**
 * Handle form submission
 * @param {string} person - Person name
 * @param {string} amount - Amount as string
 * @param {string} reason - Optional reason
 */
function handleFormSubmit(person, amount, reason) {
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
  addCost(person, amount, reason);
  
  // Liste aktualisieren
  const costs = loadCosts();
  renderCosts(costs);
}

/**
 * Handle cost deletion
 * @param {number} index - Index of cost to delete
 */
function handleDeleteCost(index) {
  deleteCost(index);
  const costs = loadCosts();
  renderCosts(costs);
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

  // Formular initialisieren
  initForm(handleFormSubmit);
  
  // Event Delegation initialisieren
  initEventDelegation(handleDeleteCost);
}

// beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', init);
