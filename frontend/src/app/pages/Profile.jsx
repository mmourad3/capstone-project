import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DashboardNav } from "../components/DashboardNav";
import { LifestylePreferencesSection } from "../components/LifestylePreferencesSection";
import RoommateSection from "../components/RoommateSection";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { ProfilePicture } from "../components/ProfilePicture";
import { DormSeekerDetailModal } from "../components/DormSeekerDetailModal";
import { contactDormProvider } from "../utils/whatsappUtils";
import { validatePasswordChange } from "../utils/passwordValidation";
import { createScheduleHelpers } from "../utils/scheduleHelpers";
import { navigateToDashboard, getRoleDisplayName } from "../utils/navigationHelpers";
import { validatePhoneByCountry } from "../utils/phoneValidation";
import { ChangePasswordSection } from "../components/profile/ChangePasswordSection";
import { DeleteAccountSection } from "../components/profile/DeleteAccountSection";
import { FavoriteDormsSection } from "../components/profile/FavoriteDormsSection";
import { JoinedCarpoolsSection } from "../components/profile/JoinedCarpoolsSection";
import { ClassScheduleSection } from "../components/profile/ClassScheduleSection";
import { ProfileInfoForm } from "../components/profile/ProfileInfoForm";
import { calculateDistanceToUniversity } from "../utils/universityCoordinates";
import { authAPI, favoriteDormAPI, carpoolAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { getAvailableCountries } from "../config/appConfig";
import { uploadProfilePicture, deleteProfilePictureFromUrl } from '../utils/uploadProfilePicture';

export default function Profile() {
  const { user, loading } = useAuth();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [favoriteDorms, setFavoriteDorms] = useState([]);
  const [favoritedListings, setFavoritedListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [joinedCarpools, setJoinedCarpools] = useState([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Redirect to home if not logged in
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Handler functions for detail modal
  const handleWhatsApp = (phone, posterName, listing) => {
    const seekerName = `${userData.firstName} ${userData.lastName}`.trim();
    const seekerUniversity = userData.university;
    contactDormProvider(listing, seekerName, seekerUniversity);
  };

  const handleViewProviderProfile = (providerId, listingId = null) => {
    // Get listing ID from parameter, or fallback to URL if not provided
    const finalListingId = listingId || searchParams.get('dorm');
    
    // Build URL with context
    let url = `/profile/${providerId}?from=profile`;
    if (finalListingId) {
      url += `&dormId=${finalListingId}`;
    }
    
    navigate(url);
  };
  
const emptyUserData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  role: "",
  country: "",
  countryCode: "",
  university: "",
  region: "",
  profilePicture: "",
};

const [userData, setUserData] = useState(emptyUserData);
const [editedData, setEditedData] = useState(emptyUserData);

useEffect(() => {
  if (!user) return;

  let phone = user.phone || "";

  const selectedCountry = getAvailableCountries().find(
    (c) => c.name === user.country,
  );

  const phoneCode = selectedCountry?.code || user.countryCode || "";

  if (phoneCode && phone.startsWith(phoneCode)) {
    phone = phone.slice(phoneCode.length);
  }

  const backendUser = {
    ...emptyUserData,
    ...user,
    phone,
    countryCode: phoneCode,
    profilePicture: user.profilePicture || "",
  };

  setUserData(backendUser);
  setEditedData(backendUser);
}, [user]);




  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [classSchedule, setClassSchedule] = useState([]);
  const carpoolRegion = userData.region || "";

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([...classSchedule]);

  useEffect(() => {
if (user?.role !== "carpool") return;
    const schedule = user?.classSchedule || [];
    setClassSchedule(schedule);
    setEditedSchedule(schedule);
  }, [user, userData.role]);

  // Schedule management helpers
  const scheduleHelpers = createScheduleHelpers(editedSchedule, setEditedSchedule);

  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePictureFile(file);

    const previewUrl = URL.createObjectURL(file);

    setEditedData({
      ...editedData,
      profilePicture: previewUrl,
    });
  };

  const removeProfilePicture = () => {
    setProfilePictureFile(null);
    setEditedData({
      ...editedData,
      profilePicture: "",
    });
  };

const handleSaveProfile = async () => {
  if (isSavingProfile) return;
  if (
    !editedData.firstName ||
    !editedData.lastName ||
    !editedData.gender ||
    !editedData.country ||
    !editedData.phone
  ) {
    toast.error("Please fill in all required fields");
    return;
  }

  const phoneValidation = validatePhoneByCountry(
    editedData.phone,
    editedData.country,
  );

  if (!phoneValidation.isValid) {
    toast.error(phoneValidation.error);
    return;
  }
  setIsSavingProfile(true);

  try {
    let profilePictureUrl = editedData.profilePicture;

    if (profilePictureFile) {
      const oldProfilePictureUrl = userData.profilePicture;

      profilePictureUrl = await uploadProfilePicture(
        profilePictureFile,
        user.id,
      );

      // delete old image (if exists)
      if (oldProfilePictureUrl) {
        await deleteProfilePictureFromUrl(oldProfilePictureUrl);
      }
    }

    else if (!editedData.profilePicture && userData.profilePicture) {
      await deleteProfilePictureFromUrl(userData.profilePicture);
      profilePictureUrl = null;
    }
    const updatedUser = await authAPI.updateMe({
      firstName: editedData.firstName,
      lastName: editedData.lastName,
      gender: editedData.gender,
      country: editedData.country,
      countryCode: editedData.countryCode,
      phone: editedData.phone,
      profilePicture: profilePictureUrl || null,
    });

    const newUserData = {
      ...userData,
      ...updatedUser,
    };

    setUserData(newUserData);
    setEditedData(newUserData);
    setProfilePictureFile(null);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  } catch (error) {
    toast.error(error.message || "Failed to update profile");
  } finally {
    setIsSavingProfile(false);
  }
};

  const handleCancelEdit = () => {
    setEditedData({ ...userData });
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    const validation = validatePasswordChange(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleBack = () => {
    navigateToDashboard(userData.role, navigate);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm account deletion.');
      return;
    }

    try {
      await authAPI.deleteMe();
      authAPI.logout();
      toast.success("Your account has been permanently deleted.");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  const normalizeFavoriteDorm = (listing) => {
    const poster = listing.poster || {};
    const posterName =
      `${poster.firstName || ""} ${poster.lastName || ""}`.trim();
      const hasCoordinates =
        listing.latitude !== undefined &&
        listing.latitude !== null &&
        listing.longitude !== undefined &&
        listing.longitude !== null;

      const distanceKm = hasCoordinates
        ? calculateDistanceToUniversity(
            { lat: listing.latitude, lng: listing.longitude },
            userData.university,
          )
        : null;

    return {
      ...listing,
      price: Number(listing.price) || 0,
      posterId: listing.posterId,
      posterName,
      poster: posterName,
      posterEmail: poster.email || "",
      posterPhone: poster.phone || "",
      whatsapp: poster.phone || "",
      posterGender: poster.gender || "",
      posterProfilePic: poster.profilePicture || "",
      amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
      images: Array.isArray(listing.images) ? listing.images : [],
      genderPreference: listing.genderPreference || "any",
      status: listing.status || "Active",
      distanceKm,
    };
  };

 const loadFavoriteDorms = async (showError = false) => {
   try {
     const dorms = await favoriteDormAPI.getAll();
     const normalizedDorms = dorms.map(normalizeFavoriteDorm);

     setFavoritedListings(normalizedDorms);
     setFavoriteDorms(normalizedDorms.map((dorm) => dorm.id));
   } catch (error) {
     console.error("Failed to load favorite dorms:", error);

     if (showError) {
       toast.error(error.message || "Failed to load favorite dorms");
     }
   }
 };


useEffect(() => {
  if (userData.role !== "dorm_seeker") return;

  loadFavoriteDorms(false);
  const handleFavoritesUpdated = () => loadFavoriteDorms(true);


  window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

  return () => {
    window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
  };
}, [userData.role]);



  useEffect(() => {
    if (userData.role !== "carpool") return;

    const loadJoinedCarpools = async () => {
      try {
        const carpools = await carpoolAPI.getJoined();
        setJoinedCarpools(carpools);
      } catch (error) {
        toast.error(error.message || "Failed to load joined carpools");
      }
    };

    loadJoinedCarpools();

    window.addEventListener("joinedCarpoolsUpdated", loadJoinedCarpools);

    return () => {
      window.removeEventListener("joinedCarpoolsUpdated", loadJoinedCarpools);
    };
  }, [userData.role]);


  // Handle URL parameter for opening specific dorm
  useEffect(() => {
    const dormId = searchParams.get('dorm');
    if (dormId && favoritedListings.length > 0) {
      // Compare as strings since IDs can be numbers or strings
      const listing = favoritedListings.find(l => String(l.id) === String(dormId));
      if (listing) {
        setSelectedListing(listing);
      }
    }
  }, [searchParams, favoritedListings]);

  // Update URL when modal opens/closes
  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setSearchParams({ dorm: listing.id });
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setSearchParams({});
  };

const removeFavorite = async (id) => {
  try {
    await favoriteDormAPI.remove(id);

    setFavoriteDorms((prev) => prev.filter((favId) => favId !== id));
    setFavoritedListings((prev) => prev.filter((listing) => listing.id !== id));

    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }

    window.dispatchEvent(new Event("favoritesUpdated"));
    toast.success("Removed from favorites");
  } catch (error) {
    toast.error(error.message || "Failed to remove favorite");
  }
};

const toggleSaved = async (id) => {
  const isAlreadySaved = favoriteDorms.includes(id);

  try {
    if (isAlreadySaved) {
      await favoriteDormAPI.remove(id);

      setFavoriteDorms((prev) => prev.filter((favId) => favId !== id));
      setFavoritedListings((prev) =>
        prev.filter((listing) => listing.id !== id),
      );

      if (selectedListing?.id === id) {
        setSelectedListing(null);
      }
    } else {
      await favoriteDormAPI.add(id);
      await loadFavoriteDorms();
    }

    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    toast.error(error.message || "Failed to update favorite");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav
        userName={`${userData.firstName} ${userData.lastName}`.trim()}
        userType={userData.role}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <ProfilePicture
                src={
                  isEditing
                    ? editedData.profilePicture
                    : userData.profilePicture
                }
                alt="Profile"
                size="xl"
                className="border-4"
              />

              {isEditing && (
                <div className="absolute bottom-0 right-0 flex gap-2">
                  <label
                    htmlFor="profilePictureEdit"
                    className="bg-blue-500 dark:bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      id="profilePictureEdit"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                  {editedData.profilePicture && (
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="bg-red-500 dark:bg-red-600 text-white p-2 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                {getRoleDisplayName(userData.role)}
              </p>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 dark:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium cursor-pointer text-sm sm:text-base"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Form Component */}
        <ProfileInfoForm
          isEditing={isEditing}
          editedData={editedData}
          setEditedData={setEditedData}
          userData={userData}
          handleSaveProfile={handleSaveProfile}
          handleCancelEdit={handleCancelEdit}
        />

        {/* Class Schedule Section - Only show for carpool users */}
        {userData.role === "carpool" && (
          <ClassScheduleSection
            classSchedule={classSchedule}
            setClassSchedule={setClassSchedule}
            carpoolRegion={carpoolRegion}
            isEditingSchedule={isEditingSchedule}
            setIsEditingSchedule={setIsEditingSchedule}
            editedSchedule={editedSchedule}
            setEditedSchedule={setEditedSchedule}
            scheduleHelpers={scheduleHelpers}
          />
        )}

        {/* Joined Carpools Section - Only show for carpool users */}
        {userData.role === "carpool" && (
          <JoinedCarpoolsSection joinedCarpools={joinedCarpools} />
        )}

        {/* Lifestyle Preferences Section - Only show for dorm_seeker and dorm_provider */}
        {userData.role !== "carpool" && (
          <LifestylePreferencesSection navigate={navigate} />
        )}

        {/* My Roommates Section - Only show for dorm_seeker and dorm_provider */}
        {userData.role !== "carpool" && <RoommateSection />}

        {/* Favorite Dorms Section - Only show for dorm_seeker */}
        {userData.role === "dorm_seeker" && (
          <FavoriteDormsSection
            favoritedListings={favoritedListings}
            handleViewDetails={handleViewDetails}
            removeFavorite={removeFavorite}
          />
        )}

        {/* Password Section */}
        <ChangePasswordSection
          showChangePassword={showChangePassword}
          setShowChangePassword={setShowChangePassword}
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          handleChangePassword={handleChangePassword}
        />

        {/* Delete Account Section */}
        <DeleteAccountSection
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          deleteConfirmText={deleteConfirmText}
          setDeleteConfirmText={setDeleteConfirmText}
          handleDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* Detail Modal for Favorite Listings */}
      {selectedListing && (
        <DormSeekerDetailModal
          selectedListing={selectedListing}
          setSelectedListing={setSelectedListing}
          savedListings={favoriteDorms}
          toggleSaved={toggleSaved}
          handleWhatsApp={handleWhatsApp}
          handleViewProviderProfile={handleViewProviderProfile}
          handleCloseListing={handleCloseModal}
          userUniversity={userData.university}
        />
      )}
    </div>
  );
}