import { useState, useEffect } from 'react';
import { Users, Check, X, UserMinus, MessageCircle, ExternalLink } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { toast } from 'react-toastify';
import RoommateFeedbackModal from './RoommateFeedbackModal';
import { useNavigate } from 'react-router';
import { openWhatsAppChat } from '../utils/whatsappUtils';
import { useAuth } from "../contexts/AuthContext";

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
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // NEW: Track sent requests
  const [activeRoommates, setActiveRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchRoommateData();
    // Listen for roommate data changes
    const handleDataChange = () => {
      fetchRoommateData();
    };
     const handleVisibilityChange = () => {
       if (!document.hidden) {
         fetchRoommateData();
       }
     };
    
window.addEventListener("roommateDataChanged", handleDataChange);
window.addEventListener("focus", handleDataChange);
document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("roommateDataChanged", handleDataChange);
    window.removeEventListener("focus", handleDataChange);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);


  const fetchRoommateData = async () => {
    setLoading(true);
    try {
      const [incoming, sent, roommates] = await Promise.all([
        roommateAPI.getIncomingRequests(),
        roommateAPI.getSentRequests(),
        roommateAPI.getActiveRoommates(),
      ]);

      setPendingRequests(incoming);
      setSentRequests(sent);
      setActiveRoommates(roommates);
    } catch (error) {
      toast.error("Failed to load roommate data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await roommateAPI.acceptRequest(requestId);
      toast.success("Roommate request accepted!");
      fetchRoommateData();
      window.dispatchEvent(new Event("roommateDataChanged"));
      window.dispatchEvent(new Event("roommateAccepted"));
    } catch (error) {
      toast.error(error.message || "Failed to accept request");
    }
  };

const handleRejectRequest = async (requestId) => {
  try {
    await roommateAPI.rejectRequest(requestId);
    toast.success("Request declined");
    fetchRoommateData();
    window.dispatchEvent(new Event("roommateDataChanged"));
  } catch (error) {
    toast.error(error.message || "Failed to reject request");
  }
};
  // NEW: Cancel sent request
  const handleCancelSentRequest = async (requestId) => {
    try {
      await roommateAPI.cancelRequest(requestId);
      toast.success("Request cancelled");
      fetchRoommateData();
      window.dispatchEvent(new Event("roommateDataChanged"));
    } catch (error) {
      toast.error(error.message || "Failed to cancel request");
    }
  };

  const handleEndRoommate = async (roommate) => {
    setSelectedRoommate(roommate);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    if (!selectedRoommate) return;

    try {
      await roommateAPI.endRelationship(selectedRoommate.id);
      await roommateAPI.submitFeedback(selectedRoommate.id, feedbackData);

      toast.success("Roommate relationship ended");
      setShowFeedbackModal(false);
      setSelectedRoommate(null);

      fetchRoommateData();
      window.dispatchEvent(new Event("roommateDataChanged"));
      window.dispatchEvent(new Event("roommateEnded"));
    } catch (error) {
      toast.error(error.message || "Failed to end roommate relationship");
    }
  };

  const handleContactWhatsApp = (roommate) => {
    const roommatePhone = roommate.roommatePhone;

    if (!roommatePhone) {
      toast.error("Could not retrieve phone number");
      return;
    }

    const cleanPhone = roommatePhone.replace(/\D/g, "");
    const currentUserName = `${user.firstName} ${user.lastName}`;
    const message = `Hi ${roommate.roommateName}! I'm ${currentUserName}, your roommate on UniMate.`;

    openWhatsAppChat(cleanPhone, message);
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
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              My Roommates
            </h2>
          </div>
        </div>

        {/* Pending Requests */}
        {user?.role === "dorm_provider" && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
              Pending Requests
            </h3>
            {pendingRequests.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <img
                        src={
                          request.senderPicture ||
                          "https://via.placeholder.com/40"
                        }
                        alt={request.senderName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                            {request.senderName}
                          </p>
                          <ViewProfileButton userId={request.senderUserId} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          wants to be your roommate
                        </p>
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
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  No pending roommate requests
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sent Requests*/}
        {sentRequests.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
              Sent Requests
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <img
                      src={
                        request.recipientPicture ||
                        "https://via.placeholder.com/40"
                      }
                      alt={request.recipientName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-words">
                          {request.recipientName}
                        </p>
                        <ViewProfileButton userId={request.recipientUserId} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        Request sent • Waiting for response
                      </p>
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
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Active Roommates
          </h3>
          {activeRoommates.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {activeRoommates.map((roommate) => {
                const roommateData = {
                  id: roommate.id,
                  name: roommate.roommateName,
                  email: roommate.roommateEmail,
                  userId: roommate.roommateUserId,
                  picture: roommate.roommatePicture,
                  phone: roommate.roommatePhone,
                };

                return (
                  <div
                    key={roommate.id}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <img
                          src={
                            roommateData.picture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={roommateData.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <p className="font-medium text-sm sm:text-base break-words text-gray-900 dark:text-white">
                              {roommateData.name}
                            </p>
                            <ViewProfileButton userId={roommateData.userId} />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Roommates since{" "}
                            {new Date(roommate.startedAt).toLocaleDateString()}
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No active roommates yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Connect with dorm providers to find your roommate!
              </p>
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