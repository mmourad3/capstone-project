import { useState, useEffect } from 'react';
import { UserPlus, Check, Ban } from 'lucide-react';
import { roommateAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function RequestRoommateButton({ user, dormId, onRequestSent, size = 'default' }) {
  const [requested, setRequested] = useState(false);
  const [hasActiveRoommate, setHasActiveRoommate] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  // Size variants
  const isCompact = size === 'compact';
  const widthClass = isCompact ? '' : 'w-full';
  const paddingClass = isCompact ? 'px-3 py-2' : 'px-4 py-2.5';
  const iconSize = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = isCompact ? 'text-sm' : 'text-sm sm:text-base';

  if (!user || !user.email) {
    return null;
  }

useEffect(() => {
  const loadStatus = async () => {
    try {
      const status = await roommateAPI.getStatus();

      setHasActiveRoommate(status.hasActiveRoommate);
      setHasPendingRequest(status.hasPendingRequest);

      if (
        status.pendingRequest &&
        status.pendingRequest.recipientId === user.id &&
        status.pendingRequest.dormId === dormId
      ) {
        setRequested(true);
      } else {
        setRequested(false);
      }
    } catch (error) {
      console.error("Failed to load roommate status", error);
    }
  };

  loadStatus();
}, [user.id, dormId]);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await roommateAPI.sendRequest({ recipientId: user.id, dormId });
      setRequested(true);
      setHasPendingRequest(true);
      toast.success(`Roommate request sent to ${user.name}!`);
      
      // Dispatch custom event to sync all button instances
      window.dispatchEvent(new CustomEvent('roommateRequestSent', { 
        detail: { recipientUserId: user.id } 
      }));
      window.dispatchEvent(new Event("roommateDataChanged"));
      
      onRequestSent?.();
    } catch (error) {
        toast.error(error.message || "Failed to send request");
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