import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

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
  const { errorMessage, redirectHome = false } = options;

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');

    // If not logged in, redirect to home
    if (!userRole) {
      navigate('/', { replace: true });
      return;
    }

    // If user has wrong role, show error and redirect
    if (userRole !== requiredRole) {
      const message = errorMessage || `Only ${getRoleDisplayName(requiredRole)} can access this page.`;
      toast.error(message);

      if (redirectHome) {
        navigate('/', { replace: true });
      } else {
        // Redirect to correct dashboard based on user's actual role
        const dashboardPath = getDashboardPath(userRole);
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [navigate, requiredRole, errorMessage, redirectHome]);
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
