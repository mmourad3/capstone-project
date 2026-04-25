/**
 * Validation helper utilities
 * Generic functions for checking field existence from the backend
 */

export const createExistenceChecker = ({
  apiMethod,
  setError,
  setExistsFlag,
  setIsChecking,
  isValid,
  errorMessage,
}) => {
  return async (value) => {
    if (!value || !isValid()) return false;

    setIsChecking(true);

    try {
      const response = await apiMethod(value);

      if (response.exists) {
        setError(errorMessage);
        setExistsFlag(true);
        return true;
      }

      setError("");
      setExistsFlag(false);
      return false;
    } catch (error) {
      console.error("Existence check failed:", error);
      setError("Could not check availability. Please try again.");
      setExistsFlag(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };
};
