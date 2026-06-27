/**
 * Utility-Funktionen für die Haushaltskosten-App
 * 
 * @module utils
 */

/**
 * Berechnet den Gesamtbetrag aller Kosten
 * @param {Array<Object>} costs - Array von Kosteneinträgen
 * @returns {number} Gesamtbetrag
 */
export function calculateTotal(costs) {
  return costs.reduce((total, cost) => {
    const amount = parseFloat(cost.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
}

/**
 * Formatiert einen Betrag als Währung
 * @param {number|string} amount - Betrag
 * @returns {string} Formatierter Betrag mit 2 Dezimalstellen
 */
export function formatCurrency(amount) {
  const num = parseFloat(amount);
  return isNaN(num) ? '0.00' : num.toFixed(2);
}

/**
 * Escaped HTML-Sonderzeichen zur XSS-Prävention
 * @param {string} text - Text zum Escapen
 * @returns {string} Escapeter Text
 */
export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Erstellt ein HTML-Element für einen Kosteneintrag
 * @param {Object} cost - Kosteneintrag
 * @param {number} index - Index des Eintrags
 * @returns {HTMLElement} li-Element
 */
export function createCostElement(cost, index) {
  const li = document.createElement('li');
  li.className = 'cost-item';
  li.setAttribute('data-index', index);
  
  li.innerHTML = `
    <div class="cost-info">
      <span class="cost-person">${escapeHtml(cost.person)}</span>:
      <span class="cost-amount">${formatCurrency(cost.amount)}€</span>
      ${cost.reason ? `<span class="cost-reason">(${escapeHtml(cost.reason)})</span>` : ''}
    </div>
    <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">
      Löschen
    </button>
  `;
  return li;
}
