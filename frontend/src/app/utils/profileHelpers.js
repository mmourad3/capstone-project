/**
 * Profile picture handling utilities
 * Shared across Profile.jsx and SignUp.jsx
 */

/**
 * Handles profile picture upload and converts to base64
 * @param {File} file - Image file to upload
 * @param {Function} callback - Callback function to receive base64 result
 */
export const handleProfilePictureUpload = (file, callback) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
};

/**
 * Removes profile picture by setting it to empty/null
 * @param {Function} setData - State setter function
 * @param {Object} data - Current data object
 * @param {string} field - Field name for profile picture (default: 'profilePicture')
 */
export const removeProfilePictureHelper = (setData, data, field = 'profilePicture') => {
  setData({ ...data, [field]: '' });
};
