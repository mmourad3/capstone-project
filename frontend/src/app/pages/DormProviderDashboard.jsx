import { useState, useEffect, useRef } from "react";
import { Plus, MapPin, Users, DollarSign, X, MessageCircle, Eye, Edit2, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Check, Globe, UserCheck, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Navbar } from "../components/Navbar";
import { DashboardNav } from "../components/DashboardNav";
import { LocationPicker } from "../components/LocationPicker";
import { ImageUpload } from "../components/ImageUpload";
import { ImageCarousel } from "../components/ImageCarousel";
import { DormListingCard } from "../components/DormListingCard";
import { DormFormModal } from "../components/DormFormModal";
import { DormDetailModal } from "../components/DormDetailModal";
import { useRoleProtection } from "../hooks/useRoleProtection";
import { useUserData } from "../hooks/useUserData";
import { calculateDistanceToUniversity, formatDistance, getTopNearestUniversities } from "../utils/universityCoordinates";
import { navigateToDashboard } from "../utils/navigationHelpers";
import { safeSetItem } from "../utils/localStorageHelper";
import { availableAmenities } from "../constants/amenities";

/**
 * Dorm Provider Dashboard
 * Allows students to post and manage their dorm listings
 * 
 * ROLE RESTRICTION: Only 'dorm-provider' role users can access this dashboard.
 * Dorm-seekers and carpool users are redirected to their respective dashboards.
 */

// No demo data - users start with empty state
const mockPostedDorms = [];

