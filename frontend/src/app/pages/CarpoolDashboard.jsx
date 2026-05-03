import React, { useState, useEffect } from "react";
import { Plus, Car } from "lucide-react";
import { DashboardNav } from "../components/DashboardNav";
import { EmptyState } from "../components/EmptyState";
import { CreateCarpoolForm } from "../components/CreateCarpoolForm";
import { CarpoolCard } from "../components/CarpoolCard";
import { CarpoolFilters } from "../components/CarpoolFilters";
import { CarpoolTips } from "../components/CarpoolTips";
import { useRoleProtection } from "../hooks/useRoleProtection";
import { toast } from "react-toastify";
import { LEBANESE_REGIONS } from "../config/appConfig";
import { contactCarpoolDriver } from "../utils/whatsappUtils";
import {
  isCarpoolScheduleCompatible,
  getDayAbbreviation,
} from "../utils/carpoolHelpers";
import { carpoolAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";


export default function CarpoolDashboard() {
  // Role protection hook - blocks non-carpool users
  useRoleProtection('carpool');
  
  const { user } = useAuth();

  const userId = user?.id || "";
  const userName =
    user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const userUniversity = user?.university || "";
  const userRegion = user?.region || "";
  const userGender = user?.gender || "";
  const userRole = user?.role || "";
  const userClassSchedule = user?.classSchedule || [];
  
  const [activeTab, setActiveTab] = useState("find");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [timeSort, setTimeSort] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedDaysFilter, setSelectedDaysFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState("both"); // 'both' or 'same'
  const [joinedRides, setJoinedRides] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    pickupSpot: "",
    date: "",
    time: "",
    returnTime: "",
    seats: "",
    totalSeats: "", // Track total seats available
    price: "",
    carModel: "",
    genderPreference: "both", // Gender preference for passengers
    selectedScheduleBlock: null // Track which schedule block to use for this listing (single selection)
  });
  
  const [allCarpools, setAllCarpools] = useState([]);
  const [myCarpools, setMyCarpools] = useState([]);

  useEffect(() => {
    if (!user) return;

    loadCarpools();

    const handleCarpoolUpdate = () => {
      loadCarpools();
    };

    window.addEventListener("joinedCarpoolsUpdated", handleCarpoolUpdate);

    const pollingInterval = setInterval(() => {
      loadCarpools();
    }, 5000);

    return () => {
      window.removeEventListener("joinedCarpoolsUpdated", handleCarpoolUpdate);
      clearInterval(pollingInterval);
    };
  }, [user]);

 
  const loadCarpools = async () => {
    try {
      const [all, mine, joinedIds] = await Promise.all([
        carpoolAPI.getAll(),
        carpoolAPI.getMyListings(),
        carpoolAPI.getJoinedIds(),
      ]);

      setAllCarpools(all);
      setMyCarpools(mine);
      setJoinedRides(joinedIds);
    } catch (error) {
      toast.error(error.message || "Failed to load carpools");
    }
  };
  const handleJoinRide = async (ride) => {
  if (userRole !== "carpool") {
    toast.error("Only users with carpool role can join carpools.");
    return;
  }

  if (joinedRides.includes(ride.id)) {
    toast.info("You've already joined this ride!");
    return;
  }

  if (!isCarpoolScheduleCompatible(ride, userClassSchedule)) {
    toast.error(
      "This carpool's schedule doesn't match your class times. The driver must depart before your class starts and return after your class ends.",
    );
    return;
  }

  if (ride.status === "Full") {
    toast.error("This carpool is full.");
    return;
  }

  try {
    await carpoolAPI.join(ride.id);

    await loadCarpools();

    window.dispatchEvent(new Event("joinedCarpoolsUpdated"));

    toast.success(`Successfully joined ${ride.driverName}'s carpool`);
  } catch (error) {
    toast.error(error.message || "Failed to join carpool");
  }};


  const handleLeaveRide = async (ride) => {
    try {
      await carpoolAPI.leave(ride.id);

      await loadCarpools();

      window.dispatchEvent(new Event("joinedCarpoolsUpdated"));

      toast.success(`You've left ${ride.driverName}'s carpool`);
    } catch (error) {
      toast.error(error.message || "Failed to leave carpool");
    }
  };

  // Check if user has joined a specific ride
  const hasJoinedRide = (rideId) => {
    return joinedRides.includes(rideId);
  };

