import { MapPin, Clock, Users, MessageCircle, Trash2, X, DollarSign, Calendar, Car, Check, User } from "lucide-react";
import { getDayAbbreviation, getReturnTime, formatPassengerCount, formatCarpoolLocation } from "../utils/carpoolHelpers";
import { ProfilePicture } from "./ProfilePicture";
import { openWhatsAppChat } from "../utils/whatsappUtils";
import { getUserById } from "../data/demoData";

export function CarpoolCard({ 
  carpool, 
  type = "browse", // "browse" or "my-listing"
  hasJoined = false,
  onJoin,
  onLeave,
  onContact,
  onDelete,
  onAddDemoPassenger,
  onRemovePassenger,
  isJoinDisabled = false,
  joinButtonText = "Join Ride"
}) {
  const returnTime = getReturnTime(carpool);

  // Get current user info for WhatsApp message
  const userId = localStorage.getItem('userId');
  const currentUser = getUserById(userId);
  const driverName = currentUser?.name || carpool.driverName || 'the driver';

  // Get days from the driver's selected schedule block (there's only one per carpool)
  const getScheduleDays = () => {
    if (!carpool.driverSchedule || carpool.driverSchedule.length === 0) return [];
    
    // Each carpool has exactly ONE schedule block that the driver selected
    const selectedBlock = carpool.driverSchedule[0];
    if (!selectedBlock || !selectedBlock.days) return [];
    
    // Sort the days in week order
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return selectedBlock.days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  };

  const scheduleDays = getScheduleDays();

  if (type === "my-listing") {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="flex gap-3 flex-1">
                <ProfilePicture 
                  src={carpool.driverProfilePicture} 
                  alt={carpool.driverName}
                  size="md"
                />
                <div className="flex-1">
                  {carpool.pickupSpot && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">
                        {carpool.pickupSpot} → {carpool.destination}
                      </span>
                    </div>
                  )}
                  {carpool.carModel && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <Car className="w-4 h-4" />
                      <span>{carpool.carModel}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${
                carpool.status === "Full" 
                  ? "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300" 
                  : "bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300"
              }`}>
                {carpool.status}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{carpool.date}{carpool.endDate ? ` - ${carpool.endDate}` : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Depart: {carpool.time}</span>
              </div>
              {returnTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Return: {returnTime}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{carpool.seats || 0}/{carpool.totalSeats || 4}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-600 dark:text-blue-400">{carpool.price} per seat</span>
              </div>
              {carpool.genderPreference && (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    carpool.genderPreference === 'same' 
                      ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                  }`}>
                    {carpool.genderPreference === 'same' ? 'Same Gender Only' : 'All Welcome'}
                  </span>
                </div>
              )}
            </div>

            {/* Class Days Display */}
            {/* Class Days and Passengers Display */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Available Class Days */}
                {scheduleDays.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Available Class Days:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {scheduleDays.map(day => (
                          <span 
                            key={day}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                          >
                            {getDayAbbreviation(day)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Passengers List */}
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Passengers ({carpool.passengers?.length || 0}/{carpool.totalSeats || 4}):
                    </p>
                    {carpool.passengers && carpool.passengers.length > 0 ? (
                      <div className="space-y-2">
                        {carpool.passengers.map((passenger, index) => (
                          <div 
                            key={passenger.id || index}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg"
                          >
                            <ProfilePicture 
                              src={passenger.profilePicture} 
                              alt={passenger.name}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                {passenger.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {passenger.phone}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                const message = `Hello ${passenger.name}! This is ${driverName}. Let me know if you have any questions about our carpool on ${carpool.date}. Looking forward to it!`;
                                openWhatsAppChat(passenger.phone, message);
                              }}
                              className="flex-shrink-0 p-1.5 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/30 transition-colors"
                              title="Contact on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            {onRemovePassenger && (
                              <button
                                onClick={() => onRemovePassenger(carpool.id, passenger.id)}
                                className="flex-shrink-0 p-1.5 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors"
                                title="Remove passenger"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">No passengers yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row lg:flex-col gap-2">
            {onAddDemoPassenger && (
              <button
                onClick={() => onAddDemoPassenger?.(carpool.id)}
                className="flex items-center gap-2 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/30 transition-colors flex-1 lg:flex-initial justify-center text-xs sm:text-sm cursor-pointer"
                title="Add a demo passenger for testing"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                + Demo
              </button>
            )}
            <button
              onClick={() => onDelete?.(carpool.id)}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors flex-1 lg:flex-initial justify-center text-xs sm:text-sm cursor-pointer"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Browse type (default)
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <ProfilePicture 
                src={carpool.driverProfilePicture} 
                alt={carpool.driverName}
                size="md"
              />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {carpool.driverName}
                  {carpool.driverGender && (
                    null
                  )}
                </h3>
                {carpool.carModel && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    {carpool.carModel}
                  </p>
                )}
              </div>
            </div>
            <span className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full font-medium w-fit ${
              carpool.status === "Full" 
                ? "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300" 
                : "bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300"
            }`}>
              {carpool.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium">Pickup:</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 ml-5 sm:ml-6 text-xs sm:text-sm">
                {carpool.pickupSpot}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Destination:</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 ml-5 sm:ml-6 text-xs sm:text-sm">{carpool.destination}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{carpool.date}{carpool.endDate ? ` - ${carpool.endDate}` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Depart: {carpool.time}</span>
            </div>
            {returnTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Return: {returnTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{carpool.seats || 0}/{carpool.totalSeats || 4} joined</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">{carpool.price}</span>
            </div>
            {carpool.genderPreference && (
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  carpool.genderPreference === 'same' 
                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                }`}>
                  {carpool.genderPreference === 'same' ? 'Same Gender Only' : 'All Welcome'}
                </span>
              </div>
            )}
          </div>

          {/* Class Days Display */}
          {scheduleDays.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Available Class Days:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scheduleDays.map(day => (
                      <span 
                        key={day}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                      >
                        {getDayAbbreviation(day)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex lg:flex-col gap-2">
          {hasJoined ? (
            <>
              <button
                onClick={() => onLeave?.(carpool)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer font-medium"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                Leave Carpool
              </button>
              <button
                onClick={() => onContact?.(carpool)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer font-medium"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Driver
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onJoin?.(carpool)}
                disabled={isJoinDisabled}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer font-medium ${
                  isJoinDisabled
                    ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30'
                }`}
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                {joinButtonText}
              </button>
              <button
                onClick={() => onContact?.(carpool)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer font-medium"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}