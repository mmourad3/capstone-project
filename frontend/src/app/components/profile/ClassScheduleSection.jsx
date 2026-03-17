import { Calendar, Clock, MapPin, Save } from "lucide-react";
import { toast } from "react-toastify";
import { DAYS_OF_WEEK } from "../../utils/carpoolHelpers";

export function ClassScheduleSection({ 
  classSchedule, 
  carpoolRegion, 
  isEditingSchedule, 
  setIsEditingSchedule, 
  editedSchedule, 
  setEditedSchedule,
  scheduleHelpers 
}) {
  const { addScheduleBlock, removeScheduleBlock, toggleDayInBlock, updateBlockTime, isDayUsedElsewhere } = scheduleHelpers;

  const handleSaveSchedule = () => {
    // Validate class schedule
    if (editedSchedule.length === 0) {
      toast.error('Please add at least one schedule block');
      return;
    }

    // Validate each schedule block
    for (let i = 0; i < editedSchedule.length; i++) {
      const block = editedSchedule[i];
      if (block.days.length === 0) {
        toast.error(`Schedule #${i + 1}: Please select at least one day`);
        return;
      }
      if (!block.startTime || !block.endTime) {
        toast.error(`Schedule #${i + 1}: Please set start and end times`);
        return;
      }
    }

    // Save to localStorage
    localStorage.setItem('classSchedule', JSON.stringify(editedSchedule));

    // Trigger custom event for other components
    window.dispatchEvent(new Event('classScheduleUpdated'));
    
    setIsEditingSchedule(false);
    toast.success('Class schedule updated successfully!');
  };

  const handleCancelScheduleEdit = () => {
    setEditedSchedule([...classSchedule]);
    setIsEditingSchedule(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          Class Schedule
        </h2>
        {!isEditingSchedule && (
          <button
            onClick={() => {
              setEditedSchedule([...classSchedule]);
              setIsEditingSchedule(true);
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            Edit Schedule
          </button>
        )}
      </div>

      {isEditingSchedule ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Select days with the same schedule and set their times. You can add multiple schedule blocks if you have different times on different days.
            </p>
            <button
              type="button"
              onClick={addScheduleBlock}
              className="text-xs sm:text-sm bg-blue-500 dark:bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              + Add Schedule
            </button>
          </div>

          {editedSchedule.length === 0 && (
            <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mb-3">Please add at least one schedule block</p>
          )}

          <div className="space-y-4">
            {editedSchedule.map((block, blockIndex) => (
              <div key={blockIndex} className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Schedule #{blockIndex + 1}</span>
                  {editedSchedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScheduleBlock(blockIndex)}
                      className="text-xs sm:text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Days
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {DAYS_OF_WEEK.map(day => {
                        const isUsedElsewhere = isDayUsedElsewhere(blockIndex, day.id);
                        const isSelectedHere = block.days.includes(day.id);
                        
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => !isUsedElsewhere && toggleDayInBlock(blockIndex, day.id)}
                            disabled={isUsedElsewhere && !isSelectedHere}
                            className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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
                      <p className="text-xs text-red-500 dark:text-red-400 mt-2">Select at least one day for this schedule</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={block.startTime}
                        onChange={(e) => updateBlockTime(blockIndex, 'startTime', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                        End Time
                      </label>
                      <input
                        type="time"
                        value={block.endTime}
                        onChange={(e) => updateBlockTime(blockIndex, 'endTime', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {block.days.length > 0 && block.startTime && block.endTime && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-700 p-3 rounded">
                      📅 {block.days.map(d => DAYS_OF_WEEK.find(day => day.id === d)?.label).join(', ')} | 
                      🕐 {block.startTime} - {block.endTime}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <span className="font-medium">Your Region:</span> {carpoolRegion || 'Not set'}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  To change your region, please contact support
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveSchedule}
              className="flex-1 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Schedule
            </button>
            <button
              onClick={handleCancelScheduleEdit}
              className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {classSchedule.length > 0 ? (
            <div className="space-y-4">
              {classSchedule.map((block, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Schedule #{index + 1}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Days:</p>
                      <div className="flex flex-wrap gap-2">
                        {block.days.map(dayId => {
                          const day = DAYS_OF_WEEK.find(d => d.id === dayId);
                          return (
                            <span
                              key={dayId}
                              className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                            >
                              {day?.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Start Time
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium">{block.startTime || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          End Time
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium">{block.endTime || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No class schedule set</p>
          )}

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <span className="font-medium">Your Region:</span> {carpoolRegion || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}