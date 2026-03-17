import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getDashboardPath } from '../utils/navigationHelpers';

/**
 * Smart back button that knows whether to return to dashboard or profile with modal
 */
export function SmartBackButton({ className = '', label = 'Back', onGoBack = null, from = null }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleBack = () => {
    // If custom onGoBack is provided, use it
    if (onGoBack) {
      onGoBack();
      return;
    }
    
    // Fallback to old behavior
    const dormId = searchParams.get('dormId');
    const userRole = localStorage.getItem('userRole');
    const dashboardPath = getDashboardPath(userRole);
    
    if (dormId) {
      // Coming from modal - navigate back to dashboard with dormId to reopen modal
      navigate(`${dashboardPath}?dorm=${dormId}`);
    } else {
      // Coming from dashboard card - just go back to dashboard
      navigate(dashboardPath);
    }
  };
  
  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );
}