/**
 * DOM Module
 * Verantwortlich für die Interaktion mit dem DOM
 */

import { sanitizeInput } from "./validation.js";

// DOM-Elemente cachen
let elements = null;

/**
 * Initialisiert die DOM-Elemente
 */
export function initElements() {
  elements = {
    costForm: document.getElementById("costForm"),
    person: document.getElementById("person"),
    amount: document.getElementById("amount"),
    reason: document.getElementById("reason"),
    costList: document.getElementById("costList"),
    totalAmount: document.getElementById("totalAmount")
  };
}

/**
 * Gibt die DOM-Elemente zurück
 * @returns {Object} DOM-Elemente
 */
export function getElements() {
  if (!elements) {
    initElements();
  }
  return elements;
}

/**
 * Erstellt ein neues Listenelement für einen Kosteneintrag
 * @param {Object} cost - Kosteneintrag
 * @param {number} index - Index des Eintrags
 * @returns {HTMLElement} Listenelement
 */
export function createCostItemElement(cost, index) {
  const li = document.createElement("li");
  li.dataset.index = index;
  li.innerHTML = `
    <div class="cost-info">
      <span class="cost-person">${sanitizeInput(cost.person)}</span>:
      <span class="cost-amount">${sanitizeInput(cost.amount)}€</span>
      ${cost.reason ? `<span class="cost-reason">(${sanitizeInput(cost.reason)})</span>` : ""}
    </div>
    <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">Löschen</button>
  `;
  return li;
}

/**
 * Rendert alle Kosteneinträge in der Liste
 * @param {Array<Object>} costs - Array mit Kosteneinträgen
 */
export function renderCosts(costs) {
  const { costList } = getElements();

  // Liste leeren
  costList.innerHTML = "";

  // Jeden Kosteneintrag hinzufügen
  costs.forEach((cost, index) => {
    const li = createCostItemElement(cost, index);
    costList.appendChild(li);
  });
}

/**
 * Aktualisiert den Gesamtbetrag
 * @param {number} total - Gesamtbetrag
 */
export function updateTotalAmount(total) {
  const { totalAmount } = getElements();
  totalAmount.textContent = `${total.toFixed(2)}€`;
}

/**
 * Zeigt eine Fehlermeldung an
 * @param {string} message - Fehlermeldung
 */
export function showError(message) {
  alert(message);
}

/**
 * Setzt das Formular zurück
 */
export function resetForm() {
  const { costForm, person } = getElements();
  costForm.reset();
  person.focus();
}

/**
 * Fügt einen Event-Listener zum Formular hinzu
 * @param {Function} callback - Callback-Funktion
 */
export function onFormSubmit(callback) {
  const { costForm } = getElements();
  costForm.addEventListener("submit", (e) => {
    e.preventDefault();
    callback();
  });
}

/**
 * Fügt Event-Listener für die Lösch-Buttons hinzu (Event Delegation)
 * @param {Function} callback - Callback-Funktion mit Index
 */
export function onDeleteClick(callback) {
  const { costList } = getElements();
  costList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      if (!isNaN(index)) {
        callback(index);
      }
    }
  });
}
