/**
 * Validates password against security requirements
 * @param {string} password - Password to validate
 * @returns {Object} Object with validation results for each requirement
 */
export const validatePassword = (password) => {
  // Handle undefined, null, or empty password - always return an object
  if (!password || typeof password !== "string") {
    return {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    };
  }

  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
  };
};

/**
 * Calculates password strength based on requirements met
 * @param {string} password - Password to evaluate
 * @returns {Object} Object with label, color, and percentage for password strength
 */
export const getPasswordStrength = (password) => {
  // Always return a valid object
  if (!password || typeof password !== "string") {
    return { label: "", color: "", percentage: 0 };
  }

  const requirements = validatePassword(password);

  // Extra safety check
  if (!requirements || typeof requirements !== "object") {
    return { label: "", color: "", percentage: 0 };
  }

  const score = Object.values(requirements).filter(Boolean).length;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", percentage: 33 };
  if (score === 3)
    return { label: "Fair", color: "bg-yellow-500", percentage: 50 };
  if (score === 4)
    return { label: "Good", color: "bg-blue-500", percentage: 75 };
  return { label: "Strong", color: "bg-green-500", percentage: 100 };
};

/**
 * Gets the first password validation error message
 * Used to display consistent error messages across the app
 * @param {Object} validation - Validation object from validatePassword()
 * @returns {string} Error message for the first failed requirement, or empty string if all pass
 */
export const getPasswordErrorMessage = (validation) => {
  if (!validation.minLength) {
    return "Password must be at least 8 characters long";
  }
  if (!validation.hasUpperCase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!validation.hasLowerCase) {
    return "Password must contain at least one lowercase letter";
  }
  if (!validation.hasNumber) {
    return "Password must contain at least one number";
  }
  if (!validation.hasSpecialChar) {
    return "Password must contain at least one special character";
  }
  return ""; // All requirements met
};

/**
 * Validates password change with detailed error messages
 * Used in Profile.jsx password change functionality
 * @param {string} currentPassword - Current password entered by user
 * @param {string} newPassword - New password to set
 * @param {string} confirmPassword - Confirmation of new password
 * @returns {Object} Object with isValid boolean and error message if invalid
 */
export const validatePasswordChange = (
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { isValid: false, error: "All password fields are required!" };
  }

  if (newPassword !== confirmPassword) {
    return { isValid: false, error: "New passwords do not match!" };
  }

  const passwordRequirements = validatePassword(newPassword);

  if (!passwordRequirements.minLength) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long!",
    };
  }

  if (!passwordRequirements.hasUpperCase) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter!",
    };
  }

  if (!passwordRequirements.hasLowerCase) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter!",
    };
  }

  if (!passwordRequirements.hasNumber) {
    return {
      isValid: false,
      error: "Password must contain at least one number!",
    };
  }

  if (!passwordRequirements.hasSpecialChar) {
    return {
      isValid: false,
      error: "Password must contain at least one special character!",
    };
  }

  return { isValid: true, error: null };
};