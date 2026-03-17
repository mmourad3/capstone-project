/**
 * Navigation utilities
 * Shared across multiple components for role-based navigation
 */

/**
 * Navigates to the appropriate dashboard based on user role
 * @param {string} role - User role ('dorm-seeker', 'dorm-provider', or 'carpool')
 * @param {Function} navigate - React Router navigate function
 */
export const navigateToDashboard = (role, navigate) => {
  if (role === 'dorm-seeker') {
    navigate('/dashboard/dorm-seeker');
  } else if (role === 'dorm-provider') {
    navigate('/dashboard/dorm-provider');
  } else if (role === 'carpool') {
    navigate('/dashboard/carpool');
  } else {
    navigate('/');
  }
};

/**
 * Gets the display name for a user role
 * @param {string} role - User role
 * @returns {string} Human-readable role name
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'dorm-seeker':
      return 'Student looking for dorm';
    case 'dorm-provider':
      return 'Student offering dorm';
    case 'carpool':
      return 'Student looking for carpool';
    default:
      return role;
  }
};

/**
 * Gets the dashboard path for a given role
 * @param {string} role - User role
 * @returns {string} Dashboard path
 */
export const getDashboardPath = (role) => {
  switch (role) {
    case 'dorm-seeker':
      return '/dashboard/dorm-seeker';
    case 'dorm-provider':
      return '/dashboard/dorm-provider';
    case 'carpool':
      return '/dashboard/carpool';
    default:
      return '/';
  }
};
