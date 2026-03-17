import { Calendar, Clock, Info } from "lucide-react";
import { DAYS_OF_WEEK } from "../../utils/carpoolHelpers";

/**
 * Reusable ClassScheduleBuilder component
 * Used in SignUp for creating initial schedule (inline/compact mode)
 * Different from ClassScheduleSection which is used in Profile for editing (full card mode)
 * 
 * @param {Array} schedule - Array of schedule blocks
 * @param {Object} scheduleHelpers - Object containing helper functions
 * @param {boolean} required - Whether at least one schedule is required
 * @param {string} helpText - Custom help text to display
 */
export function ClassScheduleBuilder({ 
  schedule = [], 
  scheduleHelpers = {},
  required = false,
  helpText = "This helps match you with rides that fit your schedule"
}) {
  const { 
    addScheduleBlock, 
    removeScheduleBlock, 
    toggleDayInBlock, 
    updateBlockTime, 
    isDayUsedElsewhere 
  } = scheduleHelpers;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Class Schedule
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </h3>
        <button
          type="button"
          onClick={addScheduleBlock}
          className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer"
        >
          + Add Schedule
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
        Select days with the same schedule and set their times. You can add multiple schedule blocks if you have different times on different days.
      </p>
      
      {schedule.length === 0 && required && (
        <p className="text-xs text-red-500 dark:text-red-400 mb-3">Please add at least one schedule block</p>
      )}

      <div className="space-y-4">
        {schedule.map((block, blockIndex) => (
          <div key={blockIndex} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Schedule #{blockIndex + 1}</span>
              {schedule.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeScheduleBlock(blockIndex)}
                  className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Days
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map(day => {
                  const isUsedElsewhere = isDayUsedElsewhere(blockIndex, day.id);
                  const isSelectedHere = block.days.includes(day.id);
                  
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => !isUsedElsewhere && toggleDayInBlock(blockIndex, day.id)}
                      disabled={isUsedElsewhere && !isSelectedHere}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isSelectedHere
                          ? 'bg-blue-500 dark:bg-blue-600 text-white cursor-pointer'
                          : isUsedElsewhere
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              {block.days.length === 0 && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">Select at least one day for this schedule</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={block.startTime}
                  onChange={(e) => updateBlockTime(blockIndex, 'startTime', e.target.value)}
                  max={block.endTime || undefined}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={block.endTime}
                  onChange={(e) => updateBlockTime(blockIndex, 'endTime', e.target.value)}
                  min={block.startTime || undefined}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {block.days.length > 0 && block.startTime && block.endTime && (
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded flex items-center gap-1">
                <Calendar className="w-3 h-3 inline" />
                {block.days.map(d => DAYS_OF_WEEK.find(day => day.id === d)?.label).join(', ')} | 
                <Clock className="w-3 h-3 inline" />
                {block.startTime} - {block.endTime}
              </div>
            )}
          </div>
        ))}
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {helpText}
        </p>
      )}
    </div>
  );
}