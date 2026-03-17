import { useNavigate, useParams, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Mail, Phone, Calendar, GraduationCap, Globe } from 'lucide-react';
import { ProfilePicture } from '../components/ProfilePicture';
import { navigateToDashboard, getRoleDisplayName } from '../utils/navigationHelpers';
import ProfileView from "../components/ProfileView";
import { contactDormSeeker } from '../utils/whatsappUtils';

/**
 * ProfilePage - View OTHER Users' Profiles
 * 
 * Displays user profiles with intelligent role-based features:
 * - Seekers viewing providers: Shows "Request as Roommate" button
 * - Providers viewing seekers: Shows "Contact" button (opens WhatsApp)
 * 
 * NOTE: This page is ONLY for viewing OTHER users' profiles.
 * For viewing your own profile, use /profile (Profile.jsx)
 * If you try to view your own profile here, you'll be redirected to /profile
 */
export default function ProfilePage() {
  const { userId, providerId } = useParams(); // Handle both route params
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get where we came from via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from');
  const dormId = searchParams.get('dormId');

  // Simple back handler
  const handleGoBack = () => {
    if (from === 'dashboard') {
      navigate(dormId ? `/dashboard/dorm-seeker?dorm=${dormId}` : '/dashboard/dorm-seeker');
    } else if (from === 'profile') {
      navigate(dormId ? `/profile?dorm=${dormId}` : '/profile');
    } else {
      navigate('/profile');
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      
      // TODO: Backend Integration
      // const response = await fetch(`/api/users/${userId || providerId}/profile`);
      // const data = await response.json();
      // setProfile(data);
      
      // DEMO MODE - Load from localStorage
      const targetUserId = userId || providerId; // Support both route params
      const decodedUserId = decodeURIComponent(targetUserId);
      
      // Check if viewing own profile
      const currentUserId = localStorage.getItem('userId');
      const currentUserEmail = localStorage.getItem('userEmail');
      
      // OPTION 1: Redirect to own profile page if viewing own profile
      if (decodedUserId === currentUserId || decodedUserId === currentUserEmail) {
        navigate('/profile');
        setLoading(false);
        return;
      }
      
      // DEMO MODE: Check posted dorms, demo data, and registered users
      let foundUser = null;
      let userEmail = decodedUserId;
      
      // First check posted dorms
      const postedDorms = JSON.parse(localStorage.getItem('postedDorms') || '[]');
      let demoListing = postedDorms.find(d => 
        d.posterId === decodedUserId || 
        d.posterEmail === decodedUserId
      );
      
      // Also check demo mock listings (stored in DormSeekerDashboard)
      if (!demoListing) {
        // Try to get from demo users stored in localStorage
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        demoListing = demoUsers.find(u => 
          u.posterId === decodedUserId || 
          u.posterEmail === decodedUserId ||
          u.userId === decodedUserId ||
          u.email === decodedUserId
        );
      }
      
      if (demoListing) {
        // Create user object from listing data
        foundUser = {
          userId: demoListing.posterId || demoListing.userId || demoListing.posterEmail,
          email: demoListing.posterEmail || demoListing.email,
          name: demoListing.posterName || demoListing.poster || demoListing.name || 'User',
          gender: demoListing.posterGender || demoListing.gender || 'Not specified',
          profilePicture: demoListing.posterProfilePic || demoListing.profilePicture,
          role: demoListing.role || 'dorm-provider', // Since they posted a dorm
          phone: demoListing.posterPhone || demoListing.phone
        };
        userEmail = foundUser.email;
      } else {
        // Check registered users
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        foundUser = registeredUsers.find(u => u.userId === decodedUserId);
        
        if (foundUser) {
          userEmail = foundUser.email;
        } else {
          foundUser = registeredUsers.find(u => u.email === decodedUserId);
          if (foundUser) {
            userEmail = decodedUserId;
          }
        }
      }
      
      if (foundUser) {
        // Load their questionnaire data from user-scoped storage
        const getOtherUserQuestionnaire = (userId) => {
          const key = `user_${userId}_questionnaire`;
          const data = localStorage.getItem(key);
          return data ? JSON.parse(data) : null;
        };
        
        // Try to get questionnaire by userId first, then by email
        let otherUserQuestionnaire = getOtherUserQuestionnaire(foundUser.userId);
        if (!otherUserQuestionnaire && foundUser.email) {
          otherUserQuestionnaire = getOtherUserQuestionnaire(foundUser.email);
        }
        
        const userQuestionnaire = otherUserQuestionnaire || {
          sleepSchedule: 'Early Bird',
          wakeUpTime: '6-7 AM',
          sleepTime: 'Before 10 PM',
          cleanliness: 'Moderately Clean',
          organizationLevel: 'Moderately Organized',
          socialLevel: 'Moderately Social',
          guestFrequency: 'Occasionally (1-2 times/week)',
          sharedSpaces: 'Very Comfortable',
          smoking: 'No',
          drinking: 'Socially',
          pets: 'No Pets - Open to Them',
          studyTime: 'Evening',
          noiseLevel: 'Moderate',
          musicWhileStudying: 'No',
          temperaturePreference: 'Cool',
          sharingItems: 'Yes',
          interests: ['Fitness', 'Cooking', 'Travel', 'Photography'],
          personalQualities: ['Friendly', 'Supportive', 'Honest'],
          importantQualities: ['Respect', 'Cleanliness', 'Communication', 'Responsibility'],
          dealBreakers: ['Smoking', 'Messiness', 'Loud parties']
        };
        
        const hasQuestionnaireData = otherUserQuestionnaire !== null;
        
        // Extract university from email domain
        const emailDomain = userEmail.split('@')[1];
        let university = 'University';
        if (emailDomain === 'aub.edu.lb') university = 'American University of Beirut';
        else if (emailDomain === 'lau.edu.lb') university = 'Lebanese American University';
        else if (emailDomain === 'usj.edu.lb') university = 'Saint Joseph University';
        else if (emailDomain === 'ul.edu.lb') university = 'Lebanese University';
        else if (emailDomain === 'balamand.edu.lb') university = 'University of Balamand';
        else university = emailDomain;
        
        setProfile({
          name: foundUser.name,
          email: userEmail,
          userId: foundUser.userId,
          gender: foundUser.gender || 'Not specified',
          university: university,
          profilePicture: foundUser.profilePicture,
          role: foundUser.role || 'dorm-seeker',
          phone: foundUser.phone,
          questionnaire: userQuestionnaire,
          hasCompletedQuestionnaire: hasQuestionnaireData
        });
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };

    loadUserProfile();
  }, [userId, providerId]);

  // Determine if "Request as Roommate" button should be shown
  const shouldShowRequestButton = () => {
    if (!profile) return false;
    
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole');
    
    // Don't show button if viewing own profile
    if (profile.userId === currentUserId) return false;
    
    // Show button only if:
    // - Current user is a dorm-seeker (looking for dorms)
    // - AND the profile being viewed is a dorm-provider (has a dorm)
    return currentUserRole === 'dorm-seeker' && profile.role === 'dorm-provider';
  };

  // Determine if "Contact" button should be shown
  const shouldShowContactButton = () => {
    if (!profile) return false;
    
    const currentUserId = localStorage.getItem('userId');
    const currentUserRole = localStorage.getItem('userRole');
    
    // Don't show button if viewing own profile
    if (profile.userId === currentUserId) return false;
    
    // Show button only if:
    // - Current user is a dorm-provider (has a dorm)
    // - AND the profile being viewed is a dorm-seeker (looking for dorms)
    return currentUserRole === 'dorm-provider' && profile.role === 'dorm-seeker';
  };

  // Get viewer's questionnaire for compatibility (user-scoped)
  const getViewerQuestionnaire = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    const key = `user_${userId}_questionnaire`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  const viewerQuestionnaire = getViewerQuestionnaire();

  // Handle contact
  const handleContact = (targetProfile) => {
    const currentUserName = localStorage.getItem('userName');
    const currentUserEmail = localStorage.getItem('userEmail');
    
    // Use the contactDormSeeker utility function
    contactDormSeeker(targetProfile, currentUserName, currentUserEmail);
  };

  return (
    <ProfileView 
      profile={profile}
      viewerQuestionnaire={viewerQuestionnaire}
      showRequestButton={shouldShowRequestButton()}
      showContactButton={shouldShowContactButton()}
      onContact={handleContact}
      loading={loading}
      onGoBack={handleGoBack}
      from={from}
    />
  );
}