const handleRemovePassenger = async (carpoolId, passengerId) => {
  const currentCarpool = myCarpools.find((carpool) => carpool.id === carpoolId);
  const passenger = currentCarpool?.passengers?.find(
    (p) => p.id === passengerId,
  );

  try {
    await carpoolAPI.removePassenger(carpoolId, passengerId);

    await loadCarpools();

    window.dispatchEvent(new Event("joinedCarpoolsUpdated"));

    toast.success(
      `${passenger?.name || "Passenger"} has been removed from the carpool`,
    );
  } catch (error) {
    toast.error(error.message || "Failed to remove passenger");
  }
};

  // Filter available rides - SIMPLIFIED (like dorm seeker dashboard)
  const getAvailableRides = () => {
    let filteredRides = allCarpools.filter(carpool => {
      // Exclude user's own listings (use driverId, not email)
      if (carpool.driverId === userId) {
        return false;
      }
      
      // Hide full carpools unless user has already joined
      const userHasJoined = joinedRides.includes(carpool.id);
      if (carpool.status === "Full" && !userHasJoined) {
        return false;
      }
      
      // Only show rides from same university
      if (carpool.university !== userUniversity) {
        return false;
      }
      
      // Only show rides from user's region
      if (carpool.region !== userRegion) {
        return false;
      }
      
      // SCHEDULE-BASED FILTERING: ALL carpool days must match passenger's schedule
      if (!isCarpoolScheduleCompatible(carpool, userClassSchedule)) {
        return false;
      }
      
      // Apply start date filter (show rides on or after this date)
      if (startDateFilter && carpool.date < startDateFilter) {
        return false;
      }

      // Apply selected days filter (filter by driver's schedule days)
      if (selectedDaysFilter.length > 0 && carpool.driverSchedule && carpool.driverSchedule.length > 0) {
        const driverDays = carpool.driverSchedule.flatMap(block => block.days || []);
        const hasAllSelectedDays = selectedDaysFilter.every(selectedDay => driverDays.includes(selectedDay));
        
        if (!hasAllSelectedDays) {
          return false;
        }
      }

      // Apply gender filter (filter by carpool's gender preference setting)
      if (genderFilter === 'same') {
        // User wants to see only "same gender" carpools
        if (carpool.genderPreference !== 'same') {
          return false;
        }
      }
      // If genderFilter === 'both', show all carpools (no filtering)
      
      // Apply carpool's gender preference setting (driver's requirement)
      if (carpool.genderPreference === 'same' && userGender && carpool.driverGender) {
        // If driver wants same gender only, check if passenger matches
        if (carpool.driverGender.toLowerCase() !== userGender.toLowerCase()) {
          return false;
        }
      }
      return true;
    });

    // Apply time sorting (Earliest to Latest or Latest to Earliest)
    if (timeSort === 'earliest-to-latest') {
      filteredRides.sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
    } else if (timeSort === 'latest-to-earliest') {
      filteredRides.sort((a, b) => {
        return b.time.localeCompare(a.time);
      });
    }

    // Apply price sorting (prices are stored as numbers)
    if (priceFilter === 'low-to-high') {
      filteredRides.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'high-to-low') {
      filteredRides.sort((a, b) => b.price - a.price);
    }

    return filteredRides;
  };

  const availableRides = getAvailableRides();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that user has a region set
    if (!userRegion) {
      toast.error("You must have a region selected. Please update your profile.");
      return;
    }

    // Validate that a schedule block is selected
    if (formData.selectedScheduleBlock === null) {
      toast.error("Please select a schedule block for this carpool listing.");
      return;
    }

    // Get the selected schedule block
    const selectedBlock = userClassSchedule[formData.selectedScheduleBlock];

    try {
      // Create new carpool
      const newCarpool = {
        pickupSpot: formData.pickupSpot,
        destination: userUniversity,
        date: formData.date,
        time: formData.time,
        returnTime: formData.returnTime,
        totalSeats: parseInt(formData.seats),
        price: formData.price,
        carModel: formData.carModel,
        genderPreference: formData.genderPreference || "both",
        driverSchedule: [selectedBlock],
      };
      
      await carpoolAPI.create(newCarpool);
      toast.success("Carpool listing created successfully!");
      
      // Reload carpools
      await loadCarpools();
      
      setShowCreateForm(false);
      setActiveTab("my-carpools");
      setFormData({
        pickupSpot: "",
        date: "",
        time: "",
        returnTime: "",
        seats: "",
        totalSeats: "",
        price: "",
        carModel: "",
        genderPreference: "both",
        selectedScheduleBlock: null
      });
    } catch (error) {
      console.error('Submit carpool error:', error);
      toast.error(error.message || 'Failed to save carpool');
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this carpool listing? This action cannot be undone."
    );
    
    if (!confirmed) {
      return; // User cancelled the deletion
    }
    
    try {
      await carpoolAPI.delete(id);
      await loadCarpools();
      toast.success("Carpool listing deleted successfully!");
    } catch (error) {
      console.error('Delete carpool error:', error);
      toast.error(error.message || 'Failed to delete carpool');
    }
  };

  const checkAllScheduleBlocksInUse = () => {
    if (!userClassSchedule || userClassSchedule.length === 0) return false;

    if (myCarpools.length === 0) return false;

    return userClassSchedule.every((block) => {
      return myCarpools.some((carpool) => {
        if (!carpool.driverSchedule || carpool.driverSchedule.length === 0) {
          return false;
        }

        const existingBlock = carpool.driverSchedule[0];

        return (
          existingBlock.courseName === block.courseName &&
          existingBlock.startTime === block.startTime &&
          existingBlock.endTime === block.endTime &&
          JSON.stringify(existingBlock.days) === JSON.stringify(block.days)
        );
      });
    });
  };

  // Handle opening create form with validation
  const handleOpenCreateForm = () => {
    // Check if user has class schedule
    if (!userClassSchedule || userClassSchedule.length === 0) {
      toast.error("You need to set up your class schedule first. Please update your profile.");
      return;
    }
    
    // Check if all schedule blocks are in use
    if (checkAllScheduleBlocksInUse()) {
      toast.error("All your schedule blocks already have active listings. Delete an existing listing to create a new one.");
      return;
    }
    
    // Open the form
    setShowCreateForm(true);
  };

  // Get locations within user's region
  const getRegionLocations = () => {
    if (!userRegion) return [];
    
    // Find the region of the user's selected location
    const userLocation = LEBANESE_REGIONS.find(loc => loc.name === userRegion);
    if (!userLocation) return [];
    
    // Return all locations in the same region
    return LEBANESE_REGIONS.filter(loc => loc.region === userLocation.region);
  };

  const regionLocations = getRegionLocations();

  

  // Toggle day selection for schedule filter
  const toggleDayFilter = (day) => {
    if (selectedDaysFilter.includes(day)) {
      setSelectedDaysFilter(selectedDaysFilter.filter(d => d !== day));
    } else {
      setSelectedDaysFilter([...selectedDaysFilter, day]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DashboardNav userName={userName} userType="carpool" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Carpool Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Find rides from{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {userRegion}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {userUniversity}
              </span>
            </p>
          </div>
          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 w-full sm:w-auto justify-center text-sm sm:text-base cursor-pointer"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Ride Listing
          </button>
        </div>

        {/* Region Info Alert */}
        {!userRegion && (
          <div className="bg-yellow-50 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-300 text-sm">
             You need to set your region to create or view carpool listings.
              Please contact support to update your region.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-6">
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("find")}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors text-sm sm:text-base cursor-pointer ${
                activeTab === "find"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Find a Ride ({availableRides.length})
            </button>
            <button
              onClick={() => setActiveTab("my-carpools")}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors text-sm sm:text-base cursor-pointer ${
                activeTab === "my-carpools"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              My Listings ({myCarpools.length})
            </button>
          </div>
        </div>

        {/* Create Carpool Form Modal */}
        {showCreateForm && (
          <CreateCarpoolForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowCreateForm(false);
              setFormData({
                pickupSpot: "",
                date: "",
                time: "",
                returnTime: "",
                seats: "",
                totalSeats: "",
                price: "",
                carModel: "",
                genderPreference: "both",
                selectedScheduleBlock: null,
              });
            }}
            userRegion={userRegion}
            userUniversity={userUniversity}
            userClassSchedule={userClassSchedule}
            regionLocations={regionLocations}
            myCarpools={myCarpools}
          />
        )}

        {/* Find a Ride Tab Content */}
        {activeTab === "find" && (
          <div className="space-y-4">
            <CarpoolFilters
              startDateFilter={startDateFilter}
              setStartDateFilter={setStartDateFilter}
              timeSort={timeSort}
              setTimeSort={setTimeSort}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              selectedDaysFilter={selectedDaysFilter}
              toggleDayFilter={toggleDayFilter}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Available Rides ({availableRides.length})
            </h2>

            {availableRides.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No rides available from your region"
                description={`No rides found from ${userRegion} to ${userUniversity}`}
              />
            ) : (
              availableRides.map((ride) => (
                <CarpoolCard
                  key={ride.id}
                  carpool={ride}
                  type="browse"
                  hasJoined={hasJoinedRide(ride.id)}
                  onJoin={handleJoinRide}
                  onLeave={handleLeaveRide}
                  onContact={() => contactCarpoolDriver(ride, userUniversity)}
                  isJoinDisabled={ride.status === "Full"}
                  joinButtonText={ride.status === "Full" ? "Full" : "Join Ride"}
                />
              ))
            )}

            <CarpoolTips type="rider" />
          </div>
        )}

        {/* My Listings Tab Content */}
        {activeTab === "my-carpools" && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Ride Listings ({myCarpools.length})
            </h2>

            {myCarpools.length === 0 ? (
              <EmptyState
                icon={Car}
                title="You haven't created any ride listings yet."
                actionButton={
                  <button
                    onClick={handleOpenCreateForm}
                    className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base cursor-pointer"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Create Your First Listing
                  </button>
                }
              />
            ) : (
              <>
                {myCarpools.map((carpool) => (
                  <CarpoolCard
                    key={carpool.id}
                    carpool={carpool}
                    type="my-listing"
                    onDelete={handleDelete}
                    onRemovePassenger={handleRemovePassenger}
                  />
                ))}

                <CarpoolTips type="driver" />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
