import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role || localStorage.getItem('userRole');
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user's actual role
      if (userRole === 'dorm_seeker') {
        return <Navigate to="/dashboard/dorm-seeker" replace />;
      } else if (userRole === 'dorm_provider') {
        return <Navigate to="/dashboard/dorm-provider" replace />;
      } else if (userRole === 'carpool') {
        return <Navigate to="/dashboard/carpool" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
}