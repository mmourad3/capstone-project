/**
 * ============================================================================
 * API SERVICE - ALL BACKEND CALLS DISABLED (USING LOCALSTORAGE ONLY)
 * ============================================================================
 * This entire file is commented out. The application works with localStorage only.
 * All backend integration code is preserved for future use.
 * Last updated: Backend fully disabled, all exports added
 */

/* BACKEND CODE COMMENTED OUT - USING LOCALSTORAGE ONLY

// All backend API code has been commented out
// The application now works entirely with:
// - localStorage for data persistence
// - Demo data from /src/app/utils/demoData.js
// - Local state management

// To re-enable backend:
// 1. Uncomment this entire file
// 2. Configure API_BASE_URL in appConfig.js
// 3. Remove localStorage fallback code from components
// 4. Set up backend server with proper routes

END OF BACKEND CODE */

/**
 * ============================================================================
 * LOCALSTORAGE-ONLY MODE
 * ============================================================================
 * All API functions are disabled. Components use localStorage directly.
 */

// Auth logout helper (only localStorage operations)
export const authAPI = {
  logout: () => {
    const userId = localStorage.getItem('userId');
    
    // Clear user authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfilePicture');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userGender');
    localStorage.removeItem('userUniversity');
    localStorage.removeItem('userCountryCode');
    localStorage.removeItem('carpoolRegion');
    localStorage.removeItem('classSchedule');
    
    // Clear user-scoped questionnaire data
    if (userId) {
      localStorage.removeItem(`user_${userId}_questionnaire`);
      localStorage.removeItem(`user_${userId}_questionnaire_completed`);
    }
    
    // Clear legacy global questionnaire data
    localStorage.removeItem('lifestyleQuestionnaire');
    localStorage.removeItem('questionnaireCompleted');
    const legacyQuestionnaireKeys = [
      'q_sleepSchedule', 'q_wakeUpTime', 'q_sleepTime', 'q_cleanliness', 
      'q_organizationLevel', 'q_socialLevel', 'q_guestFrequency', 'q_sharedSpaces',
      'q_smoking', 'q_drinking', 'q_pets', 'q_dietaryPreferences', 'q_studyTime',
      'q_noiseLevel', 'q_musicWhileStudying', 'q_temperaturePreference', 
      'q_sharingItems', 'q_allergies', 'q_interests', 'q_personalQualities',
      'q_importantQualities', 'q_dealBreakers'
    ];
    legacyQuestionnaireKeys.forEach(key => localStorage.removeItem(key));
  },
};

// All other API modules return empty objects (not used)
export const userAPI = {};
export const questionnaireAPI = {};
export const dormAPI = {};
export const carpoolAPI = {};
export const messageAPI = {};
export const roommateAPI = {};
