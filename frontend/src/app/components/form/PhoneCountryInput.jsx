import { forwardRef } from "react";
import { AlertCircle, XCircle } from "lucide-react";
import { getAvailableCountries } from "../../config/appConfig";

/**
 * Reusable PhoneCountryInput component
 * Used in SignUp and Profile pages
 * Handles country selection and phone number input with validation
 * 
 * @param {string} country - Selected country name
 * @param {string} countryCode - Phone code (e.g., "+961")
 * @param {string} phone - Phone number
 * @param {function} onCountryChange - Callback when country changes (receives event)
 * @param {function} onPhoneChange - Callback when phone changes (receives event)
 * @param {function} onPhoneBlur - Callback when phone input loses focus
 * @param {string} error - Error message to display
 * @param {boolean} disabled - Whether inputs are disabled
 * @param {boolean} required - Whether the field is required
 * @param {boolean} isChecking - Whether phone existence check is in progress
 * @param {boolean} existsInDB - Whether phone exists in database
 */
export const PhoneCountryInput = forwardRef(({ 
  country,
  countryCode,
  phone,
  onCountryChange,
  onPhoneChange,
  onPhoneBlur,
  error = "",
  disabled = false,
  required = false,
  isChecking = false,
  existsInDB = false
}, ref) => {
  const countries = getAvailableCountries();

  return (
    <div>
      <label
        htmlFor="country"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Country / Region {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <select
        id="country"
        value={country}
        onChange={onCountryChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm sm:text-base cursor-pointer"
      >
        <option value="">Select your country</option>
        {countries.map(c => (
          <option key={c.name} value={c.name}>
            {c.flag} {c.name} ({c.code})
          </option>
        ))}
      </select>

      <div className="mt-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Phone Number {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
        <div className="flex gap-2" ref={ref}>
          {countryCode && (
            <div className="flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              {countryCode}
            </div>
          )}
          <div className="relative flex-1">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={onPhoneChange}
              onBlur={onPhoneBlur}
              placeholder={country ? countries.find(c => c.name === country)?.phoneFormat || "(123) 456-7890" : "(123) 456-7890"}
              required={required}
              disabled={!country || disabled}
              className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border ${
                error || existsInDB 
                  ? 'border-red-500 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-all text-sm sm:text-base ${
                !country || disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
              }`}
            />
            {isChecking && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 dark:border-blue-400"></div>
              </div>
            )}
            {existsInDB && !isChecking && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 dark:text-red-400" />
            )}
          </div>
        </div>
        {!country && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Please select a country first</p>
        )}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
});

PhoneCountryInput.displayName = 'PhoneCountryInput';