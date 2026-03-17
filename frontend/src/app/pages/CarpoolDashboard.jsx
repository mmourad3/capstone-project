import React, { useState, useEffect } from "react";
import { Plus, Car } from "lucide-react";
import { DashboardNav } from "../components/DashboardNav";
import { EmptyState } from "../components/EmptyState";
import { CreateCarpoolForm } from "../components/CreateCarpoolForm";
import { CarpoolCard } from "../components/CarpoolCard";
import { CarpoolFilters } from "../components/CarpoolFilters";
import { CarpoolTips } from "../components/CarpoolTips";
import { useRoleProtection } from "../hooks/useRoleProtection";
import { useUserData } from "../hooks/useUserData";
import { toast } from "react-toastify";
import { LEBANESE_REGIONS } from "../config/appConfig";
import { 
  checkDayConflictForJoining, 
  checkDayConflictForCreating, 
  isCarpoolScheduleCompatible,
  findScheduleBlockIndex,
  getDayAbbreviation
} from "../utils/carpoolHelpers";
import { contactCarpoolDriver } from "../utils/whatsappUtils";
import carpoolService from "../services/carpoolService";
import { generateDemoCarpools, DEMO_USERS } from "../data/demoData";
import { filterCarpoolUsersByGender } from "../utils/genderFilterHelpers";

/**
 * CARPOOL DASHBOARD - UNIFIED STORAGE
 * Uses carpoolService for both localStorage and backend API
 */

