/**
 * Haushaltskosten-App
 * Verwaltung von Haushaltskosten mit localStorage
 */

// Selektoren als Konstanten
const SELECTORS = {
  costForm: '#costForm',
  person: '#person',
  amount: '#amount',
  reason: '#reason',
  costList: '#costList',
  totalAmount: '#totalAmount'
};

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
 * Sanitize user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (!input) return '';
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validate amount input
 * @param {string} amount - Amount to validate
 * @returns {boolean} Is valid
 */
function validateAmount(amount) {
  if (!amount || amount.trim() === '') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate person input
 * @param {string} person - Person name to validate
 * @returns {boolean} Is valid
 */
function validatePerson(person) {
  return person && person.trim().length > 0 && person.trim().length <= 50;
}

/**
 * Validate reason input
 * @param {string} reason - Reason to validate
 * @returns {boolean} Is valid
 */
function validateReason(reason) {
  return !reason || (reason.trim().length > 0 && reason.trim().length <= 100);
}

// Kosten aus localStorage laden
function loadCosts() {
  try {
    const savedCosts = localStorage.getItem('haushaltskosten');
    return savedCosts ? JSON.parse(savedCosts) : [];
  } catch (e) {
    console.error('Fehler beim Laden der Kosten:', e);
    return [];
  }
}

// Kosten in localStorage speichern
function saveCosts(costs) {
  localStorage.setItem('haushaltskosten', JSON.stringify(costs));
}

// Gesamtbetrag berechnen
function calculateTotal(costs) {
  return costs.reduce((total, cost) => total + (typeof cost.amount === 'number' ? cost.amount : parseFloat(cost.amount) || 0), 0);
}

// Kosten in der Liste anzeigen
function renderCosts() {
  const costs = loadCosts();
  
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
        <span class="cost-amount">${typeof cost.amount === 'number' ? cost.amount.toFixed(2) : cost.amount}€</span>
        ${cost.reason ? `<span class="cost-reason">(${sanitizeInput(cost.reason)})</span>` : ''}
      </div>
      <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">Löschen</button>
    `;
    elements.costList.appendChild(li);
  });

  // Gesamtbetrag aktualisieren
  const total = calculateTotal(costs);
  elements.totalAmount.textContent = `${total.toFixed(2)}€`;
}

// Neuen Kosteneintrag hinzufügen
function addCost(person, amount, reason) {
  const costs = loadCosts();
  costs.push({ person, amount: parseFloat(amount), reason });
  saveCosts(costs);
  renderCosts();
}

// Kosteneintrag löschen
function deleteCost(index) {
  const costs = loadCosts();
  if (index >= 0 && index < costs.length) {
    costs.splice(index, 1);
    saveCosts(costs);
    renderCosts();
  }
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

    if (!validateReason(reason)) {
      alert('Der Grund darf maximal 100 Zeichen lang sein.');
      elements.reason.focus();
      return;
    }

    // Kosten hinzufügen
    addCost(sanitizeInput(person), amount, sanitizeInput(reason));

    // Formular zurücksetzen
    elements.costForm.reset();
    elements.person.focus();
  });
}

// Event Delegation für Lösch-Buttons
function initEventDelegation() {
  elements.costList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      if (!isNaN(index)) {
        deleteCost(index);
      }
    }
  });
}

// Initialisierung
function init() {
  // Standard-Kosten hinzufügen, falls keine vorhanden
  const costs = loadCosts();
  if (costs.length === 0) {
    saveCosts([
      { person: 'Max', amount: 50.00, reason: 'Einkaufen' },
      { person: 'Anna', amount: 30.00, reason: 'Strom' }
    ]);
  }

  // Kosten anzeigen
  renderCosts();

  // Formular initialisieren
  initForm();
  
  // Event Delegation initialisieren
  initEventDelegation();
}

// beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', init);
