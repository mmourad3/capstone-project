export const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' }
];

// Helper function to convert day names to abbreviations
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
 * Check if carpool schedule is compatible with passenger schedule
 * Driver must depart before passenger's class starts and return after class ends
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