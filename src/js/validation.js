/**
 * Validation Module
 * Handles input validation and sanitization for the Haushaltskosten-App
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate person name input
 * @param {string} person - Person name to validate
 * @returns {boolean} Is valid
 */
export function validatePerson(person) {
  if (!person) return false;
  const trimmed = person.trim();
  return trimmed.length > 0 && trimmed.length <= 50;
}

/**
 * Validate amount input
 * @param {string} amount - Amount to validate
 * @returns {boolean} Is valid
 */
export function validateAmount(amount) {
  if (!amount) return false;
  const trimmed = amount.trim();
  if (trimmed === '') return false;
  
  // Check if it's a valid number string (allowing decimals and negative for validation, but we check >= 0)
  const num = parseFloat(trimmed);
  
  // Additional check: the string should only contain digits, dots, and optional minus
  // But since we check num >= 0, negative numbers will be rejected
  const numberRegex = /^-?\d*\.?\d+$/;
  if (!numberRegex.test(trimmed)) {
    return false;
  }
  
  return !isNaN(num) && num >= 0;
}

/**
 * Validate reason input
 * @param {string} reason - Reason to validate
 * @returns {boolean} Is valid
 */
export function validateReason(reason) {
  if (!reason) return true;
  const trimmed = reason.trim();
  // Empty string after trim is valid (optional field)
  if (trimmed.length === 0) return true;
  return trimmed.length <= 100;
}

/**
 * Validate complete cost object
 * @param {Object} cost - Cost object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateCost(cost) {
  const errors = {};
  
  if (!validatePerson(cost.person)) {
    errors.person = 'Bitte geben Sie einen gültigen Namen ein (1-50 Zeichen).';
  }
  
  if (!validateAmount(cost.amount)) {
    errors.amount = 'Bitte geben Sie einen gültigen Betrag ein (positive Zahl).';
  }
  
  if (cost.reason && !validateReason(cost.reason)) {
    errors.reason = 'Der Grund darf maximal 100 Zeichen lang sein.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
