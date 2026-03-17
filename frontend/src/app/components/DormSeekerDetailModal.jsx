import { X, MapPin, Users, MessageCircle, Heart, Home, User, Phone, Mail, Tag } from 'lucide-react';
import { CompatibilityBadge } from './CompatibilityBadge';
import RequestRoommateButton from './RequestRoommateButton';
import { formatDistance } from '../utils/universityCoordinates';
import { ImageCarousel } from './ImageCarousel';
import { availableAmenities } from '../constants/amenities';
import { getGenderDisplayText } from '../utils/genderFilterHelpers';

export function DormSeekerDetailModal({
  selectedListing,
  setSelectedListing,
  savedListings,
  toggleSaved,
  handleWhatsApp,
  handleViewProviderProfile,
  handleCloseListing,
  userUniversity
}) {
  if (!selectedListing) return null;

  // Use custom close handler if provided, otherwise use setSelectedListing(null)
  const closeModal = handleCloseListing || (() => setSelectedListing(null));

  // Calculate display gender based on provider's preference
  const displayGender = getGenderDisplayText(selectedListing.genderPreference, selectedListing.posterGender);

  return (
    <div 
      className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4" 
      onClick={closeModal}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Dorm Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaved(selectedListing.id)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                savedListings.includes(selectedListing.id)
                  ? "bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${
                  savedListings.includes(selectedListing.id) 
                    ? "fill-red-500 text-red-500" 
                    : "text-gray-600 dark:text-gray-300"
                }`} 
              />
            </button>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Image Carousel in Modal */}
        <ImageCarousel images={selectedListing.images} alt={selectedListing.title} />

        <div className="p-4 sm:p-6">
          {/* AI Compatibility */}
          {selectedListing.compatibilityScore !== undefined && (
            <div className="mb-6">
              <CompatibilityBadge score={selectedListing.compatibilityScore} />
            </div>
          )}

          {/* Listing Details */}
          <div className="mb-6">
            {/* Listing Title as Big Heading */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedListing.title}</h3>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${selectedListing.price}/month</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                </div>
                <p className="font-medium ml-6">{selectedListing.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{formatDistance(selectedListing.distanceKm)} from {userUniversity}</p>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Room Type</p>
                </div>
                <p className="font-medium ml-6">{selectedListing.roomType}</p>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gender Preference</p>
                </div>
                <p className="font-medium ml-6">{displayGender}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedListing.description}</p>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {selectedListing.amenities.map((amenityId, idx) => {
                  const amenityInfo = availableAmenities.find(a => a.id === amenityId);
                  if (!amenityInfo) return null;
                  const AmenityIcon = amenityInfo.icon;
                  return (
                    <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
                      <AmenityIcon className="w-4 h-4" />
                      {amenityInfo.label}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Lifestyle Tags */}
            {selectedListing.lifestyleTags && selectedListing.lifestyleTags.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Lifestyle Preferences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.lifestyleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-full text-sm text-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Provider Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Provider Information</h4>
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              {selectedListing.posterProfilePic ? (
                <img
                  src={selectedListing.posterProfilePic}
                  alt={selectedListing.poster}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg flex-shrink-0">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h5 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{selectedListing.poster}</h5>
                  <button
                    onClick={() => handleWhatsApp(selectedListing.whatsapp, selectedListing.poster, selectedListing)}
                    className="flex items-center justify-center gap-1.5 bg-green-500 dark:bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium cursor-pointer flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="capitalize">{selectedListing.posterGender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{selectedListing.posterEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{selectedListing.posterPhone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons - stacked on mobile, side by side on desktop */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Left column - Request button + warning text */}
              <div className="w-full">
                <RequestRoommateButton 
                  user={{
                    id: selectedListing.posterId,
                    name: selectedListing.poster,
                    email: selectedListing.posterEmail,
                    picture: selectedListing.posterProfilePic
                  }}
                />
                
                {/* Warning text directly under Cannot Send Request button */}
                {(() => {
                  const currentUserId = localStorage.getItem('userId');
                  const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
                  
                  // Check if there's a request to THIS specific user
                  const requestToThisUser = requests.find(
                    req => req.senderUserId === currentUserId && 
                           req.recipientUserId === selectedListing.posterId && 
                           req.status === 'pending'
                  );
                  
                  // Check if there's ANY pending request
                  const anyPendingRequest = requests.find(
                    req => req.senderUserId === currentUserId && req.status === 'pending'
                  );
                  
                  // Check if user has active roommate
                  const roommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
                  const hasActiveRoommate = roommates.find(
                    rm => rm.userId === currentUserId && rm.status === 'active'
                  );
                  
                  // Only show warning if:
                  // 1. User has a pending request (to anyone)
                  // 2. NOT already requested THIS specific user
                  // 3. User does NOT have an active roommate
                  const shouldShowWarning = anyPendingRequest && !requestToThisUser && !hasActiveRoommate;
                  
                  return shouldShowWarning ? (
                    <p className="text-xs text-orange-600 dark:text-orange-400 text-center font-medium mt-1.5">Cancel your pending request first</p>
                  ) : null;
                })()}
              </div>
              
              {/* Right column - View Full Profile button */}
              <div className="w-full">
                <button
                  onClick={() => handleViewProviderProfile(selectedListing.posterId, selectedListing.id)}
                  className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base cursor-pointer"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}