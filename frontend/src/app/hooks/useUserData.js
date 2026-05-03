import { useAuth } from "../contexts/AuthContext";

export function useUserData() {
  const { user } = useAuth();

  const fullName =
    user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return {
    userId: user?.id || "",
    userName: fullName,
    userEmail: user?.email || "",
    userRole: user?.role || "",
    userPhone: user?.phone || "",
    userCountryCode: user?.countryCode || "",
    userCountry: user?.country || "",
    userGender: user?.gender || "",
    userProfilePicture: user?.profilePicture || "",
    userUniversity: user?.university || "",
    carpoolRegion: user?.region || "",
    dormRegion: user?.region || "",
    classSchedule: user?.classSchedule || [],
    lifestyleAnswers: user?.questionnaire || null,
  };
}
