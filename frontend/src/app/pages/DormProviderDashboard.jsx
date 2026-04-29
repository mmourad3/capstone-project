import { useState, useEffect } from "react";
import { Plus, Lightbulb } from "lucide-react";
import { toast } from "react-toastify";
import { DashboardNav } from "../components/DashboardNav";
import { DormListingCard } from "../components/DormListingCard";
import { DormFormModal } from "../components/DormFormModal";
import { DormDetailModal } from "../components/DormDetailModal";
import { useRoleProtection } from "../hooks/useRoleProtection";
import { useUserData } from "../hooks/useUserData";
import { availableAmenities } from "../constants/amenities";
import { dormAPI } from "../services/api";

export default function DormProviderDashboard() {  
  useRoleProtection('dorm_provider');
  
  // Get user data from centralized hook
  const userData = useUserData();
  const { userName, userId } = userData;
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [postedDorms, setPostedDorms] = useState([]);
  const [editingDorm, setEditingDorm] = useState(null);
  const [selectedDorm, setSelectedDorm] = useState(null); // For detail view modal
  const [formData, setFormData] = useState({
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

  
  
  // Check if user has a "Found Roommate" listing
  const hasFoundRoommate = postedDorms.some(dorm => dorm.status === 'Found Roommate');

  
  // LOCATION COUNTRY: Always use Lebanon (LB) for location searches
  // This is separate from phone number country - students can have international phone numbers
  // but all dorms/listings must be in Lebanon
  const locationCountryISO = 'LB'; // Force Lebanon for all location searches
  const locationCountryName = 'Lebanon';

  useEffect(() => {
    const loadMyDorms = async () => {
      try {
        const dorms = await dormAPI.getMyListings();
        setPostedDorms(dorms);
      } catch (error) {
        toast.error(error.message || "Failed to load your dorm listings");
      }
    };

    loadMyDorms();
  }, []);

  const handleSubmit = async (e) => {
e.preventDefault();

const dormPayload = {
  title: formData.title,
  location: formData.location,
  latitude: formData.latitude,
  longitude: formData.longitude,
  price: String(formData.price),
  roomType: formData.roomType === "single" ? "Single Room" : "Shared Room",
  genderPreference: formData.genderPreference,
  description: formData.description,
  amenities: formData.amenities,
  images: formData.images,
};

try {
  if (editingDorm) {
    const response = await dormAPI.update(editingDorm.id, dormPayload);

    setPostedDorms((prev) =>
      prev.map((dorm) => (dorm.id === editingDorm.id ? response.dorm : dorm)),
    );

    setEditingDorm(null);

    toast.success("Dorm listing updated successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    const activeDorms = postedDorms.filter((dorm) => dorm.status === "Active");

    for (const dorm of activeDorms) {
      await dormAPI.update(dorm.id, { status: "Inactive" });
    }

  window.dispatchEvent(new Event("roommateDataChanged"));
    const response = await dormAPI.create({
      ...dormPayload,
      status: "Active",
    });

    setPostedDorms((prev) => [
      response.dorm,
      ...prev.map((dorm) =>
        dorm.status === "Active" ? { ...dorm, status: "Inactive" } : dorm,
      ),
    ]);

    toast.success("Dorm posted successfully! Your listing is now active.", {
      position: "top-right",
      autoClose: 3000,
    });

    if (postedDorms.length > 0) {
      toast.info(
        "Previous listings have been marked as inactive since you can only have one active dorm at a time.",
        {
          position: "top-right",
          autoClose: 5000,
        },
      );
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
    images: [],
  });
} catch (error) {
  toast.error(error.message || "Failed to save dorm listing");
}
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

  const handleDelete = async (id) => {
const dormToDelete = postedDorms.find((dorm) => dorm.id === id);

if (dormToDelete && dormToDelete.status === "Found Roommate") {
  toast.error(
    "You cannot delete a listing with an active roommate. Please end the roommate relationship first.",
    {
      position: "top-right",
      autoClose: 5000,
    },
  );
  return;
}

if (confirm("Are you sure you want to delete this listing?")) {
  try {
    await dormAPI.delete(id);

    setPostedDorms((prev) => prev.filter((dorm) => dorm.id !== id));

    toast.success("Listing deleted successfully.", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (error) {
    toast.error(error.message || "Failed to delete listing");
  }
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

const handleToggleActive = async (dormId) => {
  if (hasFoundRoommate) {
    toast.error(
      "You cannot activate another listing while you have a roommate. Please end the current roommate relationship first.",
      {
        position: "top-right",
        autoClose: 5000,
      },
    );
    return;
  }

  try {
    const activeDorms = postedDorms.filter(
      (dorm) => dorm.status === "Active" && dorm.id !== dormId,
    );

    for (const dorm of activeDorms) {
      await dormAPI.update(dorm.id, { status: "Inactive" });
    }

    const response = await dormAPI.update(dormId, { status: "Active" });

    setPostedDorms((prev) => [
      response.dorm,
      ...prev
        .filter((dorm) => dorm.id !== dormId)
        .map((dorm) =>
          dorm.status === "Active" ? { ...dorm, status: "Inactive" } : dorm,
        ),
    ]);
  } catch (error) {
    toast.error(error.message || "Failed to activate listing");
  }
};

const handleMarkInactive = async (dormId) => {
  if (
    confirm(
      "Are you sure you want to mark this listing as inactive? All pending roommate requests will be removed.",
    )
  ) {
    try {
      const response = await dormAPI.update(dormId, { status: "Inactive" });
      window.dispatchEvent(new Event("roommateDataChanged"));
      
      setPostedDorms((prev) =>
        prev.map((dorm) => (dorm.id === dormId ? response.dorm : dorm)),
      );

      toast.success(
        "Listing marked as inactive. Pending requests have been cleared.",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
    } catch (error) {
      toast.error(error.message || "Failed to mark listing inactive");
    }
  }
};

const handleMarkFoundRoommate = async (dormId) => {
  try {
    const response = await dormAPI.update(dormId, {
      status: "Found Roommate",
    });

    setPostedDorms((prev) =>
      prev.map((dorm) => (dorm.id === dormId ? response.dorm : dorm)),
    );

    toast.success(
      'Congratulations! Listing marked as "Found Roommate". It will no longer appear in search results.',
      {
        position: "top-right",
        autoClose: 4000,
      },
    );
  } catch (error) {
    toast.error(error.message || "Failed to update listing status");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DashboardNav userName={userName} userType="dorm_provider" />

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