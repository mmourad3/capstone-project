/**
 * Validation helper utilities
 * Generic functions for checking field existence (email, phone, etc.)
 */

/**
 * Creates a generic existence checker function for any field
 * @param {Object} config - Configuration object
 * @param {Function} config.apiMethod - The API method to call (e.g., authAPI.checkEmailExists)
 * @param {Function} config.setError - Error setter function
 * @param {Function} config.setExistsFlag - Exists flag setter function
 * @param {Function} config.setIsChecking - Loading state setter function
 * @param {Function} config.isValid - Validation function to check if field is valid before checking existence
 * @param {string} config.errorMessage - Error message to show if field exists
 * @param {string} config.localStorageKey - localStorage key to check for offline mode
 * @returns {Function} Async function that checks if the value exists
 */
export const createExistenceChecker = (config) => {
  const {
    apiMethod,
    setError,
    setExistsFlag,
    setIsChecking,
    isValid,
    errorMessage,
    localStorageKey,
  } = config;

  return async (value) => {
    if (!isValid()) return;

    setIsChecking(true);
    try {
      const response = await apiMethod(value);
      if (response.exists) {
        setError(errorMessage);
        setExistsFlag(true);
        return true; // Field exists
      }
      setExistsFlag(false);
      return false; // Field doesn't exist
    } catch (error) {
      // If backend not available, check localStorage
      const existingValue = localStorage.getItem(localStorageKey);
      const isEmailVerified = localStorage.getItem('isEmailVerified') === 'true';
      
      // Normalize comparison (for email, compare lowercase; for phone, compare as-is)
      const normalizedValue = localStorageKey === 'userEmail' 
        ? value.toLowerCase() 
        : value;
      const normalizedExisting = localStorageKey === 'userEmail' && existingValue
        ? existingValue.toLowerCase()
        : existingValue;
      
      if (existingValue && normalizedExisting === normalizedValue) {
        // If field exists but email is NOT verified, allow re-registration silently
        if (!isEmailVerified) {
          setExistsFlag(false);
          return false; // Allow re-registration
        }
        
        // If field exists and account IS verified, block registration
        setError(errorMessage);
        setExistsFlag(true);
        return true; // Field exists and verified
      }
      setExistsFlag(false);
      return false; // Field doesn't exist
    } finally {
      setIsChecking(false);
    }
  };
};
