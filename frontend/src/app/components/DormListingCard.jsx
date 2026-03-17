import { MapPin, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';

export function DormListingCard({ 
  dorm, 
  availableAmenities, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onMarkInactive, 
  onViewDetails 
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Image Carousel */}
      <ImageCarousel images={dorm.images} alt={dorm.title} />
      
      {/* Dorm Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 
                onClick={() => onViewDetails(dorm)}
                className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {dorm.title}
              </h3>
              {/* Status Badge - Only show for Active/Inactive, not for Found Roommate */}
              {dorm.status !== 'Found Roommate' && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    dorm.status === 'Active'
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {dorm.status}
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm sm:text-base flex items-start gap-1">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="break-words">{dorm.location}</span>
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400 text-base sm:text-lg">${dorm.price}/month</span>
              <span>• {dorm.roomType}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">{dorm.description}</p>
            
            {/* Amenities Display */}
            {dorm.amenities && dorm.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {dorm.amenities.slice(0, 5).map((amenityId) => {
                  const amenity = availableAmenities.find(a => a.id === amenityId);
                  if (!amenity) return null;
                  const AmenityIcon = amenity.icon;
                  return (
                    <span
                      key={amenityId}
                      className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs"
                    >
                      <AmenityIcon className="w-3 h-3" />
                      {amenity.label}
                    </span>
                  );
                })}
                {dorm.amenities.length > 5 && (
                  <span className="inline-flex items-center bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                    +{dorm.amenities.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-row md:flex-col gap-2">
            {dorm.status === 'Inactive' && (
              <button
                onClick={() => onToggleActive(dorm.id)}
                className="flex items-center gap-2 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/30 transition-colors text-xs sm:text-sm flex-1 md:flex-initial justify-center cursor-pointer"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                Mark Active
              </button>
            )}
            {dorm.status === 'Active' && (
              <button
                onClick={() => onMarkInactive(dorm.id)}
                className="flex items-center gap-2 bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/30 transition-colors text-xs sm:text-sm flex-1 md:flex-initial justify-center cursor-pointer"
              >
                <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                Mark Inactive
              </button>
            )}
            {dorm.status !== 'Found Roommate' && (
              <button
                onClick={() => onEdit(dorm)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-xs sm:text-sm flex-1 md:flex-initial justify-center cursor-pointer"
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Edit
              </button>
            )}
            {/* Show status badge instead of Delete button when Found Roommate */}
            {dorm.status === 'Found Roommate' ? (
              <span className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300">
                Found Roommate
              </span>
            ) : (
              <button
                onClick={() => onDelete(dorm.id)}
                className="flex items-center gap-2 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors text-xs sm:text-sm flex-1 md:flex-initial justify-center cursor-pointer"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}