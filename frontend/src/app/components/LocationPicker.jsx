import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Loader2, X, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { geocodeAddress, getCurrentLocation, searchPlaces, reverseGeocode } from '../utils/geocoding';

export function LocationPicker({ value, onChange, onAddressChange, countryCode = null, countryName = null, initialAddress = '' }) {
  const [position, setPosition] = useState(value || null);
  const [address, setAddress] = useState(initialAddress || '');
  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isDecodingPlusCode, setIsDecodingPlusCode] = useState(false);

  // Track component mounted state to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Update local state when initialAddress changes (for editing)
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
      setSearchQuery(initialAddress);
    }
  }, [initialAddress]);

  // Search for places as user types
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        try {
          console.log('🔍 [LocationPicker] Searching for:', searchQuery, 'in country:', countryCode, countryName);
          const results = await searchPlaces(searchQuery, countryCode);
          console.log('✅ [LocationPicker] Search results received:', results);
          console.log('📊 [LocationPicker] Number of results:', results?.length);
          
          if (results && results.length > 0) {
            console.log('✅ [LocationPicker] Setting suggestions and showing dropdown');
            setSuggestions(results);
            setShowSuggestions(true);
            setError(''); // Clear any previous errors
          } else {
            console.log('❌ [LocationPicker] No results found for:', searchQuery);
            setSuggestions([]);
            setShowSuggestions(false);
            // Don't show error - instead, allow manual entry
            setError('');
          }
        } catch (error) {
          console.error('❌ [LocationPicker] Search error:', error);
          setSuggestions([]);
          setShowSuggestions(false);
          setError('');
        }
      } else {
        console.log('⏳ [LocationPicker] Query too short:', searchQuery.length, 'characters');
        setSuggestions([]);
        setShowSuggestions(false);
        setError(''); // Clear error when user deletes search
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, countryCode, countryName]);

  const handleGeocodeSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsGeocoding(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await geocodeAddress(searchQuery);
      
      if (result) {
        setPosition({ lat: result.lat, lng: result.lng });
        onChange({ lat: result.lat, lng: result.lng });
        
        // Use the user's typed address, not the geocoded one
        if (onAddressChange) {
          onAddressChange(searchQuery);
        }
        setAddress(searchQuery);
        setShowSuggestions(false);
        setSuccess('Location found!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Even if geocoding fails, allow the user to use the custom address
        // They just won't have precise coordinates
        setError('Could not find exact coordinates. You can still use this custom address, or click "Use Current Location" to set coordinates.');
        if (onAddressChange) {
          onAddressChange(searchQuery);
        }
        setAddress(searchQuery);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Allow custom address even on error
      setError('Could not geocode address. You can still use this custom location name.');
      if (onAddressChange) {
        onAddressChange(searchQuery);
      }
      setAddress(searchQuery);
      setShowSuggestions(false);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('📍 [LocationPicker] Requesting user location...');
      const coords = await getCurrentLocation();
      console.log('✅ [LocationPicker] Got coordinates:', coords);
      
      // Reverse geocode to get address
      const addressResult = await reverseGeocode(coords.lat, coords.lng);
      console.log('📍 [LocationPicker] Reverse geocoded address:', addressResult);
      
      if (addressResult) {
        setSearchQuery(addressResult);
        setPosition({ lat: coords.lat, lng: coords.lng });
        onChange({ lat: coords.lat, lng: coords.lng });
        setAddress(addressResult);
        if (onAddressChange) {
          onAddressChange(addressResult);
        }
        setSuccess('Location detected successfully!');
      } else {
        setError('Could not determine your address. Please search manually.');
      }
    } catch (error) {
      // More user-friendly error messages
      if (error.code === 1 || error.message?.includes('Permission denied')) {
        console.warn('⚠️ [LocationPicker] Location permission denied by user');
        setError('Location access blocked. Please enable location permissions in your browser settings, or search manually below.');
      } else if (error.code === 2) {
        console.warn('⚠️ [LocationPicker] Position unavailable');
        setError('Could not detect your location. Please check your device settings or search manually.');
      } else if (error.code === 3) {
        console.warn('⚠️ [LocationPicker] Location request timeout');
        setError('Location request timed out. Please try again or search manually.');
      } else {
        console.warn('⚠️ [LocationPicker] Location error:', error.message || error);
        setError('Could not get your location. Please search manually below.');
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    // Use the suggestion's coordinates
    setPosition({ lat: suggestion.lat, lng: suggestion.lng });
    onChange({ lat: suggestion.lat, lng: suggestion.lng });
    
    // Use the display name from suggestion
    setSearchQuery(suggestion.displayName);
    setAddress(suggestion.displayName);
    if (onAddressChange) {
      onAddressChange(suggestion.displayName);
    }
    
    setShowSuggestions(false);
    setError('');
    setSuccess('Location selected!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Don't do anything - user should either select a suggestion or enter coordinates manually
    }
  };

  const handleUseCustomLocation = async () => {
    // REMOVED - No more automatic geocoding guessing
  };

  const handleManualInput = () => {
    setShowManualInput(true);
  };

  const handleManualSubmit = () => {
    setError('');
    
    // Check if user entered anything
    if (!manualInput.trim()) {
      // Don't show toast error - just show inline message
      return;
    }
    
    // Check if user entered traditional coordinates (lat, lng format)
    if (manualInput.includes(',')) {
      const parts = manualInput.split(',').map(p => p.trim());
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        
        // Validate latitude and longitude ranges
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          setPosition({ lat, lng });
          onChange({ lat, lng });
          
          const addressName = searchQuery.trim() || `${lat}, ${lng}`;
          setAddress(addressName);
          if (onAddressChange) {
            onAddressChange(addressName);
          }
          
          setSuccess('Coordinates set successfully!');
          setTimeout(() => setSuccess(''), 3000);
          setShowManualInput(false);
          setManualInput('');
          setError(''); // Clear any errors
          return;
        } else if (!isNaN(lat) && !isNaN(lng)) {
          // Invalid range - show inline error only
          return;
        }
      }
    }
    
    // No valid input - don't show error, user will see validation on submit
  };

  return (
    <div className="space-y-4">
      {/* Country Filter Indicator */}
      {countryCode && countryName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-800">
              <strong>Searching in:</strong> {countryName}
            </p>
          </div>
        </div>
      )}

      {/* Address Search with Autocomplete */}
      <div className="relative">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Search Location {countryName && `in ${countryName}`} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowManualInput(false); // Hide manual input when user starts typing again
            }}
            onKeyPress={handleKeyPress}
            placeholder={
              countryName === 'Lebanon' 
                ? "Type: Smith Hall, AUB, Hamra, Beirut..." 
                : countryName === 'United States'
                ? "Type: Johnson Dorm, MIT, Cambridge, MA..."
                : "Type: Building name, street, city..."
            }
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
                setError('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700 px-3 py-1.5 flex items-center justify-between">
              <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Select a location below:
              </p>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion.displayName}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Suggestions - Show Manual Coordinate Entry */}
        {!showSuggestions && searchQuery.length >= 3 && !position && (
          <div className="mt-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3">
            <p className="text-xs text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span><strong>Location not found in {countryName}.</strong> Please enter coordinates manually below.</span>
            </p>
          </div>
        )}
      </div>

      {/* Current Location Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={isGettingLocation}
        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm cursor-pointer"
      >
        {isGettingLocation ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" />
            Use My Current Location
          </>
        )}
      </button>

      {/* Manual Input Button - Only show when location not found */}
      {!showSuggestions && searchQuery.length >= 3 && !position && (
        <button
          type="button"
          onClick={handleManualInput}
          className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm cursor-pointer"
        >
          <MapPin className="w-4 h-4" />
          Enter Coordinates Manually
        </button>
      )}

      {/* Manual Input Form */}
      {showManualInput && (
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3">
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
            <strong>Enter Coordinates:</strong>
          </p>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => {
              // Only allow numbers, decimal points, commas, spaces, and minus signs
              const value = e.target.value;
              if (/^[\d\s,.\-]*$/.test(value)) {
                setManualInput(value);
              }
            }}
            placeholder="e.g., 33.897953, 35.478428"
            className="w-full pl-3 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Format: latitude, longitude (numbers only)
          </p>
          <button
            type="button"
            onClick={handleManualSubmit}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-sm cursor-pointer mt-2"
          >
            Set Coordinates
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </p>
        </div>
      )}

      {/* Coordinate Display */}
      {position ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-900 mb-1">Selected Coordinates:</p>
              <p className="text-sm text-blue-800 font-mono">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </p>
              {address && (
                <p className="text-xs text-blue-700 mt-1">{address}</p>
              )}
            </div>
            <button
              onClick={() => {
                setPosition(null);
                onChange(null);
                setAddress('');
                setSearchQuery('');
                setShowManualInput(false);
                setManualInput('');
                setError('');
                setSuccess('');
                if (onAddressChange) {
                  onAddressChange('');
                }
              }}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              title="Remove location and search again"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-900 mb-1">No Location Selected</p>
              <p className="text-xs text-amber-700">Please search for an address or use your current location</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          <strong>How to set location:</strong>
        </p>
        <ul className="text-xs text-gray-600 mt-1 space-y-1 ml-4 list-disc">
          <li><strong>Option 1:</strong> Type location name → Select from suggestions</li>
          <li><strong>Option 2:</strong> Click "Use My Current Location" for GPS auto-detect</li>
          <li className="text-blue-600"><strong>Option 3:</strong> Enter coordinates manually from Google Maps</li>
        </ul>
        <div className="mt-2 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-700 font-semibold mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            How to get coordinates from Google Maps:
          </p>
          <ol className="text-xs text-gray-600 space-y-0.5 ml-4 list-decimal">
            <li>Open Google Maps and find your dorm location</li>
            <li>Right-click on the exact location</li>
            <li>Click the coordinates at the top (they'll be copied automatically)</li>
            <li>Paste them in the manual coordinate field (e.g., "33.897953, 35.478428")</li>
          </ol>
        </div>
      </div>
    </div>
  );
}