/**
 * Phone number validation utilities
 * Shared across Profile.jsx and SignUp.jsx
 */

import { getAvailableCountries } from '../config/appConfig';

/**
 * Validates phone number based on country requirements
 * @param {string} phone - Phone number to validate
 * @param {string} country - Country name
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validatePhoneByCountry = (phone, country) => {
  const selectedCountry = getAvailableCountries().find(c => c.name === country);
  
  if (!selectedCountry) {
    return {
      isValid: false,
      error: 'Invalid country selected'
    };
  }
  
  // Remove non-digit characters
  const phoneDigits = phone.replace(/\D/g, '');
  
  // Check if phone number meets min/max digit requirements
  if (phoneDigits.length < selectedCountry.minDigits || phoneDigits.length > selectedCountry.maxDigits) {
    return {
      isValid: false,
      error: `Phone number must be ${selectedCountry.minDigits} digits for ${selectedCountry.name}`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Gets clean phone digits without formatting
 * @param {string} phone - Phone number with possible formatting
 * @returns {string} Clean digits only
 */
export const getPhoneDigits = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Checks if phone number length is valid for country
 * @param {string} phone - Phone number
 * @param {string} country - Country name
 * @returns {boolean} True if valid length
 */
export const isPhoneLengthValid = (phone, country) => {
  const selectedCountry = getAvailableCountries().find(c => c.name === country);
  if (!selectedCountry) return false;
  
  const digitsOnly = getPhoneDigits(phone);
  const { minDigits, maxDigits } = selectedCountry;
  
  return digitsOnly.length >= minDigits && digitsOnly.length <= maxDigits;
};
