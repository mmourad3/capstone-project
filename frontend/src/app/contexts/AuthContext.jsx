import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      // Build user data from localStorage (no backend calls)
      const userData = {
        id: userId,
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        role: localStorage.getItem('userRole') || '',
        profilePicture: localStorage.getItem('userProfilePicture') || '',
        phone: localStorage.getItem('userPhone') || '',
        university: localStorage.getItem('userUniversity') || '',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, clear it
      logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // localStorage-only login (no backend)
    // This is handled in Login.jsx directly
    return { success: true };
  };

  const register = async (userData) => {
    // localStorage-only registration (no backend)
    // This is handled in SignUp.jsx directly
    return { success: true };
  };

  const logout = () => {
    // Call api.logout() to handle all localStorage cleanup (including legacy data)
    authAPI.logout();
    
    // Update React state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
    // Update localStorage as well
    if (userData.name) localStorage.setItem('userName', userData.name);
    if (userData.email) localStorage.setItem('userEmail', userData.email);
    if (userData.profilePicture) localStorage.setItem('userProfilePicture', userData.profilePicture);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}