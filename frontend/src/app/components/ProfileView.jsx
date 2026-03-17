import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, User, Mail, Sparkles, Moon, Users, Coffee, Thermometer, CheckCircle, XCircle, Heart, Music, Dumbbell, Plane, Film, Palette, Code, Camera, Utensils, Gamepad2, BookOpen, MessageCircle, Star, Award, AlertTriangle, GraduationCap, Info, ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import { ProfilePicture } from "./ProfilePicture";
import { calculateCompatibility, getCompatibilityColor, getCompatibilityLabel } from "../utils/comprehensiveCompatibilityCalculator";
import RequestRoommateButton from "./RequestRoommateButton";
import { SmartBackButton } from "./SmartBackButton";
import { useState } from "react";

// Interest icons mapping
const interestIcons = {
  "Gaming": Gamepad2,
  "Music": Music,
  "Fitness": Dumbbell,
  "Travel": Plane,
  "Movies": Film,
  "Art": Palette,
  "Coding": Code,
  "Photography": Camera,
  "Cooking": Utensils,
  "Reading": BookOpen,
};

/**
 * Reusable ProfileView Component
 * 
 * Used for displaying user profiles with compatibility analysis
 * 
 * Props:
 * @param {Object} profile - The profile data to display
 * @param {Object} viewerQuestionnaire - The current user's questionnaire for compatibility
 * @param {boolean} showRequestButton - Whether to show "Request as Roommate" button
 * @param {boolean} showContactButton - Whether to show "Contact" button
 * @param {Function} onContact - Callback when contact button is clicked
 * @param {Function} onGoBack - Optional callback for back button (defaults to navigate(-1))
 * @param {string} from - Where the user came from ('profile' or 'dashboard')
 * @param {boolean} loading - Loading state
 */
