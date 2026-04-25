export const saveAuthUser = ({ token, user }) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userFirstName", user.firstName || "");
  localStorage.setItem("userLastName", user.lastName || "");
  localStorage.setItem(
    "userName",
    `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  );
  localStorage.setItem("userEmail", user.email || "");
  localStorage.setItem("userRole", user.role || "");
  localStorage.setItem("userPhone", user.phone || "");
  localStorage.setItem("userGender", user.gender || "");
  localStorage.setItem("userCountry", user.country || "");
  localStorage.setItem("userCountryCode", user.countryCode || "");
  localStorage.setItem("userUniversity", user.university || "");

  if (user.region) {
    localStorage.setItem("carpoolRegion", user.region);
  } else {
    localStorage.removeItem("carpoolRegion");
  }

  if (user.classSchedule) {
    localStorage.setItem("classSchedule", JSON.stringify(user.classSchedule));
  } else {
    localStorage.removeItem("classSchedule");
  }

  if (user.profilePicture) {
    localStorage.setItem("userProfilePicture", user.profilePicture);
  } else {
    localStorage.removeItem("userProfilePicture");
  }
};
