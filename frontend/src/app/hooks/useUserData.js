import { useState, useEffect } from 'react';

/**
 * User Data Hook
 * Centralized hook for accessing user data from localStorage
 * Automatically updates when localStorage changes
 * 
 * @returns {object} User data object with all user fields
 */
export function useUserData() {
  const [userData, setUserData] = useState(() => getUserDataFromStorage());

  useEffect(() => {
    // Update user data when storage changes
    const handleStorageChange = () => {
      setUserData(getUserDataFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window updates
    window.addEventListener('userDataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleStorageChange);
    };
  }, []);

  return userData;
}

/**
 * Get all user data from localStorage
 */
function getUserDataFromStorage() {
  return {
    userId: localStorage.getItem('userId') || '',
    userName: localStorage.getItem('userName') || '',
    userEmail: localStorage.getItem('userEmail') || '',
    userRole: localStorage.getItem('userRole') || '',
    userPhone: localStorage.getItem('userPhone') || '',
    userCountryCode: localStorage.getItem('userCountryCode') || '',
    userCountry: localStorage.getItem('userCountry') || '',
    userGender: localStorage.getItem('userGender') || '',
    userProfilePicture: localStorage.getItem('userProfilePicture') || '',
    userUniversity: localStorage.getItem('userUniversity') || '',
    carpoolRegion: localStorage.getItem('carpoolRegion') || '',
    dormRegion: localStorage.getItem('dormRegion') || '',
    classSchedule: JSON.parse(localStorage.getItem('classSchedule') || '[]'),
}}