/**
 * Dorm Seeker Dashboard
 * Allows students to browse and filter available dorm listings
 * 
 * ROLE RESTRICTION: Only 'dorm_seeker' role users can access this dashboard.
 * Dorm_providers and carpool users are redirected to their respective dashboards.
 * Updated: Fixed imports to use correct file paths
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { DashboardNav } from "../components/DashboardNav";
import { DormSeekerFilters } from "../components/DormSeekerFilters";
import { DormSeekerCard } from "../components/DormSeekerCard";
import { DormSeekerDetailModal } from "../components/DormSeekerDetailModal";
import { useRoleProtection } from "../hooks/useRoleProtection";
import { useUserData } from "../hooks/useUserData";
import { calculateDistanceToUniversity } from "../utils/universityCoordinates";
import { DEMO_DORM_LISTINGS, initializeDormDemoData, DEMO_QUESTIONNAIRES } from "../data/demoData";
import { calculateCompatibility } from "../utils/comprehensiveCompatibilityCalculator";
import { contactDormProvider } from "../utils/whatsappUtils";
import { navigateToDashboard } from "../utils/navigationHelpers";
import { toggleFavorite, loadFavoritesFromStorage } from "../utils/favoritesHelpers";
import { matchesGenderPreference } from "../utils/genderFilterHelpers";

const mockListings = DEMO_DORM_LISTINGS;

export default function DormSeekerDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Role protection hook - blocks non-dorm_seeker users
  useRoleProtection('dorm_seeker');
  
  // Get user data from centralized hook
  const userData = useUserData();
  const { userName, userGender, userUniversity, userId, lifestyleAnswers } = userData;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [sortBy, setSortBy] = useState("compatibility");
  const [showFilters, setShowFilters] = useState(false);
  const [savedListings, setSavedListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [dormListings, setDormListings] = useState([]);
  
  // Handler functions for detail modal
  const handleWhatsApp = (phone, posterName, listing) => {
    const seekerName = localStorage.getItem('userName');
    const seekerUniversity = localStorage.getItem('userUniversity');
    contactDormProvider(listing, seekerName, seekerUniversity);
  };

  const handleViewProviderProfile = (providerId, listingId = null) => {
    // Get listing ID from parameter, or fallback to URL if not provided
    const finalListingId = listingId || searchParams.get('dorm');
    
    // Build URL with context
    let url = `/profile/${providerId}?from=dashboard`;
    if (finalListingId) {
      url += `&dormId=${finalListingId}`;
    }
    
    navigate(url);
  };
  
  const processListings = (listings) => {
    const currentUserId = userId || 'user-default';
    const currentUserQuestionnaire = lifestyleAnswers || null;
    
    return listings.map(listing => {
      const processed = { ...listing };
      
      // Only calculate compatibility if user has completed questionnaire
      if (currentUserQuestionnaire && Object.keys(currentUserQuestionnaire).length > 0) {
        const posterQuestionnaire = DEMO_QUESTIONNAIRES[listing.posterId];
        
        if (posterQuestionnaire) {
          const compatibility = calculateCompatibility(currentUserQuestionnaire, posterQuestionnaire);
          processed.compatibilityScore = compatibility.score;
          processed.matchReasons = compatibility.matchReasons;
          processed.potentialConflicts = compatibility.potentialConflicts;
          processed.reverseDealBreakerViolations = compatibility.reverseDealBreakerViolations;
        }
      }
      
      return processed;
    });
  };

  const loadListings = () => {
    const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
    const processedMock = processListings(mockListings);
    const processedPosted = processListings(postedDorms);
    // Only show ACTIVE listings (filter out inactive and "Found Roommate")
    const allListings = [...processedMock, ...processedPosted].filter(l => l.status === 'Active');
    
    // Calculate distance for each listing RIGHT HERE
    const listingsWithDistance = allListings.map(listing => {
      const hasCoordinates = listing.latitude !== undefined && listing.longitude !== undefined;
      
      const distanceKm = hasCoordinates 
        ? calculateDistanceToUniversity(
            { lat: listing.latitude, lng: listing.longitude }, 
            userUniversity
          )
        : null;
      
      return {
        ...listing,
        distanceKm
      };
    });
    
    setDormListings(listingsWithDistance);
    initializeDormDemoData(mockListings);
  };

  useEffect(() => {
    loadListings();
    const handleUpdate = () => loadListings();
    ['roommateAccepted', 'roommateEnded', 'storage'].forEach(event => 
      window.addEventListener(event, handleUpdate)
    );
    return () => ['roommateAccepted', 'roommateEnded', 'storage'].forEach(event => 
      window.removeEventListener(event, handleUpdate)
    );
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => !document.hidden && loadListings();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Filter listings based on gender, search, price, etc.
  const filteredListings = dormListings.filter(listing => {
    // AUTO-FILTER: Gender compatibility using helper function
    // Provider's genderPreference ("same" or "any") determines who can see the listing
    // If "same" → only show to seekers matching the provider's gender
    // If "any" → show to all seekers
    const seekerUser = { gender: userGender || 'Male' };
    const providerGenderPref = listing.genderPreference || 'any';
    const providerGender = listing.posterGender;
    
    // Check if listing accepts the user's gender
    const isGenderCompatible = matchesGenderPreference(seekerUser, providerGenderPref, providerGender);
    if (!isGenderCompatible) return false;

    // Additional user preference filter ("Same Gender Only" option)
    if (genderFilter === "same-only") {
      // Hide "any" preference listings, show only listings where provider chose "same"
      if (providerGenderPref !== 'same') return false;
    }
    // If "No Preference" is selected, show all listings that accept the user's gender (already filtered above)

    // Search query filter
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !listing.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !listing.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price filter
    if (priceRange) {
      if (priceRange === "0-500" && listing.price > 500) return false;
      if (priceRange === "500-750" && (listing.price < 500 || listing.price > 750)) return false;
      if (priceRange === "750+" && listing.price < 750) return false;
    }

    // Room type filter
    if (roomTypeFilter && listing.roomType !== roomTypeFilter) return false;

    // Distance filter
    if (distanceFilter && listing.distanceKm !== null) {
      const distance = listing.distanceKm;
      if (distanceFilter === "0-1" && distance > 1) return false;
      if (distanceFilter === "1-3" && (distance < 1 || distance > 3)) return false;
      if (distanceFilter === "3-5" && (distance < 3 || distance > 5)) return false;
      if (distanceFilter === "5-10" && (distance < 5 || distance > 10)) return false;
      if (distanceFilter === "10+" && distance < 10) return false;
    }

    // Amenities filter
    if (amenitiesFilter.length > 0) {
      const hasAllAmenities = amenitiesFilter.every(amenity => 
        listing.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "compatibility":
        return b.compatibilityScore - a.compatibilityScore;
      case "price-low":
        // Price is now stored as a number
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        // Price is now stored as a number
        return (b.price || 0) - (a.price || 0);
      case "distance":
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      case "newest":
        // Sort by datePosted (most recent first)
        const dateA = new Date(a.datePosted || 0).getTime();
        const dateB = new Date(b.datePosted || 0).getTime();
        return dateB - dateA;
      case "oldest":
        // Sort by datePosted (oldest first)
        const dateOldA = new Date(a.datePosted || 0).getTime();
        const dateOldB = new Date(b.datePosted || 0).getTime();
        return dateOldA - dateOldB;
      default:
        return b.compatibilityScore - a.compatibilityScore;
    }
  });

  const toggleSaved = (id) => {
    toggleFavorite(id, savedListings, setSavedListings, 'favoriteDorms');
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteDorms');
    if (storedFavorites) {
      setSavedListings(JSON.parse(storedFavorites));
    }

    // Listen for favorite updates from other components (like Profile page)
    const handleFavoritesUpdate = () => {
      const updatedFavorites = localStorage.getItem('favoriteDorms');
      if (updatedFavorites) {
        setSavedListings(JSON.parse(updatedFavorites));
      }
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const toggleAmenityFilter = (amenity) => {
    if (amenitiesFilter.includes(amenity)) {
      setAmenitiesFilter(amenitiesFilter.filter(a => a !== amenity));
    } else {
      setAmenitiesFilter([...amenitiesFilter, amenity]);
    }
  };

  // Open listing from URL parameter on page load
  useEffect(() => {
    const dormId = searchParams.get('dorm');
    if (dormId && dormListings.length > 0) {
      // URL has ?dorm=123 → Open modal
      const listing = dormListings.find(l => String(l.id) === String(dormId));
      if (listing) {
        setSelectedListing(listing);
      }
    } else if (!dormId) {
      // URL has NO ?dorm= → Close modal
      setSelectedListing(null);
    }
  }, [searchParams, dormListings]);

  // Function to open listing detail and update URL
  const handleOpenListing = (listing) => {
    setSelectedListing(listing);
    setSearchParams({ dorm: listing.id });
  };

  // Function to close listing detail and remove URL parameter
  const handleCloseListing = () => {
    setSelectedListing(null);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav userName={userName} userType="dorm_seeker" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Perfect Dorm
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Browse available dorms and connect with students
          </p>
        </div>

        {/* Search and Filter Bar */}
        <DormSeekerFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          roomTypeFilter={roomTypeFilter}
          setRoomTypeFilter={setRoomTypeFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          distanceFilter={distanceFilter}
          setDistanceFilter={setDistanceFilter}
          amenitiesFilter={amenitiesFilter}
          toggleAmenityFilter={toggleAmenityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {sortedListings.map((listing) => (
            <DormSeekerCard
              key={listing.id}
              listing={listing}
              userUniversity={userUniversity}
              isSaved={savedListings.includes(listing.id)}
              onToggleSave={toggleSaved}
              onViewDetails={(listing) => {
                handleOpenListing(listing);
              }}
              onViewProviderProfile={handleViewProviderProfile}
              onWhatsApp={(listing) => {
                handleWhatsApp(listing.whatsapp, listing.poster, listing);
              }}
            />
          ))}
        </div>

        {/* Saved Listings Section - REMOVED: Now available in Profile page */}
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <DormSeekerDetailModal
          selectedListing={selectedListing}
          setSelectedListing={setSelectedListing}
          savedListings={savedListings}
          toggleSaved={toggleSaved}
          handleWhatsApp={handleWhatsApp}
          handleViewProviderProfile={handleViewProviderProfile}
          handleCloseListing={handleCloseListing}
          userUniversity={userUniversity}
        />
      )}
    </div>
  );
}