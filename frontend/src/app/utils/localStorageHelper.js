/**
 * Safe localStorage operations with quota error handling
 * 
 * USAGE:
 * - BEFORE BACKEND: Use for all data storage
 * - AFTER BACKEND: Use ONLY for session/auth tokens and UI preferences
 *   (Most data should be stored in database via API calls)
 */

// Keys that should never be deleted during cleanup
// UPDATED FOR BACKEND: Only auth/session keys are essential
const ESSENTIAL_KEYS = [
  'authToken',        // JWT authentication token
  'refreshToken',     // JWT refresh token
  'userId',           // Current user ID
  'userEmail',        // Current user email (for quick access)
  'userName',         // Current user name (for quick access)
  'userRole',         // Current user role (for quick access)
  'userProfilePicture', // Profile picture URL (for quick access)
  'theme',            // UI theme preference
  'language',         // Language preference
];

// List of keys that are allowed to exceed the default size limit (500KB)
// These are critical data stores that users expect to persist
const allowedLargeKeys = [
  'postedDorms',
  'activeRoommates',
  'roommateRequests',
  'registeredUsers',
  'pendingFeedback',
  'userPhone',
  'userGender',
];

/**
 * Safely set an item in localStorage with automatic cleanup on quota exceeded
 * @param {string} key - The localStorage key
 * @param {string} value - The value to store (should be stringified JSON if object)
 * @param {Function} onError - Optional callback when error occurs
 * @returns {boolean} - True if successful, false otherwise
 */
export function safeSetItem(key, value, onError) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Attempting cleanup...');
      
      // Perform cleanup
      cleanupNonEssentialData();
      
      // Retry after cleanup
      try {
        localStorage.setItem(key, value);
        console.log('✅ Successfully saved after cleanup');
        return true;
      } catch (retryError) {
        console.error('❌ Still cannot save after cleanup:', retryError);
        if (onError) {
          onError('Unable to save. Please delete some old data.');
        }
        return false;
      }
    } else {
      console.error('Error saving to localStorage:', error);
      if (onError) {
        onError('Failed to save data');
      }
      return false;
    }
  }
}

/**
 * Clean up non-essential localStorage data
 */
function cleanupNonEssentialData() {
  const allKeys = Object.keys(localStorage);
  let removedCount = 0;
  
  allKeys.forEach(key => {
    // Keep essential keys and user-specific questionnaire data
    if (!ESSENTIAL_KEYS.includes(key) && !key.startsWith('user_')) {
      localStorage.removeItem(key);
      removedCount++;
    }
  });
  
  console.log(`🧹 Cleaned up ${removedCount} non-essential localStorage items`);
}

/**
 * Get the current localStorage usage in bytes (approximate)
 * @returns {number} - Approximate size in bytes
 */
export function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

/**
 * Get localStorage usage as a formatted string
 * @returns {string} - Formatted size (e.g., "2.5 MB")
 */
export function getLocalStorageSizeFormatted() {
  const bytes = getLocalStorageSize();
  const kb = bytes / 1024;
  const mb = kb / 1024;
  
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  } else if (kb >= 1) {
    return `${kb.toFixed(2)} KB`;
  } else {
    return `${bytes} bytes`;
  }
}

/**
 * Check if localStorage is approaching quota limit
 * @returns {boolean} - True if usage is over 80%
 */
export function isStorageNearLimit() {
  const maxSize = 5 * 1024 * 1024; // 5MB typical limit
  const currentSize = getLocalStorageSize();
  return currentSize / maxSize > 0.8;
}