export default function CarpoolDashboard() {
  // Role protection hook - blocks non-carpool users
  useRoleProtection('carpool');
  
  // Get user data from centralized hook
  const userData = useUserData();
  const {
    userId,
    userName,
    userEmail,
    userUniversity,
    carpoolRegion: userRegion,
    userPhone,
    userCountryCode,
    classSchedule: userClassSchedule,
    userProfilePicture,
    userGender,
    userRole
  } = userData;
  
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
  
  // Load carpools from localStorage
  const [allCarpools, setAllCarpools] = useState([]);
  const [myCarpools, setMyCarpools] = useState([]);

  useEffect(() => {
    loadCarpools();
    loadJoinedRides();
    
    // Listen for carpool updates from Profile page
    const handleCarpoolUpdate = () => {
      loadCarpools();
      loadJoinedRides();
    };
    
    window.addEventListener('joinedCarpoolsUpdated', handleCarpoolUpdate);
    
    // Set up polling for real-time updates (every 5 seconds)
    const pollingInterval = setInterval(() => {
      loadCarpools();
    }, 5000);
    
    return () => {
      window.removeEventListener('joinedCarpoolsUpdated', handleCarpoolUpdate);
      clearInterval(pollingInterval);
    };
  }, []);

  // ⚠️ DISABLED FOR DEMO - RE-ENABLE WHEN ADDING BACKEND
  // This cleanup logic is needed when backend properly cascades deletes
  // (when driver deletes carpool → backend removes it from all passengers' joinedCarpools arrays)
  /*
  useEffect(() => {
    if (allCarpools.length > 0) {
      const storedJoinedRides = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
      
      // Check if any joined carpools no longer exist
      const allCarpoolIds = allCarpools.map(c => c.id);
      const validJoinedRides = storedJoinedRides.filter(carpoolId => allCarpoolIds.includes(carpoolId));
      
      // If we found invalid IDs, clean them up (silently - no toast notification here)
      if (validJoinedRides.length !== storedJoinedRides.length) {
        localStorage.setItem('joinedCarpools', JSON.stringify(validJoinedRides));
        setJoinedRides(validJoinedRides);
      }
    }
  }, [allCarpools]);
  */

  const loadCarpools = () => {
    let storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    
    // Generate demo carpools if none exist
    if (storedCarpools.length === 0) {
      const demoCarpools = generateDemoCarpools(userRegion, userUniversity);
      localStorage.setItem('carpoolListings', JSON.stringify(demoCarpools));
      storedCarpools = demoCarpools;
    }
    
    // UPDATE PROFILE PICTURES FROM LOCALSTORAGE FOR CURRENT USER'S CARPOOLS
    storedCarpools = storedCarpools.map(carpool => {
      if (carpool.driverId === userId) {
        // Get profile picture from localStorage (try both keys)
        const profilePic = localStorage.getItem('userProfilePicture') || localStorage.getItem('profilePicture') || '';
        return {
          ...carpool,
          driverProfilePicture: profilePic
        };
      }
      return carpool;
    });
    
    // Save updated carpools back
    localStorage.setItem('carpoolListings', JSON.stringify(storedCarpools));
    
    setAllCarpools(storedCarpools);
    const userCarpools = storedCarpools.filter(
      carpool => carpool.driverId === userId && carpool.status !== "Deleted"
    );
    setMyCarpools(userCarpools);
  };

  const loadJoinedRides = () => {
    const storedJoinedRides = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
    
    // ⚠️ DISABLED FOR DEMO - RE-ENABLE WHEN ADDING BACKEND
    // With backend: When driver deletes carpool → backend removes carpool ID from all passengers' joinedCarpools arrays
    // This localStorage validation is unnecessary with proper backend cascade deletes
    /*
    const allCarpoolIds = allCarpools.map(c => c.id);
    const validJoinedRides = storedJoinedRides.filter(carpoolId => allCarpoolIds.includes(carpoolId));
    
    if (validJoinedRides.length !== storedJoinedRides.length) {
      localStorage.setItem('joinedCarpools', JSON.stringify(validJoinedRides));
      const removedCount = storedJoinedRides.length - validJoinedRides.length;
      if (removedCount > 0) {
        toast.info(`${removedCount} carpool${removedCount > 1 ? 's' : ''} you joined ${removedCount > 1 ? 'have' : 'has'} been deleted by the driver.`);
      }
    }
    setJoinedRides(validJoinedRides);
    */
    
    setJoinedRides(storedJoinedRides);
  };

  // Handle joining a ride
  const handleJoinRide = async (ride) => {
    // Check user role - only carpool users can join carpools
    if (userRole !== 'carpool') {
      toast.error('Only users with carpool role can join carpools. Please update your role in settings.');
      return;
    }
    
    // Check if already joined this ride
    if (joinedRides.includes(ride.id)) {
      toast.info("You've already joined this ride!");
      return;
    }

    // CHECK: Day conflict validation (blocks if user has active listing OR joined carpool with same days)
    const newCarpoolDays = ride.driverSchedule?.[0]?.days || [];
    const dayConflict = checkDayConflictForJoining(newCarpoolDays, userId, userEmail);
    
    if (dayConflict.hasConflict) {
      const dayNames = dayConflict.conflictingDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
      
      if (dayConflict.conflictType === 'created-listing') {
        toast.error(`You have an active listing on ${dayNames}. Can't join carpools with overlapping days.`);
      } else {
        toast.error(`You've already joined a carpool on ${dayNames}. Can't join carpools with overlapping days.`);
      }
      return;
    }

    // Verify that ALL carpool days have compatible times with passenger's schedule
    if (!isCarpoolScheduleCompatible(ride, userClassSchedule)) {
      toast.error("This carpool's schedule doesn't match your class times. The driver must depart before your class starts and return after your class ends.");
      return;
    }

    // Check if seats are available (carpool is full when seats >= totalSeats)
    if (ride.seats >= (ride.totalSeats || 4)) {
      toast.error("This carpool is full.");
      return;
    }

    // Join carpool using carpoolService
    try {
      await carpoolService.joinCarpool(ride.id, {
        id: userId,
        name: userName,
        email: userEmail,
        phone: userPhone,
        countryCode: userCountryCode,
        gender: userGender,
        profilePicture: userProfilePicture
      });
      
      // Update joined rides
      const storedJoinedRides = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
      if (!storedJoinedRides.includes(ride.id)) {
        storedJoinedRides.push(ride.id);
        localStorage.setItem('joinedCarpools', JSON.stringify(storedJoinedRides));
      }
      
      // Update state directly instead of calling loadJoinedRides()
      setJoinedRides(storedJoinedRides);
      
      // Reload carpools to get updated data
      loadCarpools();
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('joinedCarpoolsUpdated'));
      
      toast.success(`Successfully joined ${ride.driverName}'s carpool`);
    } catch (error) {
      console.error('Join carpool error:', error);
      toast.error(error.message || 'Failed to join carpool');
    }
  };

  // Handle leaving a ride
  const handleLeaveRide = async (ride) => {
    try {
      await carpoolService.leaveCarpool(ride.id, userId);
      
      // Update joined rides
      const storedJoinedRides = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
      const updatedJoinedRides = storedJoinedRides.filter(id => id !== ride.id);
      localStorage.setItem('joinedCarpools', JSON.stringify(updatedJoinedRides));
      
      // Update state directly instead of calling loadJoinedRides()
      setJoinedRides(updatedJoinedRides);
      
      // Reload carpools to get updated data
      loadCarpools();
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('joinedCarpoolsUpdated'));
      
      toast.success(`You've left ${ride.driverName}'s carpool`);
    } catch (error) {
      console.error('Leave carpool error:', error);
      toast.error(error.message || 'Failed to leave carpool');
    }
  };

  // Check if user has joined a specific ride
  const hasJoinedRide = (rideId) => {
    return joinedRides.includes(rideId);
  };

  // Add demo passenger for testing (only for driver's own carpools)
  const handleAddDemoPassenger = (carpoolId) => {
    const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    let currentCarpool = storedCarpools.find(c => c.id === carpoolId);
    
    if (!currentCarpool) {
      toast.error("Carpool not found!");
      return;
    }
    
    // 🔥 BACKFILL driverGender from localStorage if missing (for YOUR carpools only)
    if (!currentCarpool.driverGender && currentCarpool.driverId === userId) {
      currentCarpool.driverGender = userGender; // Get from localStorage via userGender
    }
    
    // Check if carpool is full first
    if (currentCarpool.seats >= (currentCarpool.totalSeats || 4)) {
      toast.error("This carpool is already full!");
      return;
    }
    
    // Get the days of the current carpool
    const currentCarpoolDays = currentCarpool.driverSchedule?.[0]?.days || [];
    
    // Get already joined passenger IDs + current user ID to exclude
    const alreadyJoinedIds = currentCarpool.passengers?.map(p => p.id) || [];
    const excludeUserIds = [...alreadyJoinedIds, userId];
    
    // Use gender filter helper to get carpool users filtered by driver's gender preference
    const genderFilteredUsers = filterCarpoolUsersByGender(
      currentCarpool.genderPreference || 'both',
      currentCarpool.driverGender,
      excludeUserIds
    );
    
    // Further filter by day conflicts (check if they have listings or joined carpools on same days)
    const eligibleUsers = genderFilteredUsers.filter(user => {
      // Use the existing validation function to check for day conflicts
      const dayConflict = checkDayConflictForJoining(currentCarpoolDays, user.userId, user.email);
      
      // Only include users with NO conflict
      return !dayConflict.hasConflict;
    });
    
    if (eligibleUsers.length === 0) {
      toast.error("No eligible passengers available. All matching users have schedule conflicts or don't meet gender preference.");
      return;
    }
    
    // Pick the first eligible user (SEQUENTIAL, not random)
    const availableUser = eligibleUsers[0];
    
    const updatedCarpools = storedCarpools.map(carpool => {
      if (carpool.id === carpoolId) {
        // Create passenger object from user table data
        const newPassenger = {
          id: availableUser.userId,
          name: availableUser.name,
          email: availableUser.email,
          phone: availableUser.phone,
          profilePicture: availableUser.profilePicture,
          gender: availableUser.gender,
          joinedAt: new Date().toISOString()
        };
        
        const newSeatsCount = carpool.seats + 1;
        const totalSeats = carpool.totalSeats || 4;
        
        return {
          ...carpool,
          seats: newSeatsCount,
          passengers: [...(carpool.passengers || []), newPassenger],
          status: newSeatsCount >= totalSeats ? "Full" : "Active"
        };
      }
      return carpool;
    });
    
    localStorage.setItem('carpoolListings', JSON.stringify(updatedCarpools));
    setAllCarpools(updatedCarpools);
    const userCarpools = updatedCarpools.filter(
      carpool => carpool.driverId === userId && carpool.status !== "Deleted"
    );
    setMyCarpools(userCarpools);
    
    toast.success(`${availableUser.name} has joined your carpool!`);
  };

  // Remove passenger from carpool
  const handleRemovePassenger = (carpoolId, passengerId) => {
    const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    const currentCarpool = storedCarpools.find(c => c.id === carpoolId);
    
    if (!currentCarpool) {
      toast.error("Carpool not found!");
      return;
    }
    
    const passenger = currentCarpool.passengers?.find(p => p.id === passengerId);
    if (!passenger) {
      toast.error("Passenger not found!");
      return;
    }
    
    const updatedCarpools = storedCarpools.map(carpool => {
      if (carpool.id === carpoolId) {
        // Remove the passenger from the array
        const updatedPassengers = carpool.passengers.filter(p => p.id !== passengerId);
        const newSeatsCount = updatedPassengers.length;
        const totalSeats = carpool.totalSeats || 4;
        
        return {
          ...carpool,
          seats: newSeatsCount,
          passengers: updatedPassengers,
          status: newSeatsCount >= totalSeats ? "Full" : "Active"
        };
      }
      return carpool;
    });
    
    // Only update joinedCarpools if the removed passenger is the CURRENT USER
    if (passengerId === userId) {
      const storedJoinedRides = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
      const updatedJoinedRides = storedJoinedRides.filter(id => id !== carpoolId);
      localStorage.setItem('joinedCarpools', JSON.stringify(updatedJoinedRides));
      
      // Update local state
      setJoinedRides(updatedJoinedRides);
    }
    
    localStorage.setItem('carpoolListings', JSON.stringify(updatedCarpools));
    setAllCarpools(updatedCarpools);
    const userCarpools = updatedCarpools.filter(
      carpool => carpool.driverId === userId && carpool.status !== "Deleted"
    );
    setMyCarpools(userCarpools);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('joinedCarpoolsUpdated'));
    
    toast.success(`${passenger.name} has been removed from the carpool`);
  };

  // Filter available rides - SIMPLIFIED (like dorm seeker dashboard)
  const getAvailableRides = () => {
    let filteredRides = allCarpools.filter(carpool => {
      // 🔍 DEBUG: Track Sami and Tony's carpools
      const isSamiOrTony = carpool.driverName === 'Sami Nakhleh' || carpool.driverName === 'Tony Haddad';
      if (isSamiOrTony) {
        console.log(`\n🔍 CHECKING ${carpool.driverName}'s carpool:`, {
          id: carpool.id,
          driverGender: carpool.driverGender,
          genderPreference: carpool.genderPreference,
          time: carpool.time,
          returnTime: carpool.returnTime,
          status: carpool.status,
          seats: carpool.seats,
          totalSeats: carpool.totalSeats,
          university: carpool.university,
          region: carpool.region,
          driverSchedule: carpool.driverSchedule
        });
        console.log(`   User info:`, { userGender, userUniversity, userRegion, userClassSchedule });
      }
      
      // Exclude user's own listings (use driverId, not email)
      if (carpool.driverId === userId) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Own listing`);
        return false;
      }
      
      // Never show deleted carpools
      if (carpool.status === "Deleted") {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Status is Deleted`);
        return false;
      }
      
      // Hide full carpools unless user has already joined
      const userHasJoined = joinedRides.includes(carpool.id);
      if (carpool.status === "Full" && !userHasJoined) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Carpool is Full (not joined)`);
        return false;
      }
      if (carpool.seats >= (carpool.totalSeats || 4) && !userHasJoined) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Seats full (${carpool.seats}/${carpool.totalSeats})`);
        return false;
      }
      
      // Only show rides from same university
      if (carpool.university !== userUniversity) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: University mismatch (${carpool.university} !== ${userUniversity})`);
        return false;
      }
      
      // Only show rides from user's region
      if (carpool.region !== userRegion) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Region mismatch (${carpool.region} !== ${userRegion})`);
        return false;
      }
      
      // SCHEDULE-BASED FILTERING: ALL carpool days must match passenger's schedule
      if (!isCarpoolScheduleCompatible(carpool, userClassSchedule)) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Schedule incompatible`);
        return false;
      }
      
      // Apply start date filter (show rides on or after this date)
      if (startDateFilter && carpool.date < startDateFilter) {
        if (isSamiOrTony) console.log(`   ❌ FILTERED: Start date filter (${carpool.date} < ${startDateFilter})`);
        return false;
      }

      // Apply selected days filter (filter by driver's schedule days)
      if (selectedDaysFilter.length > 0 && carpool.driverSchedule && carpool.driverSchedule.length > 0) {
        const driverDays = carpool.driverSchedule.flatMap(block => block.days || []);
        const hasAllSelectedDays = selectedDaysFilter.every(selectedDay => driverDays.includes(selectedDay));
        
        if (!hasAllSelectedDays) {
          if (isSamiOrTony) console.log(`   ❌ FILTERED: Days filter (need ${selectedDaysFilter}, has ${driverDays})`);
          return false;
        }
      }

      // Apply gender filter (filter by carpool's gender preference setting)
      if (genderFilter === 'same') {
        // User wants to see only "same gender" carpools
        if (carpool.genderPreference !== 'same') {
          if (isSamiOrTony) console.log(`   ❌ FILTERED: User's gender filter (carpool preference: ${carpool.genderPreference}, user wants: same)`)
          return false;
        }
      }
      // If genderFilter === 'both', show all carpools (no filtering)
      
      // Apply carpool's gender preference setting (driver's requirement)
      if (carpool.genderPreference === 'same' && userGender && carpool.driverGender) {
        // If driver wants same gender only, check if passenger matches
        if (carpool.driverGender.toLowerCase() !== userGender.toLowerCase()) {
          if (isSamiOrTony) console.log(`   ❌ FILTERED: Driver's gender preference (driver: ${carpool.driverGender}, user: ${userGender})`);
          return false;
        }
      }
      
      if (isSamiOrTony) console.log(`   ✅ PASSED all filters!`);
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
      // CHECK: Day conflict validation for creating listing (only checks joined carpools)
      const newListingDays = selectedBlock.days || [];
      const dayConflict = checkDayConflictForCreating(newListingDays, userEmail);
      
      if (dayConflict.hasConflict) {
        const dayNames = dayConflict.conflictingDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
        toast.error(`You've already joined a carpool on ${dayNames}. Can't create listings with overlapping days.`);
        return;
      }
      
      // Create new carpool
      const newCarpool = {
        university: userUniversity,
        region: userRegion,
        pickupLocation: userRegion,
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
      
      await carpoolService.createCarpool(newCarpool);
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
      await carpoolService.deleteCarpool(id);
      await loadCarpools();
      toast.success("Carpool listing deleted successfully!");
    } catch (error) {
      console.error('Delete carpool error:', error);
      toast.error(error.message || 'Failed to delete carpool');
    }
  };

  // Check if all schedule blocks are in use
  const checkAllScheduleBlocksInUse = () => {
    if (!userClassSchedule || userClassSchedule.length === 0) return false;
    
    const storedCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
    const userCarpools = storedCarpools.filter(
      carpool => carpool.driverId === userId && carpool.status !== "Deleted"
    );
    
    // If no carpools, not all are in use
    if (userCarpools.length === 0) return false;
    
    // Check if every schedule block has a matching carpool
    return userClassSchedule.every(block => {
      return userCarpools.some(carpool => {
        if (!carpool.driverSchedule || carpool.driverSchedule.length === 0) return false;
        
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

  // Generate user's schedule summary for display
  const getUserScheduleSummary = () => {
    if (!userClassSchedule || userClassSchedule.length === 0) {
      return null;
    }

    // Group schedule blocks by day and get the earliest start time for each day
    const scheduleByDay = {};
    userClassSchedule.forEach(block => {
      if (block.days && block.days.length > 0) {
        block.days.forEach(day => {
          if (!scheduleByDay[day] || block.startTime < scheduleByDay[day]) {
            scheduleByDay[day] = block.startTime;
          }
        });
      }
    });

    // Convert to readable format
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const sortedDays = Object.keys(scheduleByDay).sort((a, b) => 
      dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    return sortedDays.map(day => 
      `${getDayAbbreviation(day)} ${scheduleByDay[day]}`
    ).join(', ');
  };

  const scheduleSummary = getUserScheduleSummary();

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
              Find rides from <span className="font-semibold text-blue-600 dark:text-blue-400">{userRegion}</span> to <span className="font-semibold text-blue-600 dark:text-blue-400">{userUniversity}</span>
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
              ️ You need to set your region to create or view carpool listings. Please contact support to update your region.
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
                selectedScheduleBlock: null
              });
            }}
            userRegion={userRegion}
            userUniversity={userUniversity}
            userClassSchedule={userClassSchedule}
            regionLocations={regionLocations}
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
              availableRides.map(ride => (
                <CarpoolCard
                  key={ride.id}
                  carpool={ride}
                  type="browse"
                  hasJoined={hasJoinedRide(ride.id)}
                  onJoin={handleJoinRide}
                  onLeave={handleLeaveRide}
                  onContact={() => contactCarpoolDriver(ride, userUniversity)}
                  isJoinDisabled={ride.seats >= (ride.totalSeats || 4)}
                  joinButtonText={ride.seats >= (ride.totalSeats || 4) ? 'Full' : 'Join Ride'}
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
                    onAddDemoPassenger={handleAddDemoPassenger}
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