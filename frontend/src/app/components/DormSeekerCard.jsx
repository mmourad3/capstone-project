import { MapPin, Users, MessageCircle, Heart, Home, User } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';
import { CompatibilityBadge } from './CompatibilityBadge';
import { formatDistance } from '../utils/universityCoordinates';
import { getGenderDisplayText } from '../utils/genderFilterHelpers';

export function DormSeekerCard({ 
  listing, 
  userUniversity,
  isSaved,
  onToggleSave,
  onViewDetails,
  onViewProviderProfile,
  onWhatsApp
}) {
  // Calculate display gender based on provider's preference
  const displayGender = getGenderDisplayText(listing.genderPreference, listing.posterGender);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageCarousel
          images={listing.images}
          alt={listing.location}
          height="h-48 sm:h-56"
        />
        <button
          onClick={() => onToggleSave(listing.id)}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors z-10 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isSaved
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
          />
        </button>
      </div>
      <div className="p-4 sm:p-6">
        {/* AI Compatibility Score Badge */}
        {listing.compatibilityScore !== undefined && (
          <div className="mb-4">
            <CompatibilityBadge score={listing.compatibilityScore} />
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <button
            onClick={() => onViewDetails(listing)}
            className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left cursor-pointer"
          >
            {listing.title}
          </button>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${listing.price}/month
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>
              {formatDistance(listing.distanceKm)} from {userUniversity}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{listing.roomType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Gender: {displayGender}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Provider Profile Section */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {listing.posterProfilePic ? (
            <img
              src={listing.posterProfilePic}
              alt={listing.posterName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-500 dark:border-blue-400">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {listing.posterName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {listing.posterGender}
            </p>
          </div>
          <button
            onClick={() => onViewProviderProfile(listing.posterId)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium cursor-pointer"
          >
            View Profile
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onViewDetails(listing)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm cursor-pointer"
          >
            View Full Details →
          </button>
          <button
            onClick={() =>
              onWhatsApp(listing.whatsapp, listing.posterName, listing)
            }
            className="flex items-center gap-2 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}