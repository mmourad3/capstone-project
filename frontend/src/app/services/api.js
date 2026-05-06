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
  updateSchedule: async (classSchedule) => {
    const res = await fetch(`${API_BASE}/auth/me/schedule`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ classSchedule }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update schedule");
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

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/auth/users/${id}`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch user profile");
    }

    return result;
  },
};

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


export const roommateAPI = {
  getIncomingRequests: async () => {
    const res = await fetch(`${API_BASE}/roommates/requests/incoming`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to fetch roommate requests");
    return result;
  },

  getSentRequests: async () => {
    const res = await fetch(`${API_BASE}/roommates/requests/sent`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to fetch sent requests");
    return result;
  },

  getActiveRoommates: async () => {
    const res = await fetch(`${API_BASE}/roommates/active`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to fetch active roommates");
    return result;
  },

  getStatus: async () => {
    const res = await fetch(`${API_BASE}/roommates/status`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to fetch roommate status");
    return result;
  },

  sendRequest: async ({ recipientId, dormId }) => {
    const res = await fetch(`${API_BASE}/roommates/requests`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ recipientId, dormId }),
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to send roommate request");
    return result;
  },

  acceptRequest: async (requestId) => {
    const res = await fetch(
      `${API_BASE}/roommates/requests/${requestId}/accept`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      },
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to accept request");
    return result;
  },

  rejectRequest: async (requestId) => {
    const res = await fetch(
      `${API_BASE}/roommates/requests/${requestId}/reject`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      },
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to reject request");
    return result;
  },

  cancelRequest: async (requestId) => {
    const res = await fetch(`${API_BASE}/roommates/requests/${requestId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to cancel request");
    return result;
  },

  endRelationship: async (relationshipId) => {
    const res = await fetch(
      `${API_BASE}/roommates/relationships/${relationshipId}/end`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      },
    );

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to end roommate relationship");
    return result;
  },

  // submitFeedback: async (relationshipId, data) => {
  //   const res = await fetch(
  //     `${API_BASE}/roommates/relationships/${relationshipId}/feedback`,
  //     {
  //       method: "POST",
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify(data),
  //     },
  //   );

  //   const result = await res.json();
  //   if (!res.ok) throw new Error(result.message || "Failed to submit feedback");
  //   return result;
  // },

//   getPendingFeedback: async () => {
//     const res = await fetch(`${API_BASE}/roommates/feedback/pending`, {
//       headers: getAuthHeaders(),
//     });

//     const result = await res.json();
//     if (!res.ok)
//       throw new Error(result.message || "Failed to fetch pending feedback");
//     return result;
//   },
};


export const carpoolAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/carpools`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch carpools");
    }

    return result;
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/carpools/${id}`);
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch carpool");
    }

    return result;
  },

  getMyListings: async () => {
    const res = await fetch(`${API_BASE}/carpools/my-listings`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch your carpools");
    }

    return result;
  },

  getJoined: async () => {
    const res = await fetch(`${API_BASE}/carpools/joined`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch joined carpools");
    }

    return result;
  },

  getJoinedIds: async () => {
    const res = await fetch(`${API_BASE}/carpools/joined/ids`, {
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch joined carpool ids");
    }

    return result;
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE}/carpools`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create carpool");
    }

    return result;
  },

  update: async (id, data) => {
    const res = await fetch(`${API_BASE}/carpools/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update carpool");
    }

    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/carpools/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete carpool");
    }

    return result;
  },

  join: async (id) => {
    const res = await fetch(`${API_BASE}/carpools/${id}/join`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to join carpool");
    }

    return result;
  },

  leave: async (id) => {
    const res = await fetch(`${API_BASE}/carpools/${id}/leave`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to leave carpool");
    }

    return result;
  },

  removePassenger: async (carpoolId, passengerId) => {
    const res = await fetch(
      `${API_BASE}/carpools/${carpoolId}/passengers/${passengerId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to remove passenger");
    }

    return result;
  },
};

export const messageAPI = {};

