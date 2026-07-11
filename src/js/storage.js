/**
 * Storage Module
 * Verantwortlich für das Laden und Speichern von Daten im localStorage
 */

const STORAGE_KEY = "haushaltskosten";

/**
 * Lädt alle Kosteneinträge aus dem localStorage
 * @returns {Array<Object>} Array mit Kosteneinträgen
 */
export function loadCosts() {
  const savedCosts = localStorage.getItem(STORAGE_KEY);
  return savedCosts ? JSON.parse(savedCosts) : [];
}

/**
 * Speichert Kosteneinträge im localStorage
 * @param {Array<Object>} costs - Array mit Kosteneinträgen
 */
export function saveCosts(costs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

/**
 * Berechnet den Gesamtbetrag aller Kosten
 * @param {Array<Object>} costs - Array mit Kosteneinträgen
 * @returns {number} Gesamtbetrag
 */
export function calculateTotal(costs) {
  return costs.reduce((total, cost) => total + parseFloat(cost.amount) || 0, 0);
}

/**
 * Fügt einen neuen Kosteneintrag hinzu
 * @param {string} person - Name der Person
 * @param {string} amount - Betrag
 * @param {string} reason - Grund (optional)
 */
export function addCost(person, amount, reason) {
  const costs = loadCosts();
  costs.push({ person, amount, reason });
  saveCosts(costs);
}

/**
 * Löscht einen Kosteneintrag
 * @param {number} index - Index des zu löschenden Eintrags
 */
export function deleteCost(index) {
  const costs = loadCosts();
  if (index >= 0 && index < costs.length) {
    costs.splice(index, 1);
    saveCosts(costs);
  }
}

/**
 * Initialisiert Standard-Daten, falls keine vorhanden
 */
export function initializeDefaultCosts() {
  const costs = loadCosts();
  if (costs.length === 0) {
    saveCosts([
      { person: "Max", amount: "50.00", reason: "Einkaufen" },
      { person: "Anna", amount: "30.00", reason: "Strom" }
    ]);
  }
}
