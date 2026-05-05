import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

/**
 * Role Protection Hook
 * Redirects users if they don't have the required role
 * 
 * @param {string} requiredRole - The role required to access this page ('dorm-seeker', 'dorm-provider', or 'carpool')
 * @param {object} options - Optional configuration
 * @param {string} options.errorMessage - Custom error message
 * @param {boolean} options.redirectHome - Redirect to home instead of correct dashboard
 */
export function useRoleProtection(requiredRole, options = {}) {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const { errorMessage, redirectHome = false } = options;
  

  useEffect(() => {
  if (loading) return;

  if (!isAuthenticated || !user) {
    navigate('/login', { replace: true });
    return;
  }

  const userRole = user.role;

  if (userRole !== requiredRole) {
    const message =
      errorMessage || `Only ${getRoleDisplayName(requiredRole)} can access this page.`;

    toast.error(message);

    if (redirectHome) {
      navigate('/', { replace: true });
    } else {
      navigate(getDashboardPath(userRole), { replace: true });
    }
  }
}, [navigate, requiredRole, errorMessage, redirectHome, user, loading, isAuthenticated]);
}

/**
 * Get role display name for error messages
 */
function getRoleDisplayName(role) {
  const roleNames = {
    'dorm_seeker': 'dorm seekers',
    'dorm_provider': 'dorm providers',
    'carpool': 'carpool users'
  };
  return roleNames[role] || 'authorized users';
}

/**
 * Get dashboard path for role
 */
function getDashboardPath(role) {
  const paths = {
    'dorm_seeker': '/dashboard/dorm-seeker',
    'dorm_provider': '/dashboard/dorm-provider',
    'carpool': '/dashboard/carpool'
  };
  return paths[role] || '/';
}
