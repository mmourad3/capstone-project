/**
 * Form state restoration helper
 * Centralizes logic for restoring form data from location.state or localStorage
 */

/**
 * Restores form data by calling all the necessary setters
 * @param {Object} data - The form data object to restore
 * @param {Object} setters - Object containing all setter functions
 */
export const restoreFormState = (data, setters) => {
  setters.setFirstName(data.firstName || "");
  setters.setLastName(data.lastName || "");
  setters.setEmail(data.email || "");
  setters.setPassword(data.password || "");
  setters.setPhone(data.phone || "");
  setters.setGender(data.gender || "");
  setters.setRole(data.role || "");
  setters.setCountry(data.country || "");
  setters.setCountryCode(data.countryCode || "");
  setters.setCountryISO(data.countryISO || "");
  setters.setUniversity(data.university || "");
  setters.setProfilePicturePreview(data.profilePicturePreview || "");
  setters.setCarpoolRegion(data.carpoolRegion || "");
  setters.setClassSchedule(data.classSchedule || []);
};
