/**
 * Utility functions for localStorage operations
 */

// User profile keys
export const STORAGE_KEYS = {
  // User Info
  USER_NAME: 'userName',
  USER_EMAIL: 'userEmail',
  USER_PHONE: 'userPhone',
  USER_GENDER: 'gender',
  USER_ROLE: 'userRole',
  USER_PROFILE_PIC: 'profilePicture',
  
  // Location & University
  COUNTRY: 'country',
  COUNTRY_CODE: 'countryCode',
  COUNTRY_ISO: 'countryISO',
  UNIVERSITY: 'university',
  CARPOOL_REGION: 'carpoolRegion',
  
  // Carpool & Schedule
  CLASS_SCHEDULE: 'classSchedule',
  JOINED_CARPOOLS: 'joinedCarpools',
  
  // Roommate Preferences (questionnaire)
  Q_SLEEP_SCHEDULE: 'q_sleepSchedule',
  Q_WAKE_UP_TIME: 'q_wakeUpTime',
  Q_SLEEP_TIME: 'q_sleepTime',
  Q_CLEANLINESS: 'q_cleanliness',
  Q_ORGANIZATION_LEVEL: 'q_organizationLevel',
  Q_SOCIAL_LEVEL: 'q_socialLevel',
  Q_GUEST_FREQUENCY: 'q_guestFrequency',
  Q_SHARED_SPACES: 'q_sharedSpaces',
  Q_SMOKING: 'q_smoking',
  Q_DRINKING: 'q_drinking',
  Q_NOISE_LEVEL: 'q_noiseLevel',
  Q_STUDY_HABITS: 'q_studyHabits',
  Q_PETS: 'q_pets',
  Q_TEMPERATURE: 'q_temperature',
  Q_BUDGET_RANGE: 'q_budgetRange',
};

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Retrieved value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Get JSON item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Parsed JSON or default
 */
export const getStorageJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing JSON from ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Set JSON item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to stringify and store
 */
export const setStorageJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting JSON ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get user profile from localStorage
 * @returns {Object} - User profile object
 */
export const getUserProfile = () => {
  return {
    name: getStorageItem(STORAGE_KEYS.USER_NAME, ''),
    email: getStorageItem(STORAGE_KEYS.USER_EMAIL, ''),
    phone: getStorageItem(STORAGE_KEYS.USER_PHONE, ''),
    gender: getStorageItem(STORAGE_KEYS.USER_GENDER, ''),
    role: getStorageItem(STORAGE_KEYS.USER_ROLE, ''),
    profilePicture: getStorageItem(STORAGE_KEYS.USER_PROFILE_PIC, ''),
    country: getStorageItem(STORAGE_KEYS.COUNTRY, ''),
    countryCode: getStorageItem(STORAGE_KEYS.COUNTRY_CODE, ''),
    countryISO: getStorageItem(STORAGE_KEYS.COUNTRY_ISO, ''),
    university: getStorageItem(STORAGE_KEYS.UNIVERSITY, ''),
    carpoolRegion: getStorageItem(STORAGE_KEYS.CARPOOL_REGION, ''),
    classSchedule: getStorageJSON(STORAGE_KEYS.CLASS_SCHEDULE, []),
  };
};

/**
 * Get user-scoped key for questionnaire data
 * Uses userId (UUID) to scope questionnaire data per user
 * @param {string} userId - User UUID
 * @returns {string} - User-scoped key
 */
const getUserQuestionnaireKey = (userId) => {
  return `user_${userId}_questionnaire`;
};

/**
 * Get user-scoped key for questionnaire completion flag
 * @param {string} userId - User UUID
 * @returns {string} - User-scoped key
 */
const getUserQuestionnaireCompletedKey = (userId) => {
  return `user_${userId}_questionnaire_completed`;
};

/**
 * Save lifestyle questionnaire for current user
 * Stores data scoped to the user's UUID
 * @param {Object} questionnaireData - Questionnaire responses
 * @returns {boolean} - Success status
 */
export const saveUserQuestionnaire = (questionnaireData) => {
  const userId = getStorageItem('userId');
  if (!userId) {
    console.error('Cannot save questionnaire: No userId found');
    return false;
  }
  
  try {
    // Save as a single JSON object scoped to user
    const key = getUserQuestionnaireKey(userId);
    setStorageJSON(key, questionnaireData);
    
    // Mark questionnaire as completed for this user
    const completedKey = getUserQuestionnaireCompletedKey(userId);
    setStorageItem(completedKey, 'true');
    
    return true;
  } catch (error) {
    console.error('Error saving user questionnaire:', error);
    return false;
  }
};

/**
 * Get lifestyle questionnaire for current user
 * Retrieves data scoped to the user's UUID
 * @returns {Object|null} - Questionnaire responses or null if not found
 */
export const getUserQuestionnaire = () => {
  const userId = getStorageItem('userId');
  if (!userId) {
    return null;
  }
  
  const key = getUserQuestionnaireKey(userId);
  return getStorageJSON(key, null);
};

/**
 * Check if current user has completed lifestyle questionnaire
 * @returns {boolean}
 */
export const hasCompletedQuestionnaire = () => {
  const userId = getStorageItem('userId');
  if (!userId) {
    return false;
  }
  
  const completedKey = getUserQuestionnaireCompletedKey(userId);
  return getStorageItem(completedKey) === 'true';
};

/**
 * Clear questionnaire data for current user
 * Called on logout to prevent data leakage between accounts
 * @returns {boolean} - Success status
 */
export const clearUserQuestionnaire = () => {
  const userId = getStorageItem('userId');
  if (!userId) {
    return false;
  }
  
  try {
    // Remove user-scoped questionnaire data
    const key = getUserQuestionnaireKey(userId);
    removeStorageItem(key);
    
    // Remove completion flag
    const completedKey = getUserQuestionnaireCompletedKey(userId);
    removeStorageItem(completedKey);
    
    return true;
  } catch (error) {
    console.error('Error clearing user questionnaire:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getStorageItem(STORAGE_KEYS.USER_EMAIL) !== null;
};