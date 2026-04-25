/**
 * Navigation utilities
 * Shared across multiple components for role-based navigation
 */

export const getDashboardPath = (role) => {
  switch (role) {
    case "dorm_seeker":
      return "/dashboard/dorm-seeker";

    case "dorm_provider":
      return "/dashboard/dorm-provider";

    case "carpool":
      return "/dashboard/carpool";

    default:
      return "/";
  }
};

export const navigateToDashboard = (role, navigate) => {
  navigate(getDashboardPath(role));
};

export const getRoleDisplayName = (role) => {
  switch (role) {
    case "dorm_seeker":
      return "Student looking for dorm";

    case "dorm_provider":
      return "Student offering dorm";

    case "carpool":
      return "Student looking for carpool";

    default:
      return role;
  }
};
