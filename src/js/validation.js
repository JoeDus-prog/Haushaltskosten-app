/**
 * Validation Module
 * Verantwortlich für die Validierung von Benutzereingaben
 */

/**
 * Sanitized User Input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#96;")
    .replace(/=/g, "&#61;");
}

/**
 * Validiert den Betrag
 * @param {string} amount - Zu validierender Betrag
 * @returns {boolean} true wenn gültig
 */
export function validateAmount(amount) {
  if (!amount || amount.trim() === "") return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
}

/**
 * Validiert den Personennamen
 * @param {string} person - Zu validierender Name
 * @returns {boolean} true wenn gültig
 */
export function validatePerson(person) {
  return person && person.trim().length > 0 && person.trim().length <= 50;
}

/**
 * Validiert den Grund
 * @param {string} reason - Zu validierender Grund
 * @returns {boolean} true wenn gültig
 */
export function validateReason(reason) {
  return !reason || (reason.trim().length > 0 && reason.trim().length <= 100);
}

/**
 * Validiert alle Formulardaten
 * @param {string} person - Personename
 * @param {string} amount - Betrag
 * @param {string} reason - Grund
 * @returns {Object} Objekt mit isValid und errors
 */
export function validateFormData(person, amount, reason) {
  const errors = {};

  if (!validatePerson(person)) {
    errors.person = "Bitte geben Sie einen gültigen Namen ein (1-50 Zeichen).";
  }

  if (!validateAmount(amount)) {
    errors.amount = "Bitte geben Sie einen gültigen Betrag ein (positive Zahl).";
  }

  if (!validateReason(reason)) {
    errors.reason = "Der Grund darf maximal 100 Zeichen lang sein.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Formatiert einen Betrag als Zahl mit 2 Dezimalstellen
 * @param {string} amount - Betrag als String
 * @returns {string} Formatierter Betrag
 */
export function formatAmount(amount) {
  return parseFloat(amount).toFixed(2);
}
