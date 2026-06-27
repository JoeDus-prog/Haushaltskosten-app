/**
 * Storage-Modul für die Haushaltskosten-App
 * Verantwortlich für das Laden und Speichern von Daten
 * 
 * @module storage
 */

/**
 * Lädt Kosten aus localStorage
 * @returns {Array<Object>} Array von Kosteneinträgen
 */
export function loadCosts() {
  try {
    const savedCosts = localStorage.getItem('haushaltskosten');
    return savedCosts ? JSON.parse(savedCosts) : [];
  } catch (error) {
    console.error('Fehler beim Laden der Kosten:', error);
    return [];
  }
}

/**
 * Speichert Kosten in localStorage
 * @param {Array<Object>} costs - Array von Kosteneinträgen
 */
export function saveCosts(costs) {
  try {
    // Validierung: Nur gültige Einträge speichern
    const validCosts = costs.filter(cost => 
      cost && cost.person && cost.amount !== undefined
    );
    localStorage.setItem('haushaltskosten', JSON.stringify(validCosts));
  } catch (error) {
    console.error('Fehler beim Speichern der Kosten:', error);
    // Fallback: Leeres Array speichern
    localStorage.setItem('haushaltskosten', JSON.stringify([]));
  }
}
