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
