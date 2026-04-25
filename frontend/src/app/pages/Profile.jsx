import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { DashboardNav } from "../components/DashboardNav";
import { LifestylePreferencesSection } from "../components/LifestylePreferencesSection";
import RoommateSection from "../components/RoommateSection";
import { User, Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { getFavoritedListings } from "../utils/dormUtils";
import { ProfilePicture } from "../components/ProfilePicture";
import { DormSeekerDetailModal } from "../components/DormSeekerDetailModal";
import { contactDormProvider } from "../utils/whatsappUtils";
import { validatePasswordChange } from "../utils/passwordValidation";
import { createScheduleHelpers } from "../utils/scheduleHelpers";
import { handleProfilePictureUpload, removeProfilePictureHelper } from "../utils/profileHelpers";
import { navigateToDashboard, getRoleDisplayName } from "../utils/navigationHelpers";
import { toggleFavorite, removeFavorite as removeFavoriteHelper } from "../utils/favoritesHelpers";
import { validatePhoneByCountry } from "../utils/phoneValidation";
import { ChangePasswordSection } from "../components/profile/ChangePasswordSection";
import { DeleteAccountSection } from "../components/profile/DeleteAccountSection";
import { FavoriteDormsSection } from "../components/profile/FavoriteDormsSection";
import { JoinedCarpoolsSection } from "../components/profile/JoinedCarpoolsSection";
import { ClassScheduleSection } from "../components/profile/ClassScheduleSection";
import { ProfileInfoForm } from "../components/profile/ProfileInfoForm";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [favoriteDorms, setFavoriteDorms] = useState([]);
  const [favoritedListings, setFavoritedListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [joinedCarpools, setJoinedCarpools] = useState([]);
  
  // Redirect to home if not logged in
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      navigate('/');
    }
  }, [navigate]);

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
    let url = `/profile/${providerId}?from=profile`;
    if (finalListingId) {
      url += `&dormId=${finalListingId}`;
    }
    
    navigate(url);
  };
  
  // Get user data from localStorage
  const [userData, setUserData] = useState({
    firstName: localStorage.getItem('userFirstName') || '',
    lastName: localStorage.getItem('userLastName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    gender: localStorage.getItem('userGender') || '',
    role: localStorage.getItem('userRole') || '',
    country: localStorage.getItem('userCountry') || '',
    countryCode: localStorage.getItem('userCountryCode') || '',
    university: localStorage.getItem('userUniversity') || '',
    profilePicture: localStorage.getItem('userProfilePicture') || ''
  });

  const [editedData, setEditedData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Class schedule state for carpool users
  const [classSchedule, setClassSchedule] = useState(
    JSON.parse(localStorage.getItem('classSchedule') || '[]')
  );
  const [carpoolRegion] = useState(localStorage.getItem('carpoolRegion') || '');

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([...classSchedule]);

  // Schedule management helpers
  const scheduleHelpers = createScheduleHelpers(editedSchedule, setEditedSchedule);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    handleProfilePictureUpload(file, (result) => {
      setEditedData({ ...editedData, profilePicture: result });
    });
  };

  const removeProfilePicture = () => {
    removeProfilePictureHelper(setEditedData, editedData, 'profilePicture');
  };

  const handleSaveProfile = () => {
    // Validate required fields
    if (!editedData.firstName || !editedData.lastName || !editedData.gender || !editedData.country || !editedData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone number format
    const phoneValidation = validatePhoneByCountry(editedData.phone, editedData.country);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.error);
      return;
    }

    // Check if phone number is already in use by another account (mock validation)
    const currentUserPhone = localStorage.getItem('userPhone');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const phoneWithCode = `${editedData.countryCode}${editedData.phone}`;
    const phoneAlreadyExists = registeredUsers.some(user => 
      user.phone === phoneWithCode && user.phone !== `${userData.countryCode}${currentUserPhone}`
    );

    if (phoneAlreadyExists) {
      toast.error('This phone number is already linked to another account');
      return;
    }

    // Save to localStorage (editable fields)
    localStorage.setItem('userFirstName', editedData.firstName);
    localStorage.setItem('userLastName', editedData.lastName);
    localStorage.setItem('userName', `${editedData.firstName} ${editedData.lastName}`.trim());
    localStorage.setItem('userGender', editedData.gender);
    localStorage.setItem('userCountry', editedData.country);
    localStorage.setItem('userCountryCode', editedData.countryCode);
    localStorage.setItem('userPhone', editedData.phone);
    if (editedData.profilePicture) {
      localStorage.setItem('userProfilePicture', editedData.profilePicture);
    } else {
      localStorage.removeItem('userProfilePicture');
    }

    // Update registered users list with new phone
    const updatedUsers = registeredUsers.map(user => {
      if (user.email === userData.email) {
        return { ...user, phone: phoneWithCode, country: editedData.country };
      }
      return user;
    });
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setUserData({ ...editedData });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedData({ ...userData });
    setIsEditing(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Get stored password from localStorage
    const storedPassword = localStorage.getItem('userPassword');
    
    // Validate password change using helper
    const validation = validatePasswordChange(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword,
      storedPassword
    );
    
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // Save new password to localStorage
    localStorage.setItem('userPassword', passwordData.newPassword);
    
    toast.success('Password changed successfully!');
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleBack = () => {
    const userType = localStorage.getItem('userRole');
    navigateToDashboard(userType, navigate);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion.');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');

    // Frontend cleanup (mock implementation):
    
    // 1. Remove user from registered users list
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.filter(user => user.email !== userEmail);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // 2. Remove all roommate requests involving this user
    const roommateRequests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
    const updatedRoommateRequests = roommateRequests.filter(
      req => req.senderEmail !== userEmail && req.recipientEmail !== userEmail
    );
    localStorage.setItem('roommateRequests', JSON.stringify(updatedRoommateRequests));

    // 3. Remove all active roommates involving this user
    const activeRoommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
    const updatedActiveRoommates = activeRoommates.filter(
      rm => (rm.userEmail !== userEmail && rm.roommateEmail !== userEmail) &&
            (rm.user1Email !== userEmail && rm.user2Email !== userEmail)
    );
    localStorage.setItem('activeRoommates', JSON.stringify(updatedActiveRoommates));

    // Clear all current user data from localStorage
    localStorage.clear();
    
    // Restore the cleaned up data
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('roommateRequests', JSON.stringify(updatedRoommateRequests));
    localStorage.setItem('activeRoommates', JSON.stringify(updatedActiveRoommates));
    
    // Show confirmation message
    toast.success('Your account has been permanently deleted.');
    
    // Redirect to home page
    navigate('/');
  };

  // Migration: Split old userName into firstName and lastName if needed
  useEffect(() => {
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('userLastName');
    const oldUserName = localStorage.getItem('userName');
    
    // If we have an old userName but no firstName/lastName, split it
    if (oldUserName && !firstName && !lastName) {
      const nameParts = oldUserName.trim().split(' ');
      const newFirstName = nameParts[0] || '';
      const newLastName = nameParts.slice(1).join(' ') || '';
      
      localStorage.setItem('userFirstName', newFirstName);
      localStorage.setItem('userLastName', newLastName);
      
      setUserData(prev => ({
        ...prev,
        firstName: newFirstName,
        lastName: newLastName
      }));
      setEditedData(prev => ({
        ...prev,
        firstName: newFirstName,
        lastName: newLastName
      }));
    }
  }, []);

  // Load favorite dorms from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favoriteDorms');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        setFavoriteDorms(favoriteIds);
      }
    };

    loadFavorites();

    // Listen for changes to favorites (from dashboard or other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'favoriteDorms') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    window.addEventListener('favoritesUpdated', loadFavorites);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', loadFavorites);
    };
  }, []);

  // Load favorited listings when favorites change
  useEffect(() => {
    const userUniversity = userData.university || localStorage.getItem('userUniversity') || 'American University of Beirut (AUB)';
    setFavoritedListings(getFavoritedListings(userUniversity));
  }, [favoriteDorms, userData.university]);

  // Load joined carpools
  useEffect(() => {
    const loadJoinedCarpools = () => {
      const joinedRideIds = JSON.parse(localStorage.getItem('joinedCarpools') || '[]');
      const allCarpools = JSON.parse(localStorage.getItem('carpoolListings') || '[]');
      
      // Filter carpools to get only the ones the user has joined
      const joinedCarpoolsList = allCarpools.filter(carpool => 
        joinedRideIds.includes(carpool.id)
      );
      
      setJoinedCarpools(joinedCarpoolsList);
    };
    
    loadJoinedCarpools();
    
    // Listen for changes to joined carpools
    const handleStorageChange = (e) => {
      if (e.key === 'joinedCarpools' || e.key === 'carpoolListings') {
        loadJoinedCarpools();
      }
    };
    
    // Listen for custom event from other components
    const handleJoinedCarpoolsUpdate = () => {
      loadJoinedCarpools();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('joinedCarpoolsUpdated', handleJoinedCarpoolsUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('joinedCarpoolsUpdated', handleJoinedCarpoolsUpdate);
    };
  }, []);

  // Listen for class schedule updates from the component
  useEffect(() => {
    const handleScheduleUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('classSchedule') || '[]');
      setClassSchedule(updated);
      setEditedSchedule(updated);
    };
    
    window.addEventListener('classScheduleUpdated', handleScheduleUpdate);
    
    return () => {
      window.removeEventListener('classScheduleUpdated', handleScheduleUpdate);
    };
  }, []);

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

  const removeFavorite = (id) => {
    removeFavoriteHelper(id, favoriteDorms, setFavoriteDorms);
    
    // Close modal if open
    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }
  };

  const toggleSaved = (id) => {
    toggleFavorite(id, favoriteDorms, setFavoriteDorms);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav userName={`${userData.firstName} ${userData.lastName}`.trim()} userType={userData.role} />
      
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
                src={isEditing ? editedData.profilePicture : userData.profilePicture}
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
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">{getRoleDisplayName(userData.role)}</p>
              
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
        {userData.role === 'carpool' && (
          <ClassScheduleSection
            classSchedule={classSchedule}
            carpoolRegion={carpoolRegion}
            isEditingSchedule={isEditingSchedule}
            setIsEditingSchedule={setIsEditingSchedule}
            editedSchedule={editedSchedule}
            setEditedSchedule={setEditedSchedule}
            scheduleHelpers={scheduleHelpers}
          />
        )}

        {/* Joined Carpools Section - Only show for carpool users */}
        {userData.role === 'carpool' && (
          <JoinedCarpoolsSection joinedCarpools={joinedCarpools} />
        )}

        {/* Lifestyle Preferences Section - Only show for dorm_seeker and dorm_provider */}
        {userData.role !== 'carpool' && (
          <LifestylePreferencesSection navigate={navigate} />
        )}

        {/* My Roommates Section - Only show for dorm_seeker and dorm_provider */}
        {userData.role !== 'carpool' && (
          <RoommateSection />
        )}

        {/* Favorite Dorms Section - Only show for dorm_seeker */}
        {userData.role === 'dorm_seeker' && (
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
        />
      )}
    </div>
  );
}