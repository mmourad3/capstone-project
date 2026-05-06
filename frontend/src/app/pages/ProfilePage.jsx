import { useNavigate, useParams, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Mail, Phone, Calendar, GraduationCap, Globe } from 'lucide-react';
import { ProfilePicture } from '../components/ProfilePicture';
import { navigateToDashboard, getRoleDisplayName } from '../utils/navigationHelpers';
import ProfileView from "../components/ProfileView";
import { contactDormSeeker } from '../utils/whatsappUtils';
import { userAPI, questionnaireAPI,roommateAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const { userId, providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerQuestionnaire, setViewerQuestionnaire] = useState(null);
  const [areRoommates, setAreRoommates] = useState(false);

  // Get where we came from via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from');
  const dormId = searchParams.get('dormId');

  const handleGoBack = () => {
    if (from === 'dashboard') {
      navigate(dormId ? `/dashboard/dorm-seeker?dorm=${dormId}` : '/dashboard/dorm-seeker');
    } else if (from === 'profile') {
      navigate(dormId ? `/profile?dorm=${dormId}` : '/profile');
    } else {
      navigate('/profile');
    }
  };

  const parseArrayField = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const normalizeQuestionnaire = (questionnaire) => {
    if (!questionnaire) return null;

    return {
      ...questionnaire,
      interests: parseArrayField(questionnaire.interests),
      personalQualities: parseArrayField(questionnaire.personalQualities),
      importantQualities: parseArrayField(questionnaire.importantQualities),
      dealBreakers: parseArrayField(questionnaire.dealBreakers),
    };
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);

      try {
        const targetUserId = userId || providerId;

        if (!targetUserId) {
          setProfile(null);
          return;
        }

        if (user && targetUserId === user.id) {
          navigate("/profile");
          return;
        }

        const data = await userAPI.getById(targetUserId);
        const activeRoommates = await roommateAPI
          .getActiveRoommates()
          .catch(() => []);

        const isRoommate = activeRoommates.some(
          (rm) =>
            rm.roommateUserId === targetUserId || rm.userId === targetUserId,
        );

        setAreRoommates(isRoommate);
        const activeDorm = Array.isArray(data.dormListings)
          ? data.dormListings.find((dorm) => dorm.status === "Active")
          : null;

        const requestDormId = dormId || activeDorm?.id || null;
        const viewerData = await questionnaireAPI.getMe().catch(() => null);
        const normalizedViewerQuestionnaire =normalizeQuestionnaire(viewerData);
        const normalizedProfileQuestionnaire = normalizeQuestionnaire(data.questionnaire);

        const fullName =
          data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim();

        const questionnaire = data.questionnaire
          ? {
              ...data.questionnaire,
              interests: parseArrayField(data.questionnaire.interests),
              personalQualities: parseArrayField(
                data.questionnaire.personalQualities,
              ),
              importantQualities: parseArrayField(
                data.questionnaire.importantQualities,
              ),
              dealBreakers: parseArrayField(data.questionnaire.dealBreakers),
            }
          : null;
        
        setProfile({
          name: fullName,
          email: data.email,
          userId: data.id,
          gender: data.gender || "Not specified",
          university: data.university || "University",
          profilePicture: data.profilePicture,
          role: data.role || "dorm_seeker",
          phone: data.phone,
          questionnaire: normalizedProfileQuestionnaire,
          hasCompletedQuestionnaire: !!normalizedProfileQuestionnaire,
          requestDormId,
        });
        setViewerQuestionnaire(normalizedViewerQuestionnaire);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, providerId, user, navigate, dormId]);

  const shouldShowRequestButton = () => {
    if (!profile || !user) return false;

    if (profile.userId === user.id) return false;

    return user.role === "dorm_seeker" && profile.role === "dorm_provider";
  };

  const shouldShowContactButton = () => {
    if (!profile || !user) return false;

    if (profile.userId === user.id) return false;

    return user.role === "dorm_provider" && profile.role === "dorm_seeker";
  };

    // Handle contact
  const handleContact = (targetProfile) => {
    const currentUserName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    const currentUserEmail = user?.email || "";
    
    contactDormSeeker(targetProfile, currentUserName, areRoommates);
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
      dormId={profile?.requestDormId || dormId}
    />
  );
}