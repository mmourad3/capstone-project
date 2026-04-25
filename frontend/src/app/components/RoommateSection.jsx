import { useState, useEffect } from 'react';
import { Users, Check, X, UserMinus, MessageCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { toast } from 'react-toastify';
import RoommateFeedbackModal from './RoommateFeedbackModal';
import { getPersonQualities } from '../utils/qualityMatcher';
import { useNavigate } from 'react-router';
import { openWhatsAppChat } from '../utils/whatsappUtils';
import { DEMO_USERS, DEMO_QUESTIONNAIRES } from '../data/demoData';
import { filterDormSeekersByGender } from '../utils/genderFilterHelpers';

// Reusable View Profile Button Component
function ViewProfileButton({ userId, from = 'profile', dormId = null, className = "" }) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => {
        if (!userId) {
          toast.error('User ID not available');
          return;
        }
        // Build URL with context parameters
        let url = `/profile/${userId}?from=${from}`;
        if (dormId) {
          url += `&dormId=${dormId}`;
        }
        navigate(url);
      }}
      className={`text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs flex items-center gap-1 cursor-pointer ${className}`}
      title="View Profile"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      View Profile
    </button>
  );
}

// Component for managing roommate relationships
export default function RoommateSection() {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // NEW: Track sent requests
  const [activeRoommates, setActiveRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); // NEW: Track user role
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    // Get current user role
    const userRole = localStorage.getItem('userRole');
    setCurrentUserRole(userRole);
    
    fetchRoommateData();
    
    // Check for pending feedback on mount
    checkPendingFeedback();
    
    // Listen for roommate data changes
    const handleDataChange = () => {
      fetchRoommateData();
    };
    
    window.addEventListener('roommateDataChanged', handleDataChange);
    
    return () => {
      window.removeEventListener('roommateDataChanged', handleDataChange);
    };
  }, []);

  const checkPendingFeedback = () => {
    // DEMO MODE - DELETE WHEN INTEGRATING BACKEND - START
    const currentUserEmail = localStorage.getItem('userEmail');
    const pendingFeedback = JSON.parse(localStorage.getItem('pendingFeedback') || '[]');
    
    // Check if current user has pending feedback
    const myPendingFeedback = pendingFeedback.find(fb => fb.email === currentUserEmail);
    
    if (myPendingFeedback) {
      // Remove from pending feedback
      const updated = pendingFeedback.filter(fb => fb.email !== currentUserEmail);
      localStorage.setItem('pendingFeedback', JSON.stringify(updated));
      
      // Show feedback modal
      setSelectedRoommate({
        id: Date.now(),
        name: myPendingFeedback.oldRoommateName,
        email: myPendingFeedback.oldRoommateEmail,
        picture: null
      });
      setShowFeedbackModal(true);
      
      toast.info(`${myPendingFeedback.removedBy} is no longer your roommate. Please provide feedback.`);
    }
    // DEMO MODE - DELETE WHEN INTEGRATING BACKEND - END
  };

  // Helper function to check if user account still exists
  const isUserDeleted = (userId) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return !registeredUsers.some(user => user.userId === userId);
  };

  const fetchRoommateData = async () => {
    setLoading(true);
    try {
      // Try API first
      const [requests, roommates] = await Promise.all([
        roommateAPI.getPendingRequests(),
        roommateAPI.getActiveRoommates()
      ]);
      setPendingRequests(requests);
      setActiveRoommates(roommates);
    } catch (error) {
      // Fallback to localStorage demo mode
      const storedRequests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
      const storedRoommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
      const currentUserId = localStorage.getItem('userId');
      
      // Filter requests that are for current user and pending (INCOMING requests)
      // Remove requests from deleted users
      const myRequests = storedRequests.filter(
        req => req.recipientUserId === currentUserId && req.status === 'pending' && !isUserDeleted(req.senderUserId)
      );
      
      // Filter requests SENT BY current user (OUTGOING requests)
      // Remove requests to deleted users
      const mySentRequests = storedRequests.filter(
        req => req.senderUserId === currentUserId && req.status === 'pending' && !isUserDeleted(req.recipientUserId)
      );
      
      // Filter active roommates for current user (supports both old and new structure)
      const myRoommates = storedRoommates.filter(
        rm => rm.userId === currentUserId && rm.status === 'active'
      );
      
      setPendingRequests(myRequests);
      setSentRequests(mySentRequests); // NEW: Set sent requests
      setActiveRoommates(myRoommates);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await roommateAPI.acceptRequest(requestId);
      toast.success('Roommate request accepted!');
      fetchRoommateData();
    } catch (error) {
      // Demo mode
      const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
      const request = requests.find(r => r.id === requestId);
      
      if (request) {
        const currentUserId = localStorage.getItem('userId');
        const currentUserEmail = localStorage.getItem('userEmail');
        const currentUserName = localStorage.getItem('userName');
        const currentUserType = localStorage.getItem('userRole');

        // Check if user already has an active roommate (use userId for filtering)
        const roommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
        const existingRoommate = roommates.find(
          rm => rm.userId === currentUserId && rm.status === 'active'
        );

        if (existingRoommate) {
          // End current roommate relationship
          const updatedRoommates = roommates.filter(
            rm => !(rm.userId === currentUserId && rm.status === 'active')
          );
          localStorage.setItem('activeRoommates', JSON.stringify(updatedRoommates));

          // Mark the old roommate for feedback
          const pendingFeedback = JSON.parse(localStorage.getItem('pendingFeedback') || '[]');
          
          // Extract old roommate info (supports both structures)
          let oldRoommateEmail, oldRoommateName;
          if (existingRoommate.userEmail && existingRoommate.roommateEmail) {
            // New structure
            oldRoommateEmail = existingRoommate.userEmail === currentUserEmail 
              ? existingRoommate.roommateEmail 
              : existingRoommate.userEmail;
            oldRoommateName = existingRoommate.userEmail === currentUserEmail
              ? existingRoommate.roommateName
              : existingRoommate.userName;
          } else {
            // Old structure
            oldRoommateEmail = existingRoommate.user1Email === currentUserEmail 
              ? existingRoommate.user2Email 
              : existingRoommate.user1Email;
            oldRoommateName = existingRoommate.user1Email === currentUserEmail
              ? existingRoommate.user2Name
              : existingRoommate.user1Name;
          }

          pendingFeedback.push({
            email: oldRoommateEmail,
            removedBy: currentUserName,
            removedByEmail: currentUserEmail,
            oldRoommateName: currentUserName,
            oldRoommateEmail: currentUserEmail,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('pendingFeedback', JSON.stringify(pendingFeedback));

          toast.info(`You're no longer roommates with ${oldRoommateName}. Accepting new request...`);
        }
        
        // CANCEL ALL OTHER PENDING REQUESTS (both incoming and outgoing)
        const updatedRequests = requests.filter(r => 
          // Keep only non-pending requests or requests not involving current user
          r.status !== 'pending' || 
          (r.recipientUserId !== currentUserId && r.senderUserId !== currentUserId)
        );
        localStorage.setItem('roommateRequests', JSON.stringify(updatedRequests));
        
        // Add to active roommates - CREATE TWO ENTRIES (one for each user)
        const newRoommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
        
        // Entry 1: Provider's view (current user = provider)
        newRoommates.push({
          id: Date.now(),
          userEmail: currentUserEmail,
          userId: localStorage.getItem('userId'),
          userName: currentUserName,
          userPicture: localStorage.getItem('userProfilePicture'),
          roommateEmail: request.senderEmail,
          roommateUserId: request.senderUserId,
          roommateName: request.senderName,
          roommatePicture: request.senderPicture,
          status: 'active',
          startedAt: new Date().toISOString()
        });
        
        // Entry 2: Seeker's view (current user = seeker)
        newRoommates.push({
          id: Date.now() + 1, // Different ID
          userEmail: request.senderEmail,
          userId: request.senderUserId,
          userName: request.senderName,
          userPicture: request.senderPicture,
          roommateEmail: currentUserEmail,
          roommateUserId: localStorage.getItem('userId'),
          roommateName: currentUserName,
          roommatePicture: localStorage.getItem('userProfilePicture'),
          status: 'active',
          startedAt: new Date().toISOString()
        });
        
        localStorage.setItem('activeRoommates', JSON.stringify(newRoommates));

        // AUTOMATIC STATUS UPDATE: If provider accepts seeker's request, update dorm to "Found Roommate"
        if (currentUserType === 'dorm_provider') {
          const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
          
          const updatedDorms = postedDorms.map(dorm => {
            // Change ONLY the provider's Active dorm to "Found Roommate" (use posterId for backend readiness)
            if (dorm.status === 'Active' && dorm.posterId === currentUserId) {
              return { ...dorm, status: 'Found Roommate' };
            }
            return dorm;
          });
          
          localStorage.setItem('postedDorms', JSON.stringify(updatedDorms));
          
          // Dispatch event to notify DormProviderDashboard to reload
          window.dispatchEvent(new Event('roommateAccepted'));
          
          toast.info('Your active dorm listing has been marked as "Found Roommate"');
        }
        
        toast.success('Roommate request accepted!');
        fetchRoommateData();
        
        // Dispatch event to refresh button states everywhere
        window.dispatchEvent(new Event('roommateDataChanged'));
      }
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Demo mode - localStorage only
    const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
    const request = requests.find(r => r.id === requestId);
    
    // Remove from both provider AND seeker's views
    const updatedRequests = requests.filter(r => r.id !== requestId);
    localStorage.setItem('roommateRequests', JSON.stringify(updatedRequests));
    
    if (request) {
      toast.success(`Request from ${request.senderName} declined and removed from their view`);
    } else {
      toast.success('Roommate request declined');
    }
    fetchRoommateData();
    
    // Dispatch event to refresh button states everywhere
    window.dispatchEvent(new Event('roommateDataChanged'));
  };

  // NEW: Cancel sent request
  const handleCancelSentRequest = async (requestId) => {
    try {
      await roommateAPI.cancelRequest(requestId);
      toast.success('Request cancelled');
      fetchRoommateData();
    } catch (error) {
      // Demo mode
      const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
      const updatedRequests = requests.filter(r => r.id !== requestId);
      localStorage.setItem('roommateRequests', JSON.stringify(updatedRequests));
      toast.success('Request cancelled');
      fetchRoommateData();
      
      // Dispatch event to refresh button states
      window.dispatchEvent(new Event('roommateDataChanged'));
    }
  };

  const handleEndRoommate = async (roommate) => {
    setSelectedRoommate(roommate);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedRoommate) return;
    
    const roommate = selectedRoommate;
    
    try {
      await roommateAPI.endRelationship(roommate.id);
      fetchRoommateData();
    } catch (error) {
      // Demo mode - mark as inactive and show feedback
      const currentUserEmail = localStorage.getItem('userEmail');
      const currentUserType = localStorage.getItem('userRole'); // Changed from 'userType' to 'userRole'
      
      const roommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
      const updated = roommates.map(rm => 
        rm.id === roommate.id 
          ? { ...rm, status: 'ended', endedAt: new Date().toISOString() }
          : rm
      );
      localStorage.setItem('activeRoommates', JSON.stringify(updated));
      
      // AUTOMATIC STATUS UPDATE: When roommate relationship ends, set dorm to "Inactive"
      // Check if current user is provider OR if their roommate is provider
      const currentUserId = localStorage.getItem('userId');
      const roommateUserId = roommate.userEmail === currentUserEmail 
        ? roommate.roommateUserId 
        : roommate.userId;
      
      // Get the provider's userId (could be current user or their roommate)
      const providerUserId = currentUserType === 'dorm_provider' ? currentUserId : roommateUserId;
      
      // Update dorm status to Inactive (use posterId for backend readiness)
      const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
      const updatedDorms = postedDorms.map(dorm => {
        // Find the dorm that has "Found Roommate" status and belongs to the provider
        if (dorm.status === 'Found Roommate' && dorm.posterId === providerUserId) {
          return { ...dorm, status: 'Inactive' };
        }
        return dorm;
      });
      localStorage.setItem('postedDorms', JSON.stringify(updatedDorms));
      
      // Dispatch event to notify dashboards to reload
      window.dispatchEvent(new Event('roommateEnded'));
      
      toast.info('The dorm listing has been set to Inactive. Provider can reactivate it if needed.');
      fetchRoommateData();
    }
  };

  const handleContactWhatsApp = async (roommate) => {
    // Get roommate's email and name
    const currentUserEmail = localStorage.getItem('userEmail');
    const currentUserName = localStorage.getItem('userName');
    
    const roommateEmail = roommate.userEmail === currentUserEmail 
      ? roommate.roommateEmail 
      : roommate.userEmail;
    
    const roommateName = roommate.userEmail === currentUserEmail
      ? roommate.roommateName
      : roommate.userName;
    
    try {
      // TODO: Uncomment when backend is ready
      // const response = await fetch(`/api/users/${roommateEmail}/phone`);
      // const data = await response.json();
      // const roommatePhone = data.phone;
      
      // DEMO MODE - DELETE WHEN INTEGRATING BACKEND - START
      // Get phone number from localStorage (in demo mode)
      const roommatePhone = localStorage.getItem(`phone_${roommateEmail}`) || '96171234567'; // Default Lebanese number for demo
      // DEMO MODE - DELETE WHEN INTEGRATING BACKEND - END
      
      // Remove any non-digit characters from phone number
      const cleanPhone = roommatePhone.replace(/\D/g, '');
      
      // Create message about being roommates
      const message = `Hi ${roommateName}! I'm ${currentUserName}, your roommate. I accepted your request and we're now connected on UniMate. Looking forward to being roommates!`;
      
      // Open WhatsApp chat with the message
      openWhatsAppChat(cleanPhone, message);
    } catch (error) {
      console.error('Error fetching phone number:', error);
      toast.error('Could not retrieve phone number');
    }
  };

  // NEW: Handle view profile for sent requests
  const handleViewProfile = (request) => {
    // Navigate to the full profile page using ONLY userId
    if (!request.recipientUserId) {
      toast.error('User ID not available');
      return;
    }
    navigate(`/profile/${request.recipientUserId}?from=profile`);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">My Roommates</h2>
          </div>
          {/* DEMO MODE - DELETE WHEN INTEGRATING BACKEND - START */}
          {/* Demo Mode Button - ONLY for providers with active listings */}
          {currentUserRole === 'dorm_provider' && (() => {
            // Check if provider has an active listing (use posterId for backend readiness)
            const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
            const currentUserId = localStorage.getItem('userId');
            const hasActiveListing = postedDorms.some(dorm => 
              dorm.posterId === currentUserId && dorm.status === 'Active'
            );
            
            return hasActiveListing && (
              <button
                onClick={() => {
                  // Get current user's active dorm to check gender preference
                  const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
                  const currentUserId = localStorage.getItem('userId');
                  const currentUserGender = localStorage.getItem('userGender');
                  
                  // Find the provider's active dorm
                  const activeDorm = postedDorms.find(dorm => 
                    dorm.posterId === currentUserId && dorm.status === 'Active'
                  );
                  
                  if (!activeDorm) {
                    toast.error('No active dorm listing found');
                    return;
                  }
                  
                  // Use gender filter helper to get appropriate demo users
                  const filteredDemoUsers = filterDormSeekersByGender(
                    activeDorm.genderPreference, 
                    currentUserGender
                  );
                  
                  // Get existing requests to find which demo users are already used
                  const existingRequests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
                  const usedEmails = existingRequests.map(req => req.senderEmail);
                  
                  // Find a demo user that hasn't been used yet (from filtered list)
                  const availableUser = filteredDemoUsers.find(user => !usedEmails.includes(user.email));
                  
                  if (!availableUser) {
                    toast.info('All matching demo users already added! Clear some requests first.');
                    return;
                  }
                  
                  const demoRequest = {
                    id: Date.now(),
                    senderName: availableUser.name,
                    senderEmail: availableUser.email,
                    senderUserId: availableUser.userId,
                    senderPicture: availableUser.profilePicture,
                    recipientEmail: localStorage.getItem('userEmail'),
                    recipientUserId: localStorage.getItem('userId'),
                    status: 'pending',
                    createdAt: new Date().toISOString()
                  };
                  
                  // Make sure demo user exists in registeredUsers
                  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                  const demoUserExists = registeredUsers.some(user => user.email === availableUser.email);
                  
                  if (!demoUserExists) {
                    registeredUsers.push({
                      email: availableUser.email,
                      userId: availableUser.userId,
                      name: availableUser.name,
                      phone: availableUser.phone,
                      country: availableUser.country,
                      gender: availableUser.gender,
                      role: availableUser.role || 'dorm_seeker', // Add role
                      profilePicture: availableUser.profilePicture
                    });
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                  }
                  
                  // ALWAYS store questionnaire data for this user (in case it wasn't stored before)
                  const q = DEMO_QUESTIONNAIRES[availableUser.userId];
                  if (q) {
                    const questionnaireKey = `user_${availableUser.userId}_questionnaire`;
                    localStorage.setItem(questionnaireKey, JSON.stringify(q));
                    
                    const completedKey = `user_${availableUser.userId}_questionnaire_completed`;
                    localStorage.setItem(completedKey, 'true');
                  }
                  
                  // Add the new request
                  existingRequests.push(demoRequest);
                  localStorage.setItem('roommateRequests', JSON.stringify(existingRequests));
                  
                  fetchRoommateData();
                  toast.info(`Demo request from ${availableUser.name} added!`);
                }}
                className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors self-start sm:self-auto"
              >
                + Add Demo Request
              </button>
            );
          })()}
          {/* DEMO MODE - DELETE WHEN INTEGRATING BACKEND - END */}
        </div>

        {/* Pending Requests */}
        {/* Only show for PROVIDERS - seekers don't receive requests */}
        {currentUserRole === 'dorm_provider' && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Pending Requests</h3>
            {pendingRequests.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <img
                        src={request.senderPicture || 'https://via.placeholder.com/40'}
                        alt={request.senderName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">{request.senderName}</p>
                          <ViewProfileButton userId={request.senderUserId} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">wants to be your roommate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 sm:flex-initial sm:min-w-[44px] p-2.5 sm:p-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                        title="Accept"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 sm:flex-initial sm:min-w-[44px] p-2.5 sm:p-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                        title="Decline"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">No pending roommate requests</p>
              </div>
            )}
          </div>
        )}

        {/* Sent Requests - NEW */}
        {sentRequests.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Sent Requests</h3>
            <div className="space-y-2 sm:space-y-3">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <img
                      src={request.recipientPicture || 'https://via.placeholder.com/40'}
                      alt={request.recipientName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">{request.recipientName}</p>
                        <ViewProfileButton userId={request.recipientUserId} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Request sent • Waiting for response</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelSentRequest(request.id)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    Cancel Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Roommates */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Active Roommates</h3>
          {activeRoommates.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {activeRoommates.map((roommate) => {
                const currentUserEmail = localStorage.getItem('userEmail');
                
                // Support both old and new structure
                let roommateData;
                if (roommate.userEmail && roommate.roommateEmail) {
                  // New structure
                  roommateData = {
                    id: roommate.id,
                    name: roommate.userEmail === currentUserEmail ? roommate.roommateName : roommate.userName,
                    email: roommate.userEmail === currentUserEmail ? roommate.roommateEmail : roommate.userEmail,
                    userId: roommate.userEmail === currentUserEmail ? roommate.roommateUserId : roommate.userId,
                    picture: roommate.userEmail === currentUserEmail ? roommate.roommatePicture : roommate.userPicture
                  };
                } else {
                  // Old structure
                  const isUser1 = roommate.user1Email === currentUserEmail;
                  roommateData = {
                    id: roommate.id,
                    name: isUser1 ? roommate.user2Name : roommate.user1Name,
                    email: isUser1 ? roommate.user2Email : roommate.user1Email,
                    userId: null, // Old structure doesn't have userId
                    picture: isUser1 ? roommate.user2Picture : roommate.user1Picture
                  };
                }

                // Check if roommate's account has been deleted
                const accountDeleted = isUserDeleted(roommateData.userId);

                return (
                  <div
                    key={roommate.id}
                    className={`bg-gray-50 dark:bg-gray-700 border rounded-xl p-3 sm:p-4 ${accountDeleted ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30' : 'border-gray-200 dark:border-gray-600'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <img
                          src={roommateData.picture || 'https://via.placeholder.com/40'}
                          alt={roommateData.name}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 flex-shrink-0 ${accountDeleted ? 'border-gray-400 dark:border-gray-500 opacity-50' : 'border-white dark:border-gray-600'}`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <p className={`font-medium text-sm sm:text-base break-words ${accountDeleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                              {accountDeleted ? 'Account Deleted' : roommateData.name}
                            </p>
                            {!accountDeleted && (
                              <ViewProfileButton userId={roommateData.userId} />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {accountDeleted 
                              ? 'This user has deleted their account' 
                              : `Roommates since ${new Date(roommate.startedAt).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleContactWhatsApp(roommate)}
                          className="flex-1 sm:flex-none p-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center"
                          title="Contact on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleEndRoommate(roommateData)}
                          className="flex-1 sm:flex-none p-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center"
                          title="End Roommate"
                        >
                          <UserMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Show roommate's qualities based on their questionnaire */}
                    {(() => {
                      // Helper to get questionnaire field with fallback
                      const getField = (field) => localStorage.getItem(`q_${field}_${roommateData.email}`) || localStorage.getItem(`q_${field}`) || '';

                      // Get roommate's questionnaire data
                      const roommateQuestionnaire = {
                        cleanliness: getField('cleanliness'),
                        organizationLevel: getField('organizationLevel'),
                        socialLevel: getField('socialLevel'),
                        noiseLevel: getField('noiseLevel')
                      };

                      // Get derived qualities from their answers
                      const roommateQualities = getPersonQualities(roommateQuestionnaire);
                      
                      // Get their self-reported personal qualities
                      const roommatePersonalQualities = getField('personalQualities')
                        ? getField('personalQualities').split(',')
                        : [];
                      
                      // Combine both derived AND self-reported qualities
                      const allRoommateQualities = [...roommateQualities, ...roommatePersonalQualities];
                      
                      // Get current user's important qualities from user-scoped storage
                      const getCurrentUserQuestionnaire = () => {
                        const userId = localStorage.getItem('userId');
                        if (!userId) return null;
                        const key = `user_${userId}_questionnaire`;
                        const data = localStorage.getItem(key);
                        return data ? JSON.parse(data) : null;
                      };
                      
                      const currentUserQuestionnaire = getCurrentUserQuestionnaire();
                      const yourImportantQualities = currentUserQuestionnaire?.importantQualities || [];

                      // Find which of YOUR important qualities they have (from both sources)
                      const matchedQualities = allRoommateQualities.filter(q => yourImportantQualities.includes(q));

                      if (matchedQualities.length > 0) {
                        return (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Has qualities you value:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {matchedQualities.map((quality) => (
                                <span key={quality} className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {quality}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active roommates yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Connect with dorm providers to find your roommate!</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedRoommate && (
        <RoommateFeedbackModal
          roommate={selectedRoommate}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedRoommate(null);
          }}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </>
  );
}