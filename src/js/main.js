/**
 * Main Module
 * Hauptanwendung - Koordiniert alle Module
 */

import { loadCosts, calculateTotal, addCost, deleteCost, initializeDefaultCosts } from "./storage.js";
import { validateFormData, formatAmount, sanitizeInput } from "./validation.js";
import { initElements, renderCosts, updateTotalAmount, showError, resetForm, onFormSubmit, onDeleteClick, getElements } from "./dom.js";

/**
 * Rendert alle Kosten und aktualisiert den Gesamtbetrag
 */
function renderAll() {
  const costs = loadCosts();
  renderCosts(costs);
  const total = calculateTotal(costs);
  updateTotalAmount(total);
}

/**
 * Behandelt das Absenden des Formulars
 */
function handleFormSubmit() {
  const { person, amount, reason } = getElements();

  const rawPerson = person.value.trim();
  const rawAmount = amount.value.trim();
  const rawReason = reason.value.trim();

  // Validierung
  const { isValid, errors } = validateFormData(rawPerson, rawAmount, rawReason);

  if (!isValid) {
    // Erste Fehlermeldung anzeigen
    const firstError = Object.values(errors)[0];
    showError(firstError);

    // Fokus auf das erste fehlerhafte Feld setzen
    if (errors.person) person.focus();
    else if (errors.amount) amount.focus();
    else if (errors.reason) reason.focus();
    return;
  }

  // Betrag formatieren
  const formattedAmount = formatAmount(rawAmount);

  // Kosten hinzufügen
  addCost(
    sanitizeInput(rawPerson),
    formattedAmount,
    sanitizeInput(rawReason)
  );

  // Alles neu rendern
  renderAll();

  // Formular zurücksetzen
  resetForm();
}

/**
 * Behandelt das Löschen eines Kosteneintrags
 * @param {number} index - Index des zu löschenden Eintrags
 */
function handleDeleteClick(index) {
  deleteCost(index);
  renderAll();
}

/**
 * Initialisiert die Anwendung
 */
function init() {
  // DOM-Elemente initialisieren
  initElements();

  // Standard-Daten initialisieren
  initializeDefaultCosts();

  // Alles rendern
  renderAll();

  // Event-Listener registrieren
  onFormSubmit(handleFormSubmit);
  onDeleteClick(handleDeleteClick);
}

// beim Laden der Seite ausführen
document.addEventListener("DOMContentLoaded", init);
