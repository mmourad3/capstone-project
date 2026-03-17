import { Heart, MapPin, Home, DollarSign } from "lucide-react";

export function FavoriteDormsSection({ 
  favoritedListings, 
  handleViewDetails, 
  removeFavorite 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
        Favorite Dorms ({favoritedListings.length})
      </h2>

      {favoritedListings.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">No favorite dorms yet</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
            Click the heart icon on dorm listings to save your favorites here
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {favoritedListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
            >
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full sm:w-20 md:w-24 h-48 sm:h-20 md:h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 sm:mb-1 break-words">{listing.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="break-words">{listing.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-1">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{listing.roomType}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{listing.price}/month</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleViewDetails(listing)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  View Details
                </button>
                <button
                  onClick={() => removeFavorite(listing.id)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-red-600 dark:fill-red-400" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}