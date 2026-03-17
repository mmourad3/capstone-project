/**
 * Class schedule management utilities
 * Shared across Profile.jsx and SignUp.jsx
 */

/**
 * Creates schedule management helper functions
 * @param {Array} schedule - Current schedule state
 * @param {Function} setSchedule - State setter for schedule
 * @returns {Object} Object with schedule helper functions
 */
export const createScheduleHelpers = (schedule, setSchedule) => {
  return {
    /**
     * Adds a new empty schedule block
     */
    addScheduleBlock: () => {
      setSchedule([...schedule, { days: [], startTime: '', endTime: '' }]);
    },

    /**
     * Removes a schedule block at specified index
     * @param {number} index - Index of block to remove
     */
    removeScheduleBlock: (index) => {
      setSchedule(schedule.filter((_, i) => i !== index));
    },

    /**
     * Toggles a day in a specific schedule block
     * @param {number} blockIndex - Index of the schedule block
     * @param {string} dayId - ID of the day to toggle
     */
    toggleDayInBlock: (blockIndex, dayId) => {
      const newSchedule = [...schedule];
      const block = newSchedule[blockIndex];
      
      if (block.days.includes(dayId)) {
        block.days = block.days.filter(d => d !== dayId);
      } else {
        block.days = [...block.days, dayId];
      }
      
      setSchedule(newSchedule);
    },

    /**
     * Updates time in a specific schedule block
     * @param {number} blockIndex - Index of the schedule block
     * @param {string} field - Field to update ('startTime' or 'endTime')
     * @param {string} value - New time value
     */
    updateBlockTime: (blockIndex, field, value) => {
      const newSchedule = [...schedule];
      newSchedule[blockIndex][field] = value;
      setSchedule(newSchedule);
    },

    /**
     * Checks if a day is used in other blocks (not the current one)
     * @param {number} blockIndex - Index of current block
     * @param {string} dayId - ID of the day to check
     * @returns {boolean} True if day is used elsewhere
     */
    isDayUsedElsewhere: (blockIndex, dayId) => {
      return schedule.some((block, index) => 
        index !== blockIndex && block.days.includes(dayId)
      );
    }
  };
};
