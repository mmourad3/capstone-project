/**
 * CARPOOL HELPER FUNCTIONS
 * Shared utilities for carpool operations across the application
 * Last updated: 2026-03-13
 */

// Days of the week constant - can be used across the app
export const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' }
];

// Helper function to convert day names to abbreviations (matching signup format)
export const getDayAbbreviation = (day) => {
  const dayLower = day.toLowerCase();
  const abbreviations = {
    'monday': 'Mon',
    'tuesday': 'Tue',
    'wednesday': 'Wed',
    'thursday': 'Thu',
    'friday': 'Fri',
    'saturday': 'Sat',
    'sunday': 'Sun'
  };
  return abbreviations[dayLower] || day.charAt(0).toUpperCase() + day.slice(0, 3);
};

// Helper function to format passenger count
export const formatPassengerCount = (carpool) => {
  const seats = carpool.seats || 0;
  const totalSeats = carpool.totalSeats || 4;
  return `${seats}/${totalSeats}`;
};

// Helper function to format location (pickup → destination)
export const formatCarpoolLocation = (carpool) => {
  if (!carpool.pickupSpot || !carpool.destination) return '';
  return `${carpool.pickupSpot} → ${carpool.destination}`;
};

/**
 * LocalStorage Helper Functions
 */

/**
 * Load carpools from localStorage
 * @returns {Array} Array of carpool objects
 */
export const loadCarpoolsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('carpoolListings') || '[]');
  } catch (error) {
    console.error('Error loading carpools:', error);
    return [];
  }
};

/**
 * Save carpools to localStorage
 * @param {Array} carpools - Array of carpool objects to save
 */
export const saveCarpoolsToStorage = (carpools) => {
  try {
    localStorage.setItem('carpoolListings', JSON.stringify(carpools));
  } catch (error) {
    console.error('Error saving carpools:', error);
  }
};

/**
 * Update a single carpool in localStorage
 * @param {string} carpoolId - ID of carpool to update (UUID-compatible)
 * @param {Object} updateData - Data to update
 * @returns {Object} { success: boolean, message: string }
 */
