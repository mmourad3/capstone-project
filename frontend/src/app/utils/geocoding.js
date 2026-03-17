// Rate limiting
const PHOTON_BASE_URL = 'https://photon.komoot.io';
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 200; // 200ms between requests

const waitForRateLimit = () => {
  return new Promise(resolve => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      setTimeout(() => {
        lastRequestTime = Date.now();
        resolve();
      }, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    } else {
      lastRequestTime = now;
      resolve();
    }
  });
};

/**
 * Search for places/addresses with autocomplete suggestions
 * @param {string} query - Search query
 * @param {string} countryCode - Optional 2-letter country code to filter results (e.g., 'LB' for Lebanon)
 */
export const searchPlaces = async (query, countryCode = null) => {
  if (!query || query.length < 3) {
    return [];
  }

  await waitForRateLimit();
  try {
    // Build URL with country code filter if provided
    let url = `${PHOTON_BASE_URL}/api/?q=${encodeURIComponent(query)}&limit=20`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }

    let results = data.features.map(feature => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      // Build display name from available properties
      const nameParts = [
        props.name,
        props.street,
        props.city,
        props.state,
        props.country
      ].filter(Boolean);
      
      return {
        displayName: nameParts.join(', '),
        lat: coords[1],
        lng: coords[0],
        type: props.type || 'unknown',
        address: props,
        country: props.country,
        countryCode: props.countrycode?.toUpperCase()
      };
    });

    // STRICT country filtering - only show results from user's country
    if (countryCode) {
      results = results.filter(result => {
        return result.countryCode === countryCode.toUpperCase();
      });
    }

    return results.slice(0, 10); // Return top 10 results
  } catch (error) {
    console.error('[searchPlaces] Error:', error);
    throw error;
  }
};

/**
 * Get user's current location using browser geolocation
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        // Create a proper error object with code and message
        const geoError = new Error(getGeolocationErrorMessage(error.code));
        geoError.code = error.code;
        reject(geoError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Helper function to get error message based on geolocation error code
 */
const getGeolocationErrorMessage = (code) => {
  switch (code) {
    case 1:
      return 'Permission denied. Please allow location access in your browser settings.';
    case 2:
      return 'Position unavailable. Please check your device location settings.';
    case 3:
      return 'Request timeout. Please try again.';
    default:
      return 'An unknown error occurred while getting your location.';
  }
};

/**
 * Convert coordinates to address (reverse geocoding)
 */
export const reverseGeocode = async (lat, lng) => {
  await waitForRateLimit();
  try {
    const url = `${PHOTON_BASE_URL}/reverse?lon=${lng}&lat=${lat}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return null;
    }

    const props = data.features[0].properties;
    const nameParts = [
      props.name,
      props.street,
      props.city,
      props.state,
      props.country
    ].filter(Boolean);
    
    return nameParts.join(', ');
  } catch (error) {
    console.error('[reverseGeocode] Error:', error);
    return null;
  }
};

/**
 * Convert address to coordinates (forward geocoding)
 */
export const geocodeAddress = async (address) => {
  await waitForRateLimit();
  try {
    const url = `${PHOTON_BASE_URL}/api/?q=${encodeURIComponent(address)}&limit=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    
    const nameParts = [
      props.name,
      props.street,
      props.city,
      props.state,
      props.country
    ].filter(Boolean);
    
    return {
      lat: coords[1],
      lng: coords[0],
      displayName: nameParts.join(', ')
    };
  } catch (error) {
    console.error('[geocodeAddress] Error:', error);
    return null;
  }
};
