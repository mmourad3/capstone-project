import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearAuthStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfilePicture");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userUniversity");
    localStorage.removeItem("userGender");
  };

  const saveUserToStorage = (freshUser) => {
    const fullName =
      freshUser.name ||
      `${freshUser.firstName || ""} ${freshUser.lastName || ""}`.trim();

    localStorage.setItem("userId", freshUser.id);
    localStorage.setItem("userName", fullName);
    localStorage.setItem("userEmail", freshUser.email || "");
    localStorage.setItem("userRole", freshUser.role || "");
    localStorage.setItem("userProfilePicture", freshUser.profilePicture || "");
    localStorage.setItem("userPhone", freshUser.phone || "");
    localStorage.setItem("userUniversity", freshUser.university || "");
    localStorage.setItem("userGender", freshUser.gender || "");
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const freshUser = await authAPI.getMe();

      const normalizedUser = {
        ...freshUser,
        name:
          freshUser.name ||
          `${freshUser.firstName || ""} ${freshUser.lastName || ""}`.trim(),
      };

      saveUserToStorage(normalizedUser);
      setUser(normalizedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error);

      clearAuthStorage();
      setUser(null);
      setIsAuthenticated(false);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    return authAPI.login(email, password);
  };

  const register = async (userData) => {
    return authAPI.register(userData);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...userData };
      saveUserToStorage(updatedUser);
      return updatedUser;
    });
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
