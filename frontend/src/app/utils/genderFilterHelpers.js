/**
 * ============================================================================
 * GENDER FILTERING HELPERS
 * ============================================================================
 * Reusable functions for filtering demo users based on gender preferences
 * Used for both dorm requests and carpool passengers
 */

import { DEMO_USERS } from '../data/demoData';

/**
 * Filter demo users for dorm requests based on gender preference
 * @param {string} genderPreference - "any"/"Any" or "same"/"Same" 
 * @param {string} providerGender - Provider's gender ("Male" or "Female")
 * @returns {Array} Filtered array of dorm_seeker users
 */
export const filterDormSeekersByGender = (genderPreference, providerGender) => {
  // Get all dorm seekers
  const dormSeekers = DEMO_USERS.filter(user => user.role === 'dorm_seeker');
  
  // Normalize preference to lowercase
  const normalizedPref = (genderPreference || 'any').toLowerCase();
  
  // If "any"/"No Preference" → show all seekers
  if (normalizedPref === 'any') {
    return dormSeekers;
  }
  
  // If "same"/"Same Gender" → show only seekers matching provider's gender (case-insensitive)
  if (normalizedPref === 'same' && providerGender) {
    const providerGenderLower = providerGender.toLowerCase();
    return dormSeekers.filter(user => user.gender.toLowerCase() === providerGenderLower);
  }
  
  // Default: return all
  return dormSeekers;
};

/**
 * Filter demo users for carpool passengers based on gender preference
 * @param {string} genderPreference - "both" or "same"
 * @param {string} driverGender - Driver's gender ("Male" or "Female")
 * @param {Array} excludeUserIds - Optional array of user IDs to exclude (e.g., already joined passengers)
 * @returns {Array} Filtered array of carpool users
 */
export const filterCarpoolUsersByGender = (genderPreference, driverGender, excludeUserIds = []) => {
  // Get all carpool users (user IDs 014-033)
  const carpoolUsers = DEMO_USERS.filter(user => {
    const userNum = parseInt(user.userId.split('-')[2]);
    return userNum >= 14 && userNum <= 33;
  });
  
  // Exclude specific users (e.g., driver, already joined passengers)
  let filtered = carpoolUsers.filter(user => !excludeUserIds.includes(user.userId));
  
  // Normalize preference
  const normalizedPref = (genderPreference || 'both').toLowerCase();
  
  // If "both"/"Accept Both Genders" → show all
  if (normalizedPref === 'both') {
    return filtered;
  }
  
  // If "same"/"Same Gender Only" → show only users matching driver's gender (case-insensitive)
  if (normalizedPref === 'same' && driverGender) {
    const driverGenderLower = driverGender.toLowerCase();
    return filtered.filter(user => user.gender.toLowerCase() === driverGenderLower);
  }
  
  // Default: return all
  return filtered;
};

/**
 * Get display text for gender preference on listing cards
 * @param {string} genderPreference - "any"/"Any" or "same"/"Same"
 * @param {string} ownerGender - Owner's gender ("Male" or "Female")
 * @returns {string} Display text ("Any", "Male", or "Female")
 */
export const getGenderDisplayText = (genderPreference, ownerGender) => {
  const normalizedPref = (genderPreference || 'any').toLowerCase();
  
  // If "same" → show owner's actual gender
  if (normalizedPref === 'same' && ownerGender) {
    return ownerGender;
  }
  
  // If "any" → show "Any"
  return 'Any';
};

/**
 * Check if a user matches gender preference criteria
 * @param {Object} user - User object with gender field
 * @param {string} genderPreference - Preference ("any"/"same" for dorms, "both"/"same" for carpools)
 * @param {string} referenceGender - Reference gender to match against (provider/driver gender)
 * @returns {boolean} True if user matches the criteria
 */
export const matchesGenderPreference = (user, genderPreference, referenceGender) => {
  const normalizedPref = (genderPreference || '').toLowerCase();
  
  // "any" or "both" → all users match
  if (normalizedPref === 'any' || normalizedPref === 'both') {
    return true;
  }
  
  // "same" → user must match reference gender (case-insensitive comparison)
  if (normalizedPref === 'same') {
    const userGender = (user.gender || '').toLowerCase();
    const refGender = (referenceGender || '').toLowerCase();
    return userGender === refGender;
  }
  
  // Default: match
  return true;
};
