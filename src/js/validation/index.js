/**
 * Validation functions for cost entries
 */

/**
 * Validate amount input
 * @param {string} amount - Amount to validate
 * @returns {boolean} Is valid
 */
export function validateAmount(amount) {
  if (!amount || amount.trim() === '') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate person input
 * @param {string} person - Person name to validate
 * @returns {boolean} Is valid
 */
export function validatePerson(person) {
  return person && person.trim().length > 0 && person.trim().length <= 50;
}

/**
 * Validate reason input
 * @param {string} reason - Reason to validate
 * @returns {boolean} Is valid
 */
export function validateReason(reason) {
  return !reason || (reason.trim().length > 0 && reason.trim().length <= 100);
}

/**
 * Validate a complete cost entry
 * @param {Object} cost - Cost entry to validate
 * @param {string} cost.person - Person name
 * @param {string|number} cost.amount - Amount
 * @param {string} [cost.reason] - Optional reason
 * @returns {boolean} Is valid
 */
export function validateCost(cost) {
  return (
    validatePerson(cost.person) &&
    validateAmount(String(cost.amount)) &&
    validateReason(cost.reason)
  );
}
