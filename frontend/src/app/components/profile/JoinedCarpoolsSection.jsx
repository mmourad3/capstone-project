import { MapPin, Calendar, Clock, DollarSign, Users, MessageCircle, X, Home } from "lucide-react";
import { getDayAbbreviation, getReturnTime, formatPassengerCount, formatCarpoolLocation, leaveCarpoolInStorage } from "../../utils/carpoolHelpers";
import { ProfilePicture } from "../ProfilePicture";
import { openWhatsAppChat } from "../../utils/whatsappUtils";
import { toast } from "react-toastify";

export function JoinedCarpoolsSection({ joinedCarpools }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        My Joined Carpools ({joinedCarpools.length})
      </h2>

      {joinedCarpools.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">No joined carpools yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join a carpool from the dashboard to see it here
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {joinedCarpools.map((carpool) => (
            <div
              key={carpool.id}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-slate-800"
            >
              {/* Driver Profile Picture */}
              <div className="flex-shrink-0 flex sm:block justify-center">
                <ProfilePicture
                  src={carpool.driverProfilePicture}
                  alt={carpool.driverName}
                  size="lg"
                  className="border-2 border-blue-500 dark:border-blue-400"
                />
              </div>

              {/* Carpool Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center sm:text-left">{carpool.driverName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{formatCarpoolLocation(carpool)}</span>
                  </div>
                  {/* Schedule Days */}
                  {carpool.driverSchedule && carpool.driverSchedule.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium">
                        {carpool.driverSchedule
                          .flatMap(block => block.days || [])
                          .filter((day, index, self) => self.indexOf(day) === index)
                          .sort((a, b) => {
                            const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                            return dayOrder.indexOf(a) - dayOrder.indexOf(b);
                          })
                          .map(day => getDayAbbreviation(day))
                          .join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{new Date(carpool.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Departs at {carpool.time}</span>
                  </div>
                  {getReturnTime(carpool) && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Returns at {getReturnTime(carpool)}</span>
                    </div>
                  )}
                  {carpool.carModel && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Home className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{carpool.carModel}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span>{carpool.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{formatPassengerCount(carpool)} joined</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 justify-center">
                <button
                  onClick={() => {
                    const message = `Hi ${carpool.driverName}! I joined your carpool on ${new Date(carpool.date).toLocaleDateString()}.`;
                    openWhatsAppChat(carpool.driverPhone, message);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to leave ${carpool.driverName}'s carpool?`)) {
                      const userEmail = localStorage.getItem('userEmail');
                      const result = leaveCarpoolInStorage(carpool.id, userEmail, 'joinedCarpools');
                      
                      if (result.success) {
                        toast.success(`You've left ${carpool.driverName}'s carpool`);
                        // Trigger event to refresh the profile page
                        window.dispatchEvent(new Event('joinedCarpoolsUpdated'));
                      } else {
                        toast.error('Failed to leave carpool. Please try again.');
                      }
                    }
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  Leave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}