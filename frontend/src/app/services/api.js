const API_BASE = "http://localhost:5000/api";

export const authAPI = {
  register: async (data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Signup failed");
    return result;
  },

  login: async (data) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Login failed");
    return result;
  },

  checkEmailExists: async (email) => {
    const res = await fetch(`${API_BASE}/auth/check-email?email=${email}`);
    return res.json();
  },

  checkPhoneExists: async (phone) => {
    const res = await fetch(`${API_BASE}/auth/check-phone?phone=${phone}`);
    return res.json();
  },
};

export const userAPI = {
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE}/user/upload-profile`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Upload failed");
    return result;
  },
};


// // Auth logout helper (only localStorage operations)
// export const authAPI = {
//   logout: () => {
//     const userId = localStorage.getItem('userId');

//     // Clear user authentication data
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userProfilePicture');
//     localStorage.removeItem('userPhone');
//     localStorage.removeItem('userGender');
//     localStorage.removeItem('userUniversity');
//     localStorage.removeItem('userCountryCode');
//     localStorage.removeItem('carpoolRegion');
//     localStorage.removeItem('classSchedule');

//     // Clear user-scoped questionnaire data
//     if (userId) {
//       localStorage.removeItem(`user_${userId}_questionnaire`);
//       localStorage.removeItem(`user_${userId}_questionnaire_completed`);
//     }

//     // Clear legacy global questionnaire data
//     localStorage.removeItem('lifestyleQuestionnaire');
//     localStorage.removeItem('questionnaireCompleted');
//     const legacyQuestionnaireKeys = [
//       'q_sleepSchedule', 'q_wakeUpTime', 'q_sleepTime', 'q_cleanliness',
//       'q_organizationLevel', 'q_socialLevel', 'q_guestFrequency', 'q_sharedSpaces',
//       'q_smoking', 'q_drinking', 'q_pets', 'q_dietaryPreferences', 'q_studyTime',
//       'q_noiseLevel', 'q_musicWhileStudying', 'q_temperaturePreference',
//       'q_sharingItems', 'q_allergies', 'q_interests', 'q_personalQualities',
//       'q_importantQualities', 'q_dealBreakers'
//     ];
//     legacyQuestionnaireKeys.forEach(key => localStorage.removeItem(key));
//   },
// };

// // All other API modules return empty objects (not used)
// export const userAPI = {};
// export const questionnaireAPI = {};
// export const dormAPI = {};
// export const carpoolAPI = {};
// export const messageAPI = {};
// export const roommateAPI = {};