export default function ProfileView({ 
  profile, 
  viewerQuestionnaire = null,
  showRequestButton = false,
  showContactButton = false,
  onContact = null,
  onGoBack = null,
  from = null,
  loading = false
}) {
  const navigate = useNavigate();
  const [showCompatibilityInfo, setShowCompatibilityInfo] = useState(false);

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      // Default behavior: go back in history
      navigate(-1);
    }
  };

  const handleContactClick = () => {
    if (onContact) {
      onContact(profile);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.hasCompletedQuestionnaire) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <SmartBackButton 
            className="mb-6" 
            label="Go Back"
            onGoBack={onGoBack}
            from={from}
          />
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Available</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This user hasn't completed their lifestyle questionnaire yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const q = profile.questionnaire;
  const showCompatibility = viewerQuestionnaire !== null;

  // Calculate compatibility using the comprehensive calculator
  const compatibility = showCompatibility 
    ? calculateCompatibility(viewerQuestionnaire, q)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Smart Back Button */}
        <SmartBackButton 
          className="mb-6" 
          label="Go Back"
          onGoBack={onGoBack}
          from={from}
        />

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-2xl shadow-xl p-4 sm:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 flex-shrink-0">
              <ProfilePicture 
                src={profile.profilePicture} 
                alt={profile.name}
                size="xl"
                className="border-0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">{profile.name}</h1>
              <div className="flex items-center gap-2 text-blue-100 mb-1">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all text-xs sm:text-sm md:text-base">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100 mb-1">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span className="break-words text-xs sm:text-sm md:text-base">{profile.university || profile.email?.split('@')[1] || 'University'}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="capitalize text-xs sm:text-sm md:text-base">{profile.gender}</span>
              </div>
            </div>
            
            {/* Request as Roommate Button - Only shown for seekers viewing providers */}
            {showRequestButton && (
              <div className="w-full sm:w-auto">
                <RequestRoommateButton
                  user={{
                    id: profile.userId,
                    email: profile.email,
                    name: profile.name,
                    picture: profile.profilePicture
                  }}
                  size="compact"
                />
                {/* Warning text for pending requests - only show when button is "Cannot Send Request" */}
                {(() => {
                  const currentUserId = localStorage.getItem('userId');
                  const requests = JSON.parse(localStorage.getItem('roommateRequests') || '[]');
                  
                  // Check if there's a request to THIS specific user
                  const requestToThisUser = requests.find(
                    req => req.senderUserId === currentUserId && 
                           req.recipientUserId === profile.userId && 
                           req.status === 'pending'
                  );
                  
                  // Check if there's ANY pending request
                  const anyPendingRequest = requests.find(
                    req => req.senderUserId === currentUserId && req.status === 'pending'
                  );
                  
                  // Check if user has active roommate
                  const roommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
                  const hasActiveRoommate = roommates.find(
                    rm => rm.userId === currentUserId && rm.status === 'active'
                  );
                  
                  // Only show warning if:
                  // 1. User has a pending request (to anyone)
                  // 2. NOT already requested THIS specific user
                  // 3. User does NOT have an active roommate
                  const shouldShowWarning = anyPendingRequest && !requestToThisUser && !hasActiveRoommate;
                  
                  return shouldShowWarning ? (
                    <p className="text-xs text-orange-600 text-center font-medium mt-1.5">Cancel your pending request first</p>
                  ) : null;
                })()}
              </div>
            )}
            
            {/* Contact Button - Only shown for seekers viewing providers */}
            {showContactButton && (
              <button
                onClick={handleContactClick}
                className="px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
              >
                <MessageCircle className="w-5 h-5" />
                Contact
              </button>
            )}
          </div>
        </div>

        {/* Personal Qualities - Their Best Qualities */}
        {q.personalQualities && q.personalQualities.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border-2 border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Award className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Best Qualities</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs sm:text-sm">What {profile.name.split(' ')[0]} says about themselves:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {q.personalQualities.map((quality, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-600 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">{quality}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compatibility Score */}
        {showCompatibility && compatibility && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compatibility Score</h2>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowCompatibilityInfo(!showCompatibilityInfo)}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  aria-label="Toggle compatibility info"
                >
                  <Info className="w-5 h-5" />
                </button>
                
                {/* Tooltip Popup */}
                {showCompatibilityInfo && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-200 shadow-lg z-10">
                    {/* Arrow pointing up - centered */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-50 dark:bg-blue-900/50 border-l border-t border-blue-200 dark:border-blue-700 transform rotate-45"></div>
                    <p className="leading-relaxed">
                      We compare your lifestyle answers side-by-side. The more you have in common, the higher your score! 
                      Exact matches earn the most points, similar answers earn some points, and big differences show up as 
                      'Things to Discuss.' Different categories are weighted based on their impact on roommate compatibility.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={`text-center p-6 rounded-xl mb-4 ${
              getCompatibilityColor(compatibility.score) === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
              getCompatibilityColor(compatibility.score) === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
              getCompatibilityColor(compatibility.score) === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
              'bg-red-100 dark:bg-red-900/30'
            }`}>
              <div className={`text-4xl sm:text-6xl font-bold mb-2 ${
                getCompatibilityColor(compatibility.score) === 'green' ? 'text-green-600 dark:text-green-400' :
                getCompatibilityColor(compatibility.score) === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                getCompatibilityColor(compatibility.score) === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>{compatibility.score}%</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {getCompatibilityLabel(compatibility.score)}
              </p>
            </div>

            {/* AI-Generated Explanation Paragraph */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Compatibility Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {compatibility.explanation || "AI compatibility summary is not available yet. This feature will be enabled once the AI model is integrated."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* What You Have in Common - Always visible */}
              {(() => {
                // Filter out Deal Breaker Penalties from the green section
                const filteredReasons = compatibility.matchReasons 
                  ? compatibility.matchReasons.filter(match => match.category !== 'Deal Breaker Penalties')
                  : [];
                
                return (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      What You Have in Common {filteredReasons.length > 0 && `(${filteredReasons.length})`}
                    </h3>
                    {filteredReasons.length === 0 ? (
                      <p className="text-sm text-green-700 dark:text-green-400 italic">No specific matches identified</p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredReasons.map((match, idx) => {
                          // Determine icon based on category
                          let icon = <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-green-400" />;
                          
                          // Special handling for deal breaker categories
                          if (match.category === 'Deal Breakers') {
                            icon = <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-green-400" />;
                          }
                          
                          return (
                            <li key={idx} className="text-sm">
                              <div className="flex items-start gap-2">
                                {icon}
                                <div>
                                  <p className="font-semibold text-green-900 dark:text-green-300">{match.category}</p>
                                  <p className="text-green-800 dark:text-green-400">{match.detail}</p>
                                  {match.points && (
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                      +{match.points} pts
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })()}

              {/* Things to Discuss - Always visible */}
              {(() => {
                // Separate conflicts into categories for proper ordering
                const dealBreakerViolations = []; // Their violations of YOUR deal breakers (affects score, -10 pts)
                const criticalConflicts = []; // Critical severity conflicts
                const highConflicts = []; // High severity conflicts
                const mediumConflicts = []; // Medium severity conflicts
                const lowConflicts = []; // Low severity conflicts
                const reverseDealBreakers = []; // Your violations of THEIR deal breakers (doesn't affect score)
                
                // 1. Separate deal breaker violations and regular conflicts by severity
                if (compatibility.potentialConflicts && compatibility.potentialConflicts.length > 0) {
                  compatibility.potentialConflicts.forEach(conflict => {
                    if (conflict.category === 'Deal Breaker Violation') {
                      dealBreakerViolations.push(conflict);
                    } else {
                      // Sort by severity
                      if (conflict.severity === 'critical') {
                        criticalConflicts.push(conflict);
                      } else if (conflict.severity === 'high') {
                        highConflicts.push(conflict);
                      } else if (conflict.severity === 'medium') {
                        mediumConflicts.push(conflict);
                      } else {
                        lowConflicts.push(conflict);
                      }
                    }
                  });
                }
                
                // 2. Add reverse deal breakers (you violate THEIR deal breakers) - LAST
                if (compatibility.reverseDealBreakerViolations && compatibility.reverseDealBreakerViolations.length > 0) {
                  const dealBreakers = compatibility.reverseDealBreakerViolations.map(v => {
                    // Remove everything after and including the colon
                    const detailWithoutExplanation = v.detail.split(':')[0];
                    return detailWithoutExplanation;
                  }).join(', ');
                  reverseDealBreakers.push({
                    category: 'You Meet Their Deal Breaker(s)',
                    detail: dealBreakers,
                    severity: 'high',
                    isReverse: true
                  });
                }
                
                // Combine in priority order:
                // 1. Deal breakers FIRST (red shield)
                // 2. Critical conflicts (red triangle)
                // 3. High severity conflicts (orange triangle)
                // 4. Medium severity conflicts (yellow triangle)
                // 5. Low severity conflicts (yellow triangle)
                // 6. Reverse deal breakers LAST (orange shield, doesn't affect score)
                const allConflicts = [
                  ...dealBreakerViolations,
                  ...criticalConflicts,
                  ...highConflicts,
                  ...mediumConflicts,
                  ...lowConflicts,
                  ...reverseDealBreakers
                ];
                
                return (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Things to Discuss {allConflicts.length > 0 && `(${allConflicts.length})`}
                    </h3>
                    {allConflicts.length === 0 ? (
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 italic">No compatibility concerns</p>
                    ) : (
                      <ul className="space-y-3">
                        {allConflicts.map((conflict, idx) => {
                          // Determine icon based on category
                          let icon;
                          if (conflict.category === 'Deal Breaker Violation') {
                            icon = <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />;
                          } else if (conflict.isReverse || conflict.category.includes('You Meet Their Deal Breaker')) {
                            icon = <ShieldAlert className="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />;
                          } else {
                            icon = <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                              conflict.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                              conflict.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                              conflict.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-yellow-500 dark:text-yellow-400'
                            }`} />;
                          }

                          return (
                            <li key={idx} className="text-sm">
                              <div className="flex items-start gap-2">
                                {icon}
                                <div>
                                  <p className="font-semibold text-yellow-900 dark:text-yellow-300">
                                    {conflict.category}
                                    {conflict.isReverse && (
                                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400 italic ml-2">
                                        (Doesn't affect score)
                                      </span>
                                    )}
                                  </p>
                                  <p className={`${
                                    conflict.severity === 'critical' ? 'text-red-800 dark:text-red-400 font-medium' :
                                    conflict.severity === 'high' ? 'text-orange-800 dark:text-orange-400' :
                                    'text-yellow-800 dark:text-yellow-400'
                                  }`}>{conflict.detail}</p>
                                  {conflict.category === 'Deal Breaker Violation' && (
                                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                      -10 pts
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Lifestyle Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Lifestyle Preferences</h2>

          <div className="space-y-6">
            {/* Sleep & Wake Schedule */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Sleep & Wake Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Schedule Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.sleepSchedule}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wake Up Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.wakeUpTime}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sleep Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.sleepTime}</p>
                </div>
              </div>
            </div>

            {/* Cleanliness & Organization */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Cleanliness & Organization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cleanliness Level</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.cleanliness}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Organization Level</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.organizationLevel}</p>
                </div>
              </div>
            </div>

            {/* Social Preferences */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Social Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Social Level</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.socialLevel}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Guest Frequency</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.guestFrequency}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shared Spaces Usage</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.sharedSpaces}</p>
                </div>
              </div>
            </div>

            {/* Habits & Lifestyle */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Habits & Lifestyle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Smoking</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.smoking}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Drinking</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.drinking}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pets</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.pets}</p>
                </div>
              </div>
              
              {/* Dietary Preferences */}
              {q.dietaryPreferences && q.dietaryPreferences.trim() !== '' && q.dietaryPreferences !== 'Not set' && (
                <div className="mt-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dietary Preferences</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{q.dietaryPreferences}</p>
                  </div>
                </div>
              )}
              
              {/* Allergies */}
              {q.allergies && q.allergies.trim() !== '' && q.allergies !== 'Not set' && (
                <div className="mt-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Allergies/Health Considerations</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{q.allergies}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Study Environment */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Study Environment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Study Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.studyTime}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Noise Level</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.noiseLevel}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Music While Studying</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.musicWhileStudying}</p>
                </div>
              </div>
            </div>

            {/* Room Preferences */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Room Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temperature</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.temperaturePreference}</p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sharing Items</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{q.sharingItems}</p>
                </div>
              </div>
            </div>

            {/* Interests & Hobbies */}
            {q.interests && q.interests.length > 0 && (
              <div className="pb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Interests & Hobbies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {q.interests.map((interest, idx) => {
                    const Icon = interestIcons[interest] || Heart;
                    return (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2"
                      >
                        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{interest}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Important Qualities */}
        {q.importantQualities && q.importantQualities.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Looking For in a Roommate</h2>
            <div className="flex flex-wrap gap-2">
              {q.importantQualities.map((quality, idx) => (
                <span 
                  key={idx}
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {quality}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deal Breakers */}
        {q.dealBreakers && q.dealBreakers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deal Breakers</h2>
            <div className="flex flex-wrap gap-2">
              {q.dealBreakers.map((breaker, idx) => (
                <span 
                  key={idx}
                  className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {breaker}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}