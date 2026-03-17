/**
 * GENDER HELPER FUNCTIONS
 * Utilities for normalizing and handling gender data consistently
 */

/**
 * Normalize gender to lowercase for consistent storage
 * @param {string} gender - Gender value (Male, Female, male, female, etc.)
 * @returns {string} Normalized lowercase gender ('male' or 'female')
 */
export const normalizeGender = (gender) => {
  if (!gender) return '';
  return gender.toLowerCase().trim();
};

/**
 * Display gender with proper capitalization
 * @param {string} gender - Gender value ('male', 'female')
 * @returns {string} Capitalized gender ('Male', 'Female')
 */
export const displayGender = (gender) => {
  if (!gender) return '';
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
};
