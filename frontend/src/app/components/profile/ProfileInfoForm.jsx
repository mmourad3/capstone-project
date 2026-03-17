import { User, Mail, Lock, GraduationCap, MapPin, Phone, Save } from "lucide-react";
import { getAvailableCountries } from "../../config/appConfig";

export function ProfileInfoForm({ 
  isEditing, 
  editedData, 
  setEditedData, 
  userData, 
  handleSaveProfile, 
  handleCancelEdit 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Profile Information</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {/* First Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.firstName}
              onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="John"
            />
          ) : (
            <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base break-words">{userData.firstName}</span>
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.lastName}
              onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="Doe"
            />
          ) : (
            <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base break-words">{userData.lastName}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            University Email
            {isEditing && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 inline-block ml-2" title="Cannot be changed for security" />}
          </label>
          {isEditing ? (
            <>
              <input
                type="email"
                value={userData.email || 'Not provided'}
                disabled
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed for security. Contact support if you need to update this.
              </p>
            </>
          ) : (
            <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base break-all">{userData.email || 'Not provided'}</span>
            </div>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gender
            {isEditing && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 inline-block ml-2" title="Cannot be changed" />}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not provided'}
              disabled
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed text-sm sm:text-base"
            />
          ) : (
            <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base">{userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not provided'}</span>
            </div>
          )}
        </div>

        {/* Country & Phone Number */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country & Phone Number
          </label>
          {isEditing ? (
            <div className="space-y-3">
              <select
                value={editedData.country}
                onChange={(e) => {
                  const selectedCountry = getAvailableCountries().find(c => c.name === e.target.value);
                  setEditedData({
                    ...editedData,
                    country: e.target.value,
                    countryCode: selectedCountry?.code || ''
                  });
                }}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
              >
                <option value="">Select country</option>
                {getAvailableCountries().map((country) => (
                  <option key={country.iso} value={country.name}>
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedData.countryCode}
                  disabled
                  className="w-20 sm:w-24 px-2 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-sm sm:text-base"
                />
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    setEditedData({ ...editedData, phone: value });
                  }}
                  placeholder="Phone number"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm sm:text-base"
                />
              </div>
              {editedData.country && getAvailableCountries().find(c => c.name === editedData.country) && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Format: {getAvailableCountries().find(c => c.name === editedData.country)?.phoneFormat}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 mb-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span className="text-sm sm:text-base break-words">{userData.country || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span className="text-sm sm:text-base break-words">
                  {userData.countryCode && userData.phone 
                    ? `${userData.countryCode} ${userData.phone}`
                    : 'Not provided'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* University */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            University
            {isEditing && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 inline-block ml-2" title="Cannot be changed for security" />}
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                value={userData.university || 'Not provided'}
                disabled
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                University cannot be changed. Contact support if you need to update this.
              </p>
            </>
          ) : (
            <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className="text-sm sm:text-base break-words">{userData.university || 'Not provided'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSaveProfile}
            className="flex-1 bg-green-500 dark:bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Save Changes
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 sm:py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium cursor-pointer text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}