const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
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
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to get user");
    }

    return result;
  },
  updateMe: async (data) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update profile");
    return result;
  },

  deleteMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete account");
    return result;
  },
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePicture");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userGender");
    localStorage.removeItem("userUniversity");
    localStorage.removeItem("userCountryCode");
    localStorage.removeItem("carpoolRegion");
    localStorage.removeItem("classSchedule");
  },

  checkEmailExists: async (email) => {
    const res = await fetch(
      `${API_BASE}/auth/check-email?email=${encodeURIComponent(email)}`,
    );
    return res.json();
  },

  checkPhoneExists: async (phone) => {
    const res = await fetch(
      `${API_BASE}/auth/check-phone?phone=${encodeURIComponent(phone)}`,
    );
    return res.json();
  },
  changePassword: async (data) => {
    const res = await fetch(`${API_BASE}/auth/me/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to change password");
    }

    return result;
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

// All other API modules return empty objects (not used)

export const questionnaireAPI = {
  save: async (data) => {
    const res = await fetch(`${API_BASE}/questionnaire`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to save questionnaire");
    }

    return result;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/questionnaire/me`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch questionnaire");
    }

    return result;
  },
};

export const dormAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/dorms`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch dorm listings");
    }

    return result;
  },

  getMyListings: async () => {
    const res = await fetch(`${API_BASE}/dorms/my-listings`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch your dorm listings");
    }

    return result;
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE}/dorms`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create dorm listing");
    }

    return result;
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/dorms/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update dorm listing");
    }

    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/dorms/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete dorm listing");
    }

    return result;
  },
};
export const geminiChatAPI = {
  sendMessage: async ({ message, systemFileText }) => {
    const res = await fetch(`${API_BASE}/gemini-chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, systemFileText }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Gemini chatbot failed");
    }

    return result;
  },
};

export const favoriteDormAPI = {
  getIds: async () => {
    const res = await fetch(`${API_BASE}/favorite-dorms/ids`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch favorites");
    return result;
  },

  getAll: async () => {
    const res = await fetch(`${API_BASE}/favorite-dorms`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch favorites");
    return result;
  },

  add: async (dormId) => {
    const res = await fetch(`${API_BASE}/favorite-dorms`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ dormId }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to add favorite");
    return result;
  },

  remove: async (dormId) => {
    const res = await fetch(`${API_BASE}/favorite-dorms/${dormId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to remove favorite");
    return result;
  },
};



export const carpoolAPI = {};
export const messageAPI = {};
export const roommateAPI = {};
