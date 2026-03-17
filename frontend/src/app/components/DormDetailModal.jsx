import { X, MapPin, Users, Eye, Edit2 } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';
import { getGenderDisplayText } from '../utils/genderFilterHelpers';

export function DormDetailModal({ 
  selectedDorm, 
  setSelectedDorm, 
  handleEdit, 
  handleToggleActive,
  availableAmenities 
}) {
  if (!selectedDorm) return null;

  // Calculate display gender based on provider's preference
  const displayGender = getGenderDisplayText(selectedDorm.genderPreference || selectedDorm.gender, selectedDorm.posterGender);

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedDorm.title}
          </h2>
          <button
            onClick={() => setSelectedDorm(null)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Large Image Carousel */}
          <div className="mb-6">
            <ImageCarousel images={selectedDorm.images} alt={selectedDorm.title} />
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            <span className={`inline-block text-sm px-4 py-2 rounded-full ${
              selectedDorm.status === 'Active'
                ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                : selectedDorm.status === 'Found Roommate'
                ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
            }`}>
              {selectedDorm.status}
            </span>
          </div>

          {/* Price and Basic Info */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-bold text-blue-600 dark:text-blue-400 text-[32px]">
                {selectedDorm.price}/month
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 dark:bg-blue-500/20 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Room Type</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{selectedDorm.roomType}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 dark:bg-blue-500/20 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gender Preference</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{displayGender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Location</h3>
            <p className="text-gray-600 dark:text-gray-400 flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              {selectedDorm.location}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedDorm.description}</p>
          </div>

          {/* All Amenities */}
          {selectedDorm.amenities && selectedDorm.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedDorm.amenities.map((amenityId) => {
                  const amenity = availableAmenities.find(a => a.id === amenityId);
                  if (!amenity) return null;
                  const AmenityIcon = amenity.icon;
                  return (
                    <div
                      key={amenityId}
                      className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-2.5 rounded-lg"
                    >
                      <AmenityIcon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inquiries Stats */}
          

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {selectedDorm.status !== 'Found Roommate' && (
              <button
                onClick={() => {
                  setSelectedDorm(null);
                  handleEdit(selectedDorm);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors font-medium cursor-pointer"
              >
                <Edit2 className="w-5 h-5" />
                Edit Listing
              </button>
            )}
            {selectedDorm.status === 'Inactive' && (
              <button
                onClick={() => {
                  handleToggleActive(selectedDorm.id);
                  setSelectedDorm(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors font-medium cursor-pointer"
              >
                <Eye className="w-5 h-5" />
                Mark as Active
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}