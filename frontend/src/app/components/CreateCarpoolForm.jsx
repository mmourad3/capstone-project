import { X, MapPin, Calendar, Clock, Users, DollarSign, Car, User, Info, Lightbulb } from "lucide-react";
import { getDayAbbreviation, validateCarpoolTimes } from "../utils/carpoolHelpers";
import { useState } from "react";

export function CreateCarpoolForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  onClose,
  userRegion,
  userUniversity,
  userClassSchedule,
  regionLocations
}) {
  // State to hold validation errors - separate for depart and return times
  const [departError, setDepartError] = useState('');
  const [returnError, setReturnError] = useState('');

  const handleClose = () => {
    setFormData({
      pickupSpot: "",
      date: "",
      time: "",
      returnTime: "",
      seats: "",
      totalSeats: "",
      price: "",
      carModel: "",
      genderPreference: "both", // Add gender preference
      selectedScheduleBlock: null // Changed to single selection
    });
    setDepartError('');
    setReturnError('');
    onClose();
  };

  // Check if a schedule block already has an active listing
  const isScheduleBlockInUse = (block, blockIndex) => {
    const userEmail = localStorage.getItem('userEmail') || '';
    const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    
    return storedCarpools.some(carpool => {
      if (carpool.driverEmail !== userEmail) return false;
      if (!carpool.driverSchedule || carpool.driverSchedule.length === 0) return false;
      
      const existingBlock = carpool.driverSchedule[0];
      return (
        existingBlock.courseName === block.courseName &&
        existingBlock.startTime === block.startTime &&
        existingBlock.endTime === block.endTime &&
        JSON.stringify(existingBlock.days) === JSON.stringify(block.days)
      );
    });
  };

  // Auto-set return time when schedule block changes
  const handleScheduleBlockChange = (index) => {
    const block = userClassSchedule[index]
    
    setFormData({
      ...formData,
      selectedScheduleBlock: index,
      returnTime: block?.endTime || ""
    });
    setDepartError(''); // Clear error when changing schedule
    setReturnError(''); // Clear error when changing schedule
  };

  // Validate form before submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Get the selected schedule block
    const selectedBlock = formData.selectedScheduleBlock !== null 
      ? userClassSchedule[formData.selectedScheduleBlock] 
      : null;
    
    // Validate times
    const validation = validateCarpoolTimes(
      formData.time,
      formData.returnTime,
      selectedBlock
    );
    
    if (!validation.valid) {
      setDepartError(validation.departError);
      setReturnError(validation.returnError);
      return;
    }
    
    // Clear errors and proceed with submission
    setDepartError('');
    setReturnError('');
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Ride Listing
          </h2>
          <button onClick={handleClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Route Information */}
          <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Route Information
            </h3>
            <div className="space-y-2 text-sm text-blue-900 dark:text-blue-300">
              <p><strong>From:</strong> {userRegion}</p>
              <p><strong>To:</strong> {userUniversity}</p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Destination is automatically set to your university
              </p>
            </div>
          </div>

          {/* Schedule Block Selection */}
          <div className="bg-green-50 dark:bg-green-500/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Schedule for this Carpool <span className="text-red-500 dark:text-red-400">*</span>
            </h3>
            <p className="text-xs text-green-700 dark:text-green-400 mb-3 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Choose which class schedule this carpool will align with. Create separate listings for different schedules.
            </p>
            {userClassSchedule && userClassSchedule.length > 0 ? (
              <div className="space-y-2">
                {userClassSchedule.map((block, index) => {
                  const days = block.days || [];
                  const daysDisplay = days.map(d => getDayAbbreviation(d)).join(', ');
                  const blockInUse = isScheduleBlockInUse(block, index);
                  const isDisabled = blockInUse && formData.selectedScheduleBlock !== index;
                  
                  return (
                    <label
                      key={index}
                      className={`flex items-start p-3 rounded-lg border-2 transition-all ${
                        isDisabled 
                          ? 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 opacity-60 cursor-not-allowed'
                          : formData.selectedScheduleBlock === index
                          ? 'border-green-500 dark:border-green-600 bg-green-100 dark:bg-green-500/20 cursor-pointer'
                          : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-green-300 dark:hover:border-green-600 cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.selectedScheduleBlock === index}
                        onChange={() => !isDisabled && handleScheduleBlockChange(index)}
                        disabled={isDisabled}
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {block.courseName || `Schedule Block ${index + 1}`}
                          </div>
                          {blockInUse && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium">
                              In Use
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-medium">{daysDisplay}</span> • {block.startTime} - {block.endTime}
                        </div>
                        {blockInUse && (
                          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            Already has an active listing
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                ⚠️ You don't have any class schedule set. Please update your profile.
              </p>
            )}
          </div>

          {/* Pickup Spot */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pickup Spot <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.pickupSpot}
              onChange={(e) => setFormData({...formData, pickupSpot: e.target.value})}
              placeholder="e.g., in front of the library"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Depart Time */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Depart Time <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {departError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{departError}</p>}
            </div>
          </div>

          {/* Return Time */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Return Time <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="time"
                required
                value={formData.returnTime}
                onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            {returnError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{returnError}</p>}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Auto-filled based on your class schedule. You can adjust if needed.
            </p>
          </div>

          {/* Seats and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Seats <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="number"
                  required
                  min="1"
                  max="7"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: e.target.value})}
                  placeholder="How many seats?"
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price per Seat <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., 5"
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Car Model */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Car Model <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                required
                value={formData.carModel}
                onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                placeholder="e.g., Honda Civic 2020"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Passenger Gender Preference <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={formData.genderPreference || "both"}
                onChange={(e) => setFormData({...formData, genderPreference: e.target.value})}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
              >
                <option value="both">Accept Both Genders</option>
                <option value="same">Same Gender Only</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose who can join your carpool based on gender
            </p>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              Tip: Your listing will remain active until you manually remove it. Carpools are expected to run for the entire semester. If you need to end it early, please notify your passengers in advance. Set a fair price and be clear about the pickup location.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base cursor-pointer"
            >
              Create Listing
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}