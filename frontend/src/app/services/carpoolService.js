/**
 * ============================================================================
 * CARPOOL SERVICE - WORKS WITH BOTH LOCALSTORAGE AND BACKEND
 * ============================================================================
 * This service provides a single interface for carpool operations.
 * Automatically switches between localStorage (development) and API (production).
 * 
 * WHEN SWITCHING TO BACKEND:
 * 1. Set USE_BACKEND = true
 * 2. Update API_BASE_URL to your backend URL
 * 3. ALL CarpoolDashboard code stays the same!
 * 
 * Last updated: 2026-03-13
 */

import { generateDemoCarpools } from '../data/demoData';
import { addPassengerToCarpool, leaveCarpoolInStorage } from '../utils/carpoolHelpers';

// ============================================================================
// CONFIGURATION
// ============================================================================

const USE_BACKEND = false; // 🔄 SET TO TRUE when backend is ready
const API_BASE_URL = 'http://localhost:3001/api'; // 🔄 UPDATE to your backend URL

// ============================================================================
// API HELPER (for backend calls)
// ============================================================================

async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Add auth token if needed:
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// ============================================================================
// CARPOOL SERVICE - WORKS WITH BOTH LOCALSTORAGE AND BACKEND
// ============================================================================

export const carpoolService = {
  /**
   * Get user information by userId
   * @param {string} userId - User ID (UUID-compatible)
   * @returns {Promise<Object>} User object with all info
   */
  async getUserInfo(userId) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: GET user info from API
      return await apiCall(`/users/${userId}`);
    } else {
      // 💾 LOCALSTORAGE: Get current logged-in user's info
      // In a real app, you'd have a users table/storage
      // For now, we get from localStorage if it's the current user
      const currentUserId = localStorage.getItem('userId');
      
      if (userId === currentUserId) {
        return {
          id: userId,
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
          phone: localStorage.getItem('userPhone'),
          countryCode: localStorage.getItem('countryCode') || '+961',
          gender: localStorage.getItem('gender'),
          profilePicture: localStorage.getItem('profilePicture')
        };
      }
      
      // If requesting a different user's info, we can't get it from localStorage
      // This is a limitation of localStorage - backend will solve this
      throw new Error('User info only available for current user in localStorage mode');
    }
  },

  /**
   * Get all carpools
   * @returns {Promise<Array>} Array of carpool objects
   */
  async getAllCarpools() {
    if (USE_BACKEND) {
      // 🌐 BACKEND: Call API
      return await apiCall('/carpools');
    } else {
      // 💾 LOCALSTORAGE: Read from localStorage
      let carpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
      
      // Generate demo carpools if none exist
      if (carpools.length === 0) {
        const userRegion = localStorage.getItem('carpoolRegion') || '';
        const userUniversity = localStorage.getItem('userUniversity') || '';
        carpools = generateDemoCarpools(userRegion, userUniversity);
        localStorage.setItem('carpoolListings', JSON.stringify(carpools));
      }
      
      return carpools;
    }
  },

  /**
   * Get carpools for a specific user (driver)
   * @param {string} userId - User ID (UUID-compatible)
   * @returns {Promise<Array>} Array of user's carpool listings
   */
  async getUserCarpools(userId) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: Call API
      return await apiCall(`/carpools/user/${userId}`);
    } else {
      // 💾 LOCALSTORAGE: Filter from all carpools
      const allCarpools = await this.getAllCarpools();
      return allCarpools.filter(
        carpool => carpool.driverId === userId && carpool.status !== 'Deleted'
      );
    }
  },

  /**
   * Create a new carpool listing
   * @param {Object} carpoolData - Carpool data
   * @returns {Promise<Object>} Created carpool object
   */
  async createCarpool(carpoolData) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: POST to API (returns carpool with UUID)
      return await apiCall('/carpools', 'POST', carpoolData);
    } else {
      // 💾 LOCALSTORAGE: Add to localStorage
      const carpools = await this.getAllCarpools();
      
      // Get user data from localStorage to populate driver info
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      const userPhone = localStorage.getItem('userPhone');
      const userCountryCode = localStorage.getItem('countryCode') || '+961';
      const userGender = localStorage.getItem('gender');
      
      // GET PROFILE PICTURE FROM USER TABLE (DEMO_USERS) using userId
      // In production: const user = await fetch(`/api/users/${userId}`).then(r => r.json())
      const { getUserById } = await import('../data/demoData.js');
      const currentUser = getUserById(userId);
      const userProfilePicture = currentUser?.profilePicture || localStorage.getItem('profilePicture') || '';
      
      // Create carpool with timestamp-based ID (will be UUID from backend)
      const newCarpool = {
        id: Date.now().toString(), // 🔄 Backend will return UUID instead
        driverId: userId, // Use actual user ID
        driverName: userName,
        driverEmail: userEmail,
        driverPhone: userPhone,
        driverCountryCode: userCountryCode, // From user's country
        driverGender: userGender,
        driverProfilePicture: userProfilePicture,
        passengers: [], // Empty array initially
        seats: 0,
        availableSeats: carpoolData.totalSeats,
        status: 'Active',
        ...carpoolData,
        createdAt: new Date().toISOString()
      };
      
      carpools.push(newCarpool);
      localStorage.setItem('carpoolListings', JSON.stringify(carpools));
      
      return newCarpool;
    }
  },

  /**
   * Update an existing carpool
   * @param {string} carpoolId - Carpool ID (UUID-compatible)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated carpool object
   */
  async updateCarpool(carpoolId, updateData) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: PUT to API
      return await apiCall(`/carpools/${carpoolId}`, 'PUT', updateData);
    } else {
      // 💾 LOCALSTORAGE: Update in localStorage
      const carpools = await this.getAllCarpools();
      const index = carpools.findIndex(c => c.id === carpoolId);
      
      if (index === -1) {
        throw new Error('Carpool not found');
      }
      
      carpools[index] = {
        ...carpools[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('carpoolListings', JSON.stringify(carpools));
      return carpools[index];
    }
  },

  /**
   * Delete a carpool listing
   * @param {string} carpoolId - Carpool ID (UUID-compatible)
   * @returns {Promise<Object>} { success: boolean, message: string }
   */
  async deleteCarpool(carpoolId) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: DELETE from API
      await apiCall(`/carpools/${carpoolId}`, 'DELETE');
      return { success: true, message: 'Carpool deleted successfully' };
    } else {
      // 💾 LOCALSTORAGE: Remove from localStorage
      const carpools = await this.getAllCarpools();
      const filteredCarpools = carpools.filter(c => c.id !== carpoolId);
      
      if (carpools.length === filteredCarpools.length) {
        throw new Error('Carpool not found');
      }
      
      localStorage.setItem('carpoolListings', JSON.stringify(filteredCarpools));
      return { success: true, message: 'Carpool deleted successfully' };
    }
  },

  /**
   * Join a carpool as a passenger
   * @param {string} carpoolId - Carpool ID (UUID-compatible)
   * @param {Object} passengerData - Passenger info
   * @returns {Promise<Object>} Updated carpool object
   */
  async joinCarpool(carpoolId, passengerData) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: POST to join endpoint
      return await apiCall(`/carpools/${carpoolId}/join`, 'POST', passengerData);
    } else {
      // 💾 LOCALSTORAGE: Use helper function to avoid code duplication
      const result = addPassengerToCarpool(carpoolId, passengerData);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.updatedCarpool;
    }
  },

  /**
   * Leave a carpool as a passenger
   * @param {string} carpoolId - Carpool ID (UUID-compatible)
   * @param {string} userId - User ID (UUID-compatible)
   * @returns {Promise<Object>} Updated carpool object
   */
  async leaveCarpool(carpoolId, userId) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: DELETE from leave endpoint
      return await apiCall(`/carpools/${carpoolId}/leave`, 'DELETE', { userId });
    } else {
      // 💾 LOCALSTORAGE: Use helper function to avoid code duplication
      const result = leaveCarpoolInStorage(carpoolId, userId, 'joinedCarpools');
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.updatedCarpool;
    }
  },

  /**
   * Get joined carpools for a user
   * @param {string} userId - User ID (UUID-compatible)
   * @returns {Promise<Array>} Array of carpool IDs user has joined
   */
  async getJoinedCarpools(userId) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: GET from API
      return await apiCall(`/users/${userId}/joined-carpools`);
    } else {
      // 💾 LOCALSTORAGE: Read from localStorage
      return JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
    }
  },

  /**
   * Update joined carpools list
   * @param {Array} carpoolIds - Array of carpool IDs
   * @returns {Promise<void>}
   */
  async updateJoinedCarpools(carpoolIds) {
    if (USE_BACKEND) {
      // 🌐 BACKEND: Handled by joinCarpool/leaveCarpool endpoints
      // No need to manually update - backend maintains this
      return;
    } else {
      // 💾 LOCALSTORAGE: Update localStorage
      localStorage.setItem('joinedCarpools', JSON.stringify(carpoolIds));
    }
  }
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default carpoolService;