import { useRef } from 'react';
import { X, Check, AlertCircle, CheckCircle } from 'lucide-react';
import { LocationPicker } from './LocationPicker';
import { ImageUpload } from './ImageUpload';
import { toast } from 'react-toastify';
import { availableAmenities } from '../constants/amenities';

export function DormFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  editingDorm,
  locationCountryISO,
  locationCountryName
}) {
  // Refs for scrolling to errors
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const amenitiesRef = useRef(null);
  const imagesRef = useRef(null);

  const handleAmenityToggle = (amenityId) => {
    const updatedAmenities = formData.amenities.includes(amenityId)
      ? formData.amenities.filter(id => id !== amenityId)
      : [...formData.amenities, amenityId];
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate that title is provided
    if (!formData.title) {
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please enter a dorm title');
      return;
    }
    
    // Validate that coordinates are provided
    if (formData.latitude === null || formData.longitude === null) {
      locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please set a location with coordinates');
      return;
    }
    
    // Validate that price is provided
    if (!formData.price) {
      priceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please enter a price');
      return;
    }
    
    // Validate that description is provided
    if (!formData.description) {
      descriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please enter a description');
      return;
    }
    
    // Validate that at least one image is uploaded
    if (formData.images.length === 0) {
      imagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please upload at least one image');
      return;
    }
    
    // Validate that at least one amenity is selected
    if (formData.amenities.length === 0) {
      amenitiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please select at least one amenity');
      return;
    }
    
    // Call parent's onSubmit
    onSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-30">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {editingDorm ? 'Edit Dorm Listing' : 'Post New Dorm'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div ref={titleRef}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Listing Title <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Spacious Single Room"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
            />
            {!formData.title && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Please enter a listing title
              </p>
            )}
          </div>

          <div ref={locationRef}>
            <LocationPicker
              value={formData.latitude !== null && formData.longitude !== null ? { lat: formData.latitude, lng: formData.longitude } : null}
              onChange={(position) => setFormData(prev => ({
                ...prev,
                latitude: position ? position.lat : null,
                longitude: position ? position.lng : null
              }))}
              onAddressChange={(address) => setFormData(prev => ({...prev, location: address}))}
              initialAddress={formData.location}
              countryCode={locationCountryISO}
              countryName={locationCountryName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div ref={priceRef}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price per Month <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow $, numbers, and decimal point
                  if (value === '' || /^[\$]?[0-9]*\.?[0-9]*$/.test(value)) {
                    setFormData({...formData, price: value});
                  }
                }}
                placeholder="e.g., $650"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
              />
              {!formData.price && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Please enter a price
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Type
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none cursor-pointer text-sm sm:text-base"
              >
                <option value="single">Single Room</option>
                <option value="shared">Shared Room</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender Preference
            </label>
            <select
              value={formData.genderPreference || formData.gender || "any"}
              onChange={(e) => setFormData({...formData, genderPreference: e.target.value})}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none cursor-pointer text-sm sm:text-base"
            >
              <option value="any">No Preference</option>
              <option value="same">Same Gender</option>
            </select>
          </div>

          <div ref={descriptionRef}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your dorm, amenities, and any other important details..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none resize-none text-sm sm:text-base"
            />
            {!formData.description && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Please enter a description
              </p>
            )}
          </div>

          <div ref={amenitiesRef}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Amenities <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableAmenities.map((amenity) => {
                const AmenityIcon = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-xs sm:text-sm cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    <AmenityIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate flex-1 text-left">{amenity.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            {formData.amenities.length > 0 ? (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {formData.amenities.length} {formData.amenities.length === 1 ? 'amenity' : 'amenities'} selected
                </p>
              </div>
            ) : (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Please select at least one amenity
              </p>
            )}
          </div>

          <div ref={imagesRef}>
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({...formData, images})}
            />
            {formData.images.length === 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                At least one image is required
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 dark:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors font-medium text-sm sm:text-base cursor-pointer"
            >
              {editingDorm ? 'Update Listing' : 'Post Listing'}
            </button>
            <button
              type="button"
              onClick={onClose}
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