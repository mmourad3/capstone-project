// University coordinates database for Lebanese universities
// Coordinates are approximate campus center locations

export const universityCoordinates = {
  // Lebanese Universities
  "Lebanese American University (LAU) - Beirut": {
    lat: 33.8959,
    lng: 35.4784,
    city: "Beirut"
  },
  "Lebanese American University (LAU) - Byblos": {
    lat: 34.1208,
    lng: 35.6511,
    city: "Byblos"
  },
  "American University of Beirut (AUB)": {
    lat: 33.8978,
    lng: 35.4814,
    city: "Beirut"
  },
  "Beirut Arab University (BAU)": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Lebanese University (LU) - Hadath": {
    lat: 33.8392,
    lng: 35.5437,
    city: "Hadath"
  },
  "Notre Dame University (NDU) - Louaize": {
    lat: 33.9897,
    lng: 35.5981,
    city: "Zouk Mosbeh"
  },
  "Holy Spirit University of Kaslik (USEK)": {
    lat: 33.9859,
    lng: 35.6142,
    city: "Jounieh"
  },
  "Lebanese International University (LIU) - Beirut": {
    lat: 33.8886,
    lng: 35.5034,
    city: "Beirut"
  },
  "Université Saint-Joseph (USJ)": {
    lat: 33.8731,
    lng: 35.5183,
    city: "Beirut"
  },
  "Haigazian University": {
    lat: 33.8847,
    lng: 35.5106,
    city: "Beirut"
  },
  "Arab Open University (AOU) - Lebanon": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Lebanese German University (LGU)": {
    lat: 33.8126,
    lng: 35.5889,
    city: "Jounieh"
  },
  "Antonine University (UA)": {
    lat: 33.9542,
    lng: 35.6125,
    city: "Baabda"
  },
  "Al Maaref University": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Jinan University": {
    lat: 33.5731,
    lng: 35.3708,
    city: "Tripoli"
  },
  "Islamic University of Lebanon": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Modern University for Business and Science (MUBS)": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Global University": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Rafik Hariri University (RHU)": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "University of Balamand": {
    lat: 34.2947,
    lng: 35.7986,
    city: "Koura"
  },
  "American University of Science and Technology (AUST)": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
  "Lebanese Academy of Fine Arts (ALBA)": {
    lat: 33.8886,
    lng: 35.5034,
    city: "Beirut"
  },
  "Arts, Sciences and Technology University (AUL)": {
    lat: 33.8547,
    lng: 35.5345,
    city: "Beirut"
  },
};

/**
 * Get coordinates for a university by name
 * @param {string} universityName - The name of the university
 * @returns {object|null} - {lat, lng, city} or null if not found
 */
export const getUniversityCoordinates = (universityName) => {
  return universityCoordinates[universityName] || null;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate distance from a location to a university
 * @param {object} location - {lat, lng} of the location
 * @param {string} universityName - Name of the university
 * @returns {number|null} - Distance in km or null if university not found
 */
export const calculateDistanceToUniversity = (location, universityName) => {
  const uniCoords = getUniversityCoordinates(universityName);
  
  if (!uniCoords || !location || !location.lat || !location.lng) {
    return null;
  }
  
  return calculateDistance(location.lat, location.lng, uniCoords.lat, uniCoords.lng);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return 'N/A';
  }
  
  // Always show in km format, even for distances less than 1km
  return `${distance.toFixed(1)}km`;
};

/**
 * Calculate distances from a location to all universities
 * Returns sorted array of universities with distances
 * @param {object} location - {lat, lng}
 * @returns {array} - Array of {universityName, distance, city} sorted by distance
 */
export const getNearbyUniversities = (location) => {
  if (!location || !location.lat || !location.lng) {
    return [];
  }
  
  const distances = Object.entries(universityCoordinates)
    .filter(([name]) => name !== "Other") // Exclude the fallback entry
    .map(([universityName, coords]) => ({
      universityName,
      city: coords.city,
      distance: calculateDistance(location.lat, location.lng, coords.lat, coords.lng)
    }))
    .sort((a, b) => a.distance - b.distance);
  
  return distances;
};

/**
 * Get the top N nearest universities to a location
 * @param {object} location - {lat, lng}
 * @param {number} count - Number of universities to return (default: 5)
 * @returns {array} - Array of nearest universities with distances
 */
export const getTopNearestUniversities = (location, count = 5) => {
  const nearby = getNearbyUniversities(location);
  return nearby.slice(0, count);
};