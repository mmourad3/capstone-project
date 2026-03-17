// Utility functions for dorm listings
import { calculateDistanceToUniversity } from "./universityCoordinates";

// Mock listings data - shared across the app
export const baseMockListings = [
  {
    id: 1,
    title: "Spacious Single Room Near AUB",
    location: "Hamra Street, Ras Beirut",
    latitude: 33.8978,
    longitude: 35.4814,
    price: 650,
    roomType: "Single Room",
    gender: "Any",
    description: "Modern single room in shared apartment. Fully furnished with WiFi, utilities included. Walking distance to AUB campus and local cafes.",
    amenities: ['wifi', 'ac', 'furnished', 'desk', 'utilities', 'kitchen', 'laundry'],
    images: [
      "https://images.unsplash.com/photo-1767800766055-1cdbd2e351b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYmVkcm9vbSUyMGZ1cm5pc2hlZHxlbnwxfHx8fDE3NzIzMjM2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1564273795917-fe399b763988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwZG9ybSUyMHJvb20lMjBiZWQlMjBkZXNrfGVufDF8fHx8MTc3MjMyMzYxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    image: "https://images.unsplash.com/photo-1767800766055-1cdbd2e351b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYmVkcm9vbSUyMGZ1cm5pc2hlZHxlbnwxfHx8fDE3NzIzMjM2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "Active",
    posterId: "user-sarah-001",
    posterEmail: "sarah.johnson@aub.edu.lb",
    posterName: "Sarah Johnson",
    posterPhone: "+9611234567",
    whatsapp: "9611234567",
    poster: "Sarah Johnson",
    posterGender: "Female",
    posterProfilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    country: "Lebanon",
    countryCode: "LB",
    compatibilityScore: 92,
    matchReasons: [
      "Both are early birds (wake 6:00, sleep 22:00) - perfect sleep schedule alignment",
      "Exact cleanliness match - no conflicts about tidiness",
      "Both prefer quiet study environments with no music"
    ],
    potentialConflicts: []
  },
  {
    id: 2,
    title: "Cozy Bedroom in Achrafieh",
    location: "Sassine Square, Achrafieh",
    latitude: 33.8900,
    longitude: 35.5200,
    price: 550,
    roomType: "Single Room",
    gender: "Female",
    description: "Bright and cozy room with private bathroom. Safe neighborhood with easy access to public transport. Perfect for serious students.",
    amenities: ['wifi', 'bathroom', 'furnished', 'desk', 'heating', 'parking'],
    images: [
      "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjMyMzYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1692455067486-d4637182a61c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwd2luZG93JTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc3MjMyMzYxNHww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    image: "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjMyMzYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "Active",
    posterId: "user-emily-002",
    posterEmail: "emily.chen@lau.edu.lb",
    posterName: "Emily Chen",
    posterPhone: "+9611234568",
    whatsapp: "9611234568",
    poster: "Emily Chen",
    posterGender: "Female",
    posterProfilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    country: "Lebanon",
    countryCode: "LB",
    compatibilityScore: 78,
    matchReasons: [
      "Both early birds - wake times align well",
      "Similar cleanliness standards"
    ],
    potentialConflicts: [
      "Different temperature preferences - they prefer cool (AC on), you prefer warm",
      "Guest frequency differs - they have guests rarely, you prefer occasionally"
    ]
  },
  {
    id: 3,
    title: "Modern Room with Study Area",
    location: "Verdun, Beirut",
    latitude: 33.8700,
    longitude: 35.4900,
    price: 750,
    roomType: "Single Room",
    gender: "Male",
    description: "Spacious single room with dedicated study area and private bathroom. Close to shops and restaurants. Great for students who value privacy and comfort. Modern building with elevator and 24/7 security.",
    amenities: ['wifi', 'ac', 'bathroom', 'furnished', 'desk', 'utilities'],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1080"
    ],
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    status: "Active",
    posterId: "user-michael-003",
    posterEmail: "michael.brown@usj.edu.lb",
    posterName: "Michael Brown",
    posterPhone: "+9611234569",
    whatsapp: "9611234569",
    poster: "Michael Brown",
    posterGender: "Male",
    posterProfilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    country: "Lebanon",
    countryCode: "LB",
    compatibilityScore: 65,
    matchReasons: [
      "Similar study habits - both prefer evening study time"
    ],
    potentialConflicts: [
      "⚠️ Sleep schedule mismatch - they wake at 6:00, you wake at 9:00 (3 hour difference)",
      "Different social levels - they're introverted, you're extroverted"
    ]
  },
  {
    id: 4,
    title: "Affordable Shared Room in Mar Mikhael",
    location: "Mar Mikhael, Beirut",
    latitude: 33.8950,
    longitude: 35.5150,
    price: 400,
    roomType: "Shared Room",
    gender: "Any",
    description: "Budget-friendly shared room in vibrant Mar Mikhael area. Great for students who enjoy a lively neighborhood with plenty of cafes and art galleries nearby. Utilities included.",
    amenities: ['wifi', 'kitchen', 'laundry', 'furnished'],
    images: [
      "https://images.unsplash.com/photo-1610513492097-13a9a4c343c6?w=1080"
    ],
    image: "https://images.unsplash.com/photo-1610513492097-13a9a4c343c6?w=1080",
    status: "Active",
    posterId: "user-lara-004",
    posterEmail: "lara.hassan@lau.edu.lb",
    posterName: "Lara Hassan",
    posterPhone: "+9611234570",
    whatsapp: "9611234570",
    poster: "Lara Hassan",
    posterGender: "Female",
    posterProfilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    country: "Lebanon",
    countryCode: "LB",
    compatibilityScore: 85,
    matchReasons: [
      "Matching study schedules - both study late evening",
      "Similar organization level - moderately organized"
    ],
    potentialConflicts: []
  }
];

/**
 * Get all listings (mock + posted) with distance calculation
 * @param {string} userUniversity - User's university name
 * @returns {Array} Array of all listings with calculated distances
 */
export function getAllListings(userUniversity) {
  const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
  
  // Calculate distance for mock listings
  const mockWithDistance = baseMockListings.map(listing => {
    const distanceKm = listing.latitude && listing.longitude
      ? calculateDistanceToUniversity({ lat: listing.latitude, lng: listing.longitude }, userUniversity)
      : null;
    
    return {
      ...listing,
      distanceKm
    };
  });
  
  // Calculate distance for posted listings
  const postedWithDistance = postedDorms.map(listing => {
    const distanceKm = listing.latitude && listing.longitude
      ? calculateDistanceToUniversity({ lat: listing.latitude, lng: listing.longitude }, userUniversity)
      : null;
    
    return {
      ...listing,
      distanceKm
    };
  });
  
  return [...mockWithDistance, ...postedWithDistance];
}

/**
 * Get favorited listings
 * @param {string} userUniversity - User's university name
 * @returns {Array} Array of favorited listings, sorted by most recently favorited first
 */
export function getFavoritedListings(userUniversity) {
  const favoriteDorms = JSON.parse(localStorage.getItem('favoriteDorms') || '[]');
  const allListings = getAllListings(userUniversity);
  
  // Filter to get only favorited listings
  const favorited = allListings.filter(listing => favoriteDorms.includes(listing.id));
  
  // Sort by the order they appear in favoriteDorms array (most recent last)
  // Then reverse to show most recent first
  favorited.sort((a, b) => {
    const indexA = favoriteDorms.indexOf(a.id);
    const indexB = favoriteDorms.indexOf(b.id);
    return indexB - indexA; // Reverse order - most recent first
  });
  
  return favorited;
}

/**
 * Toggle favorite status for a listing
 * @param {string} listingId - The listing ID to toggle
 * @returns {Array} Updated array of favorite IDs
 */
export function toggleFavorite(listingId) {
  const favoriteDorms = JSON.parse(localStorage.getItem('favoriteDorms') || '[]');
  let updatedFavorites;
  
  if (favoriteDorms.includes(listingId)) {
    updatedFavorites = favoriteDorms.filter(id => id !== listingId);
  } else {
    updatedFavorites = [...favoriteDorms, listingId];
  }
  
  localStorage.setItem('favoriteDorms', JSON.stringify(updatedFavorites));
  window.dispatchEvent(new Event('favoritesUpdated'));
  
  return updatedFavorites;
}