export default function DormProviderDashboard() {
  const navigate = useNavigate();
  
  // Role protection hook - blocks non-dorm-provider users
  useRoleProtection('dorm-provider');
  
  // Get user data from centralized hook
  const userData = useUserData();
  const { userName, userCountry, userCountryCode, userId } = userData;
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [postedDorms, setPostedDorms] = useState(mockPostedDorms);
  const [editingDorm, setEditingDorm] = useState(null);
  const [selectedDorm, setSelectedDorm] = useState(null); // For detail view modal
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    latitude: null,
    longitude: null,
    price: "",
    roomType: "single",
    genderPreference: "any", // Changed from gender to genderPreference
    description: "",
    amenities: [],
    images: []
  });

  // Helper function to clean up all roommate requests for this provider
  const cleanupProviderRequests = () => {
    const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
    
    // Remove ALL requests where this provider is the recipient (incoming requests from seekers) - BACKEND-READY: Use userId
    const updatedRequests = requests.filter(r => r.recipientUserId !== userId);
    localStorage.setItem('roommateRequests', JSON.stringify(updatedRequests));
    
    // Dispatch event to refresh roommate sections
    window.dispatchEvent(new Event('roommateDataChanged'));
  };

  // Refs for scrolling to errors
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const amenitiesRef = useRef(null);
  const imagesRef = useRef(null);
  
  // Check if user has a "Found Roommate" listing
  const hasFoundRoommate = postedDorms.some(dorm => dorm.status === 'Found Roommate');

  // Helper function: Convert phone code to ISO code for backward compatibility
  const phoneCodeToISO = {
    '+961': 'LB',
    '+1': 'US',
    '+44': 'GB',
    '+61': 'AU',
    '+91': 'IN',
    '+92': 'PK',
    '+971': 'AE',
    '+966': 'SA',
    '+20': 'EG',
    '+962': 'JO',
    '+90': 'TR',
    '+33': 'FR',
    '+49': 'DE',
    '+65': 'SG',
  };

  // Convert phone code to ISO if needed (for users who signed up before the fix)
  const getISOCode = (code) => {
    if (!code) return null;
    // If it's already ISO code (2 letters), return it
    if (code.length === 2) return code.toUpperCase();
    // If it's a phone code, convert it
    return phoneCodeToISO[code] || null;
  };

  // LOCATION COUNTRY: Always use Lebanon (LB) for location searches
  // This is separate from phone number country - students can have international phone numbers
  // but all dorms/listings must be in Lebanon
  const locationCountryISO = 'LB'; // Force Lebanon for all location searches
  const locationCountryName = 'Lebanon';

  // Load posted dorms from localStorage on mount
  useEffect(() => {
    const loadDorms = () => {
      const savedDorms = localStorage.getItem('postedDorms');
      const currentUserEmail = localStorage.getItem('userEmail');
      const currentUserName = localStorage.getItem('userName') || 'Student';
      
      if (savedDorms) {
        try {
          const parsed = JSON.parse(savedDorms);
          console.log('📦 Loaded dorms from localStorage:', parsed);
          
          setPostedDorms(parsed);
        } catch (error) {
          console.error('Error loading dorms:', error);
        }
      }
    };

    loadDorms();

    // Listen for dorm status changes
    const handleDormUpdate = (event) => {
      console.log('🔄 Dorm update event received:', event.type);
      loadDorms();
    };

    window.addEventListener('roommateAccepted', handleDormUpdate);
    window.addEventListener('roommateEnded', handleDormUpdate);
    window.addEventListener('storage', handleDormUpdate);

    return () => {
      window.removeEventListener('roommateAccepted', handleDormUpdate);
      window.removeEventListener('roommateEnded', handleDormUpdate);
      window.removeEventListener('storage', handleDormUpdate);
    };
  }, []);

  // Save postedDorms to localStorage whenever it changes
  useEffect(() => {
    const success = safeSetItem(
      'postedDorms', 
      JSON.stringify(postedDorms),
      (errorMsg) => toast.error(errorMsg)
    );
    
    if (!success) {
      console.error('Failed to save postedDorms to localStorage');
    }
  }, [postedDorms]);

  // Reload data when page becomes visible (when navigating back from profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedDorms = localStorage.getItem('postedDorms');
        if (savedDorms) {
          try {
            const parsed = JSON.parse(savedDorms);
            setPostedDorms(parsed);
          } catch (error) {
            console.error('Error loading dorms:', error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price to number (remove $ and any text, then parse)
    const parsePrice = (price) => {
      const cleanPrice = String(price).replace(/[^0-9.]/g, '');
      return parseFloat(cleanPrice) || 0;
    };
    
    const priceNumber = parsePrice(formData.price);
    
    if (editingDorm) {
      // Update existing dorm
      const updatedDorms = postedDorms.map(dorm =>
        dorm.id === editingDorm.id
          ? {
              ...dorm,
              title: formData.title,
              location: formData.location,
              latitude: formData.latitude,
              longitude: formData.longitude,
              price: priceNumber,
              roomType: formData.roomType === "single" ? "Single Room" : "Shared Room",
              genderPreference: formData.genderPreference, // Store as "same" or "any"
              description: formData.description,
              amenities: formData.amenities,
              images: formData.images,
            }
          : dorm
      );
      setPostedDorms(updatedDorms);
      setEditingDorm(null);
      toast.success('Dorm listing updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      // Create new dorm - Set all existing dorms to Inactive since you can only have 1 active dorm
      const updatedExistingDorms = postedDorms.map(dorm => ({
        ...dorm,
        status: "Inactive"
      }));
      
      // Clean up ALL pending roommate requests since old listings are now inactive
      cleanupProviderRequests();
      
      const newDorm = {
        id: Date.now(),
        title: formData.title,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        price: priceNumber,
        roomType: formData.roomType === "single" ? "Single Room" : "Shared Room",
        genderPreference: formData.genderPreference, // Store as "same" or "any"
        description: formData.description,
        amenities: formData.amenities,
        images: formData.images,
        status: "Active",
        posterId: userId, // BACKEND-READY: Use userId as foreign key
        posterEmail: localStorage.getItem('userEmail'), // Legacy field for display
        posterName: localStorage.getItem('userName') || 'Student',
        posterGender: localStorage.getItem('userGender') || 'Male', // Add posterGender for gender filtering
        datePosted: new Date().toISOString() // Add timestamp for sorting
      };
      setPostedDorms([newDorm, ...updatedExistingDorms]);
      
      // Show success notification
      toast.success('Dorm posted successfully! Your listing is now active.', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Show notification if there were previous active dorms
      if (postedDorms.length > 0) {
        toast.info('Previous listings have been marked as inactive and pending requests have been cleared since you can only have one active dorm at a time.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
    
    setShowCreateForm(false);
    setFormData({
      title: "",
      location: "",
      latitude: null,
      longitude: null,
      price: "",
      roomType: "single",
      genderPreference: "any",
      description: "",
      amenities: [],
      images: []
    });
  };

  const handleEdit = (dorm) => {
    setEditingDorm(dorm);
    setFormData({
      title: dorm.title,
      location: dorm.location,
      latitude: dorm.latitude,
      longitude: dorm.longitude,
      price: dorm.price,
      roomType: dorm.roomType === "Single Room" ? "single" : "shared",
      genderPreference: dorm.genderPreference || dorm.gender?.toLowerCase() || "any", // Support both old and new field names
      description: dorm.description,
      amenities: dorm.amenities || [],
      images: dorm.images || []
    });
    setShowCreateForm(true);
  };

  const handleDelete = (id) => {
    // Check if the listing being deleted has "Found Roommate" status
    const dormToDelete = postedDorms.find(dorm => dorm.id === id);
    
    if (dormToDelete && dormToDelete.status === 'Found Roommate') {
      toast.error('You cannot delete a listing with an active roommate. Please end the roommate relationship first.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    
    if (confirm('Are you sure you want to delete this listing?')) {
      setPostedDorms(postedDorms.filter(dorm => dorm.id !== id));
      toast.success('Listing deleted successfully.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingDorm(null);
    setFormData({
      title: "",
      location: "",
      latitude: null,
      longitude: null,
      price: "",
      roomType: "single",
      genderPreference: "any",
      description: "",
      amenities: [],
      images: []
    });
  };

  const handleToggleActive = (dormId) => {
    // Check if user already has a "Found Roommate" listing
    if (hasFoundRoommate) {
      toast.error('You cannot activate another listing while you have a roommate. Please end the current roommate relationship first.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    
    // Check if provider has any pending roommate requests
    const currentUserEmail = localStorage.getItem('userEmail');
    const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
    const hasPendingRequests = requests.some(r => 
      r.recipientUserId === userId && r.status === 'pending' // BACKEND-READY: Use userId
    );
    
    if (hasPendingRequests) {
      toast.error('You have pending roommate requests. Please accept or decline them before activating a new listing.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    
    // Find the dorm to activate
    const activatedDorm = postedDorms.find(dorm => dorm.id === dormId);
    
    // Set all dorms to inactive except the one being activated
    const updatedDorms = postedDorms
      .map(dorm => ({
        ...dorm,
        status: dorm.id === dormId ? "Active" : "Inactive"
      }))
      .filter(dorm => dorm.id !== dormId); // Remove activated dorm from current position
    
    // Place activated dorm at the top
    setPostedDorms([{ ...activatedDorm, status: "Active" }, ...updatedDorms]);
  };

  const handleMarkInactive = (dormId) => {
    if (confirm('Are you sure you want to mark this listing as inactive? All pending roommate requests will be removed.')) {
      // Mark dorm as inactive
      const updatedDorms = postedDorms.map(dorm =>
        dorm.id === dormId ? { ...dorm, status: "Inactive" } : dorm
      );
      setPostedDorms(updatedDorms);
      
      // Clean up ALL pending roommate requests since listing is now inactive
      cleanupProviderRequests();
      
      toast.success('Listing marked as inactive. Pending requests have been cleared.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleMarkFoundRoommate = (dormId) => {
    const updatedDorms = postedDorms.map(dorm => 
      dorm.id === dormId 
        ? { ...dorm, status: "Found Roommate" }
        : dorm
    );
    setPostedDorms(updatedDorms);
    toast.success('Congratulations! Listing marked as "Found Roommate". It will no longer appear in search results.', {
      position: "top-right",
      autoClose: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DashboardNav userName={userName} userType="dorm-provider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Manage Your Dorm Listings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Post and manage your available dorm spaces
            </p>
          </div>
          <button
            onClick={() => {
              if (hasFoundRoommate) {
                toast.error('You cannot create a new listing while you have an active roommate. Please end the current roommate relationship first.', {
                  position: "top-right",
                  autoClose: 5000,
                });
              } else {
                setShowCreateForm(true);
              }
            }}
            className="flex items-center gap-2 bg-blue-500 dark:bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 w-full sm:w-auto justify-center text-sm sm:text-base cursor-pointer"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Post New Dorm
          </button>
        </div>

        {/* Post New Dorm Form Modal */}
        <DormFormModal
          isOpen={showCreateForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingDorm={editingDorm}
          locationCountryISO={locationCountryISO}
          locationCountryName={locationCountryName}
        />

        {/* Posted Dorms List */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Posted Dorms ({postedDorms.length})
          </h2>
          
          {postedDorms.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 sm:p-12 flex items-center justify-center min-h-[300px]">
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">You haven't posted any dorms yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {postedDorms.map((dorm) => (
                <DormListingCard
                  key={dorm.id}
                  dorm={dorm}
                  availableAmenities={availableAmenities}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  onMarkInactive={handleMarkInactive}
                  onViewDetails={setSelectedDorm}
                />
              ))}
            </div>
          )}
        </div>

        {/* Inquiries Section */}
        {postedDorms.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Inquiries
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
              Students interested in your listings will contact you directly via WhatsApp.
              Make sure to respond promptly to maintain a good reputation.
            </p>
            <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                Tip: Provide detailed descriptions and photos to attract more quality inquiries.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dorm Detail View Modal */}
      {selectedDorm && (
        <DormDetailModal
          selectedDorm={selectedDorm}
          availableAmenities={availableAmenities}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleToggleActive={handleToggleActive}
          setSelectedDorm={setSelectedDorm}
        />
      )}
    </div>
  );
}