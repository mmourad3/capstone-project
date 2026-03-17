import { useState, useEffect } from 'react';
import { UserPlus, Check, Clock, Ban } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function RequestRoommateButton({ user, onRequestSent, size = 'default' }) {
  const [requested, setRequested] = useState(false);
  const [hasActiveRoommate, setHasActiveRoommate] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false); // 🆕 Any pending request, not just to this user
  const [loading, setLoading] = useState(false);

  // Size variants
  const isCompact = size === 'compact';
  const widthClass = isCompact ? '' : 'w-full';
  const paddingClass = isCompact ? 'px-3 py-2' : 'px-4 py-2.5';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = isCompact ? 'text-sm' : 'text-sm sm:text-base';

  // Safety check: if no user prop provided, don't render
  if (!user || !user.email) {
    return null;
  }

  // Check if request was already sent on mount
  useEffect(() => {
    const checkRequestStatus = () => {
      const currentUserId = localStorage.getItem('userId');
      const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
      
      // Check if current user already sent a request to THIS specific user
      const existingRequest = requests.find(
        req => req.senderUserId === currentUserId && req.recipientUserId === user.id && req.status === 'pending'
      );
      
      if (existingRequest) {
        setRequested(true);
      }
      
      // 🆕 Check if user has ANY pending sent request (to anyone)
      const anyPendingRequest = requests.find(
        req => req.senderUserId === currentUserId && req.status === 'pending'
      );
      
      if (anyPendingRequest) {
        setHasPendingRequest(true);
      } else {
        setHasPendingRequest(false);
      }
      
      // Check if user already has an active roommate
      const roommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
      const activeRoommate = roommates.find(
        rm => rm.userId === currentUserId && rm.status === 'active'
      );
      
      if (activeRoommate) {
        setHasActiveRoommate(true);
      } else {
        setHasActiveRoommate(false);
      }
    };

    checkRequestStatus();

    // Listen for custom event to sync state across all button instances
    const handleRequestSync = (e) => {
      if (e.detail.recipientUserId === user.id) {
        setRequested(true);
      }
    };
    
    // Listen for roommate data changes (accept/end/cancel)
    const handleDataChange = () => {
      checkRequestStatus();
    };

    window.addEventListener('roommateRequestSent', handleRequestSync);
    window.addEventListener('roommateDataChanged', handleDataChange);

    return () => {
      window.removeEventListener('roommateRequestSent', handleRequestSync);
      window.removeEventListener('roommateDataChanged', handleDataChange);
    };
  }, [user.email]);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await roommateAPI.sendRequest(user.id);
      setRequested(true);
      toast.success(`Roommate request sent to ${user.name}!`);
      
      // Dispatch custom event to sync all button instances
      window.dispatchEvent(new CustomEvent('roommateRequestSent', { 
        detail: { recipientUserId: user.id } 
      }));
      
      onRequestSent?.();
    } catch (error) {
      // Demo mode - save to localStorage
      const currentUser = {
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
        picture: localStorage.getItem('userProfilePicture')
      };

      // REMOVED: No longer end current roommate relationship when sending new request
      // Users can now have multiple pending requests at the same time

      const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
      
      // Check if request already exists (safety check)
      const currentUserId = localStorage.getItem('userId');
      const existingRequest = requests.find(
        req => req.senderUserId === currentUserId && 
               req.recipientUserId === user.id && 
               req.status === 'pending'
      );
      
      if (existingRequest) {
        toast.info(`You already sent a request to ${user.name}!`);
        setRequested(true);
        setLoading(false);
        return;
      }
      
      requests.push({
        id: Date.now(),
        senderEmail: currentUser.email,
        senderName: currentUser.name,
        senderPicture: currentUser.picture,
        senderUserId: localStorage.getItem('userId'), // Add userId
        recipientEmail: user.email,
        recipientName: user.name,
        recipientPicture: user.picture,
        recipientUserId: user.id, // Add recipient userId
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('roommateRequests', JSON.stringify(requests));
      
      setRequested(true);
      toast.success(`Roommate request sent to ${user.name}!`);
      
      // Dispatch custom event to sync all button instances
      window.dispatchEvent(new CustomEvent('roommateRequestSent', { 
        detail: { recipientUserId: user.id } 
      }));
      
      // Trigger roommate section refresh
      window.dispatchEvent(new Event('roommateDataChanged'));
      
      onRequestSent?.();
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 ${paddingClass} bg-green-50 text-green-700 rounded-lg border border-green-200 cursor-not-allowed ${widthClass}`}
      >
        <Check className={iconSize} />
        <span className={`font-medium ${textSize}`}>Request Sent</span>
      </button>
    );
  }

  if (hasActiveRoommate) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 ${paddingClass} bg-gray-50 text-gray-700 rounded-lg border border-gray-200 cursor-not-allowed ${widthClass}`}
      >
        <Check className={iconSize} />
        <span className={`font-medium ${textSize}`}>Active Roommate</span>
      </button>
    );
  }

  if (hasPendingRequest) {
    return (
      <>
        <button
          disabled
          className={`flex items-center justify-center gap-2 ${paddingClass} bg-orange-50 text-orange-700 rounded-lg border-2 border-orange-300 cursor-not-allowed ${widthClass}`}
          title="You already have a pending request. Cancel it first to send another."
        >
          <Ban className={iconSize} />
          <span className={`font-medium ${textSize}`}>Cannot Send Request</span>
        </button>
      </>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className={`flex items-center justify-center gap-2 ${paddingClass} bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer ${widthClass}`}
    >
      <UserPlus className={iconSize} />
      <span className={textSize}>{loading ? 'Sending...' : 'Request as Roommate'}</span>
    </button>
  );
}