export const updateCarpoolInStorage = (carpoolId, updateData) => {
  try {
    const carpools = loadCarpoolsFromStorage();
    const index = carpools.findIndex(c => c.id === carpoolId);
    
    if (index === -1) {
      return { success: false, message: 'Carpool not found' };
    }
    
    carpools[index] = { ...carpools[index], ...updateData };
    saveCarpoolsToStorage(carpools);
    
    return { success: true, message: 'Carpool updated successfully' };
  } catch (error) {
    console.error('Error updating carpool:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Delete a carpool from localStorage
 * @param {string} carpoolId - ID of carpool to delete (UUID-compatible)
 * @returns {Object} { success: boolean, message: string }
 */
export const deleteCarpoolFromStorage = (carpoolId) => {
  try {
    const carpools = loadCarpoolsFromStorage();
    const filteredCarpools = carpools.filter(c => c.id !== carpoolId);
    
    if (carpools.length === filteredCarpools.length) {
      return { success: false, message: 'Carpool not found' };
    }
    
    saveCarpoolsToStorage(filteredCarpools);
    return { success: true, message: 'Carpool deleted successfully' };
  } catch (error) {
    console.error('Error deleting carpool:', error);
    return { success: false, message: error.message };
  }
};

// Helper function to get return time from driver's schedule
export const getReturnTime = (ride) => {
  // First check if returnTime is directly stored in the carpool object
  if (ride.returnTime) {
    return ride.returnTime;
  }
  
  // Fallback to computing from driver's schedule
  if (!ride.driverSchedule || ride.driverSchedule.length === 0 || !ride.date) {
    return null;
  }
  
  // Get day of week from carpool date
  const carpoolDate = new Date(ride.date + 'T00:00:00');
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][carpoolDate.getDay()];
  
  // Find schedule blocks for this day
  const blocksForDay = ride.driverSchedule.filter(block => 
    block.days && block.days.includes(dayOfWeek)
  );
  
  if (blocksForDay.length === 0) {
    return null;
  }
  
  // Return the latest end time (in case driver has multiple classes that day)
  const endTimes = blocksForDay.map(block => block.endTime).filter(Boolean);
  if (endTimes.length === 0) {
    return null;
  }
  
  // Sort and get the latest time
  endTimes.sort();
  return endTimes[endTimes.length - 1];
};

/**
 * Handles leaving a carpool in localStorage
 * Shared logic for Profile.jsx and CarpoolDashboard.jsx
 * @param {string} carpoolId - ID of the carpool to leave
 * @param {string} userId - ID of the user leaving (used to match passenger)
 * @param {string} joinedRidesKey - LocalStorage key for joined rides (default: 'joinedRides')
 * @returns {Object} Result with success flag and message
 */
export const leaveCarpoolInStorage = (carpoolId, userId, joinedRidesKey = 'joinedRides') => {
  try {
    // Update carpools in localStorage
    const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    const carpoolIndex = storedCarpools.findIndex(c => c.id === carpoolId);
    
    if (carpoolIndex === -1) {
      return {
        success: false,
        message: 'Carpool not found'
      };
    }
    
    const carpool = storedCarpools[carpoolIndex];
    
    // Remove passenger by userId
    if (carpool.passengers) {
      carpool.passengers = carpool.passengers.filter(p => p.id !== userId);
    }
    
    // Update available seats and status
    carpool.availableSeats = (carpool.totalSeats || 4) - (carpool.passengers ? carpool.passengers.length : 0);
    carpool.seats = carpool.passengers ? carpool.passengers.length : 0;
    
    // Update status back to "Active" if seats are available
    if (carpool.seats < (carpool.totalSeats || 4)) {
      carpool.status = "Active";
    }
    
    storedCarpools[carpoolIndex] = carpool;
    localStorage.setItem('carpoolListings', JSON.stringify(storedCarpools));
    
    // Update joined rides
    const storedJoinedRides = JSON.parse(localStorage.getItem(joinedRidesKey) || '[]');
    const updatedJoinedRides = storedJoinedRides.filter(id => id !== carpoolId);
    localStorage.setItem(joinedRidesKey, JSON.stringify(updatedJoinedRides));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('joinedCarpoolsUpdated'));
    
    return {
      success: true,
      message: 'Successfully left carpool',
      updatedCarpool: carpool
    };
  } catch (error) {
    console.error('Error leaving carpool:', error);
    return {
      success: false,
      message: 'Failed to leave carpool'
    };
  }
};

/**
 * Check if user can JOIN a carpool (checks against created listings AND joined carpools)
 * @param {Array} newCarpoolDays - Days of the carpool they want to join
 * @param {string} userId - User's ID
 * @param {string} userEmail - User's email
 * @returns {Object} { hasConflict: boolean, conflictingDays: array, conflictType: string }
 */
export const checkDayConflictForJoining = (newCarpoolDays, userId, userEmail) => {
  if (!newCarpoolDays || newCarpoolDays.length === 0) {
    return { hasConflict: false, conflictingDays: [], conflictType: null };
  }

  // Normalize to lowercase
  const newDays = newCarpoolDays.map(day => day.toLowerCase());

  // Get all carpools
  const allCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
  const joinedCarpoolIds = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');

  // 1. Check against user's CREATED listings (active listings they're driving)
  const userCreatedCarpools = allCarpools.filter(c => 
    c.driverId === userId && c.status !== 'Deleted'
  );

  for (const carpool of userCreatedCarpools) {
    if (carpool.driverSchedule?.[0]?.days) {
      const existingDays = carpool.driverSchedule[0].days.map(d => d.toLowerCase());
      const overlapping = newDays.filter(day => existingDays.includes(day));
      
      if (overlapping.length > 0) {
        return {
          hasConflict: true,
          conflictingDays: overlapping,
          conflictType: 'created-listing'
        };
      }
    }
  }

  // 2. Check against carpools user has JOINED
  const joinedCarpools = allCarpools.filter(c => 
    joinedCarpoolIds.includes(c.id) && c.status !== 'Deleted'
  );

  for (const carpool of joinedCarpools) {
    if (carpool.driverSchedule?.[0]?.days) {
      const existingDays = carpool.driverSchedule[0].days.map(d => d.toLowerCase());
      const overlapping = newDays.filter(day => existingDays.includes(day));
      
      if (overlapping.length > 0) {
        return {
          hasConflict: true,
          conflictingDays: overlapping,
          conflictType: 'joined-carpool'
        };
      }
    }
  }

  return { hasConflict: false, conflictingDays: [], conflictType: null };
};

/**
 * Check if user can CREATE a listing (checks against joined carpools only)
 * @param {Array} newListingDays - Days for the listing they want to create
 * @param {string} userEmail - User's email
 * @returns {Object} { hasConflict: boolean, conflictingDays: array }
 */
export const checkDayConflictForCreating = (newListingDays, userEmail) => {
  if (!newListingDays || newListingDays.length === 0) {
    return { hasConflict: false, conflictingDays: [] };
  }

  // Normalize to lowercase
  const newDays = newListingDays.map(day => day.toLowerCase());

  // Get all carpools and joined IDs
  const allCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
  const joinedCarpoolIds = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');

  // Check against carpools user has JOINED (not their own listings)
  const joinedCarpools = allCarpools.filter(c => 
    joinedCarpoolIds.includes(c.id) && c.status !== 'Deleted'
  );

  for (const carpool of joinedCarpools) {
    if (carpool.driverSchedule?.[0]?.days) {
      const existingDays = carpool.driverSchedule[0].days.map(d => d.toLowerCase());
      const overlapping = newDays.filter(day => existingDays.includes(day));
      
      if (overlapping.length > 0) {
        return {
          hasConflict: true,
          conflictingDays: overlapping
        };
      }
    }
  }

  return { hasConflict: false, conflictingDays: [] };
};

/**
 * Add passenger to carpool and update counts
 * @param {string} carpoolId - Carpool ID to join
 * @param {Object} passengerData - Passenger details { id, name, email, phone, countryCode, gender, profilePicture }
 * @returns {Object} { success: boolean, message: string, updatedCarpool: Object }
 */
export const addPassengerToCarpool = (carpoolId, passengerData) => {
  try {
    const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    const carpoolIndex = storedCarpools.findIndex(c => c.id === carpoolId);
    
    if (carpoolIndex === -1) {
      return { success: false, message: 'Carpool not found' };
    }
    
    const carpool = storedCarpools[carpoolIndex];
    
    // Initialize passengers array if needed
    if (!carpool.passengers) carpool.passengers = [];
    
    // Check if already full
    if (carpool.passengers.length >= (carpool.totalSeats || 4)) {
      return { success: false, message: 'Carpool is full' };
    }
    
    // Add passenger with userId as their id
    carpool.passengers.push({
      id: passengerData.id || `passenger_${Date.now()}`, // Use userId as passenger id
      name: passengerData.name,
      email: passengerData.email,
      phone: passengerData.phone,
      countryCode: passengerData.countryCode,
      gender: passengerData.gender,
      profilePicture: passengerData.profilePicture || '',
      joinedAt: new Date().toISOString()
    });
    
    // Update counts and status
    carpool.seats = carpool.passengers.length;
    carpool.availableSeats = (carpool.totalSeats || 4) - carpool.passengers.length;
    
    // Update status to "Full" if no seats remaining
    if (carpool.seats >= (carpool.totalSeats || 4)) {
      carpool.status = 'Full';
    }
    
    // Save back to localStorage
    storedCarpools[carpoolIndex] = carpool;
    localStorage.setItem('carpoolListings', JSON.stringify(storedCarpools));
    
    return { success: true, message: 'Passenger added successfully', updatedCarpool: carpool };
  } catch (error) {
    console.error('Error adding passenger:', error);
    return { success: false, message: 'Failed to add passenger' };
  }
};

/**
 * Check if carpool schedule is compatible with passenger schedule (TIMING VALIDATION)
 * Driver must depart BEFORE passenger's class starts and return AFTER class ends
 * @param {Object} carpool - Carpool object with driverSchedule, time, returnTime
 * @param {Array} passengerSchedule - Passenger's class schedule blocks
 * @returns {boolean} True if all carpool days are compatible with passenger schedule
 */
export const isCarpoolScheduleCompatible = (carpool, passengerSchedule) => {
  if (!passengerSchedule || passengerSchedule.length === 0) return true;
  if (!carpool.driverSchedule || carpool.driverSchedule.length === 0) return true;
  
  // Get ALL days from carpool's schedule
  const carpoolDays = carpool.driverSchedule.flatMap(block => block.days || []);
  
  // Check if EVERY carpool day has compatible timing
  return carpoolDays.every(carpoolDay => {
    // Find passenger schedule blocks that include this day
    const passengerBlocksForDay = passengerSchedule.filter(block => 
      block.days && block.days.includes(carpoolDay)
    );
    
    // If passenger doesn't have this day, not compatible
    if (passengerBlocksForDay.length === 0) {
      return false;
    }
    
    // Get carpool times
    const carpoolDepartTime = carpool.time;
    const carpoolReturnTime = carpool.returnTime;
    
    if (!carpoolDepartTime || !carpoolReturnTime) {
      return false;
    }
    
    // Check if ANY passenger block for this day has compatible times
    return passengerBlocksForDay.some(passengerBlock => {
      const passengerStartTime = passengerBlock.startTime;
      const passengerEndTime = passengerBlock.endTime;
      
      if (!passengerStartTime || !passengerEndTime) {
        return false;
      }
      
      // CRITICAL TIMING RULES:
      // 1. Carpool DEPARTS BEFORE passenger's class START time (driver picks up passenger before class)
      // 2. Carpool RETURNS at or AFTER passenger's class END time (driver waits for passenger after class)
      return carpoolDepartTime < passengerStartTime && carpoolReturnTime >= passengerEndTime;
    });
  });
};

/**
 * Compare two schedule blocks for equality
 * @param {Object} block1 - First schedule block
 * @param {Object} block2 - Second schedule block
 * @returns {boolean} True if blocks match
 */
export const areScheduleBlocksEqual = (block1, block2) => {
  if (!block1 || !block2) return false;
  
  return (
    block1.courseName === block2.courseName &&
    block1.startTime === block2.startTime &&
    block1.endTime === block2.endTime &&
    JSON.stringify(block1.days) === JSON.stringify(block2.days)
  );
};

/**
 * Find schedule block index in user's schedule that matches carpool's schedule
 * @param {Object} carpool - Carpool with driverSchedule
 * @param {Array} userSchedule - User's class schedule
 * @returns {number|null} Index of matching block or null if not found
 */
export const findScheduleBlockIndex = (carpool, userSchedule) => {
  if (!carpool.driverSchedule || carpool.driverSchedule.length === 0) return null;
  if (!userSchedule || userSchedule.length === 0) return null;
  
  const savedBlock = carpool.driverSchedule[0];
  const index = userSchedule.findIndex(block => areScheduleBlocksEqual(block, savedBlock));
  
  return index !== -1 ? index : null;
};

/**
 * Get user's own carpools by userId
 * @param {string} userId - User's ID
 * @returns {Array} Array of user's active carpools
 */
export const getUserCarpools = (userId) => {
  const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
  return storedCarpools.filter(
    carpool => carpool.driverId === userId && carpool.status !== 'Deleted'
  );
};

/**
 * Convert time string to minutes for comparison
 * @param {string} timeStr - Time in "HH:MM" format
 * @returns {number} Time in minutes
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Validate carpool times against schedule block
 * Ensures departure is before class starts and return is at or after class ends
 * @param {string} departTime - Departure time in "HH:MM" format
 * @param {string} returnTime - Return time in "HH:MM" format
 * @param {Object} scheduleBlock - Schedule block with startTime and endTime
 * @returns {Object} { valid: boolean, departError: string, returnError: string }
 */
export const validateCarpoolTimes = (departTime, returnTime, scheduleBlock) => {
  if (!departTime || !returnTime || !scheduleBlock) {
    return { valid: true, departError: '', returnError: '' };
  }

  const departMinutes = timeToMinutes(departTime);
  const classStartMinutes = timeToMinutes(scheduleBlock.startTime);
  const classEndMinutes = timeToMinutes(scheduleBlock.endTime);
  const returnMinutes = timeToMinutes(returnTime);

  let departError = '';
  let returnError = '';

  // Check: Depart before class starts
  if (departMinutes >= classStartMinutes) {
    departError = `Departure must be before class starts (${scheduleBlock.startTime})`;
  }

  // Check: Return at or after class ends
  if (returnMinutes < classEndMinutes) {
    returnError = `Return must be at or after class ends (${scheduleBlock.endTime})`;
  }

  return { 
    valid: !departError && !returnError, 
    departError, 
    returnError 
  };
};