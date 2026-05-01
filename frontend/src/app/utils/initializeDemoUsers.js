// Initialize demo users with complete questionnaire data
export const initializeDemoUsers = () => {
  const demoUsers = [
    {
      name: "Sarah Johnson",
      userId: "user-sarah-001",
      email: "sarah.johnson@aub.edu.lb",
      picture:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      phone: "+9611234567",
      country: "Lebanon",
      gender: "Female",
      role: "dorm_seeker",
      questionnaire: {
        sleepSchedule: "Early Bird",
        wakeUpTime: "6-7 AM",
        sleepTime: "Before 10 PM",
        cleanliness: "Moderately Clean",
        organizationLevel: "Moderately Organized",
        socialLevel: "Moderately Social",
        guestFrequency: "Occasionally (1-2 times/week)",
        sharedSpaces: "Very Comfortable",
        smoking: "No",
        drinking: "Socially",
        pets: "No Pets - Open to Them",
        studyTime: "Evening",
        noiseLevel: "Moderate",
        musicWhileStudying: "No",
        temperaturePreference: "Cool",
        sharingItems: "Yes",
        interests: ["Fitness", "Cooking", "Travel", "Photography"],
        personalQualities: [
          "Respectful",
          "Honest",
          "Communicative",
          "Reliable",
        ],
        importantQualities: ["Respectful", "Clean", "Communicative"],
        dealBreakers: ["Smoking", "Messiness", "Loud Noise"],
      },
    },
    {
      name: "Emily Chen",
      userId: "user-emily-002",
      email: "emily.chen@lau.edu.lb",
      picture:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      phone: "+9611234568",
      country: "Lebanon",
      gender: "Female",
      role: "dorm_seeker",
      questionnaire: {
        sleepSchedule: "Night Owl",
        wakeUpTime: "9-10 AM",
        sleepTime: "1-2 AM",
        cleanliness: "Very Neat",
        organizationLevel: "Very Organized",
        socialLevel: "Very Social",
        guestFrequency: "Frequently (3+ times/week)",
        sharedSpaces: "Very Comfortable",
        smoking: "No",
        drinking: "Socially",
        pets: "Have Pets",
        studyTime: "Late Night",
        noiseLevel: "Moderate",
        musicWhileStudying: "Yes",
        temperaturePreference: "Warm",
        sharingItems: "Yes",
        interests: ["Music", "Art", "Movies", "Cooking"],
        personalQualities: [
          "Friendly",
          "Easygoing",
          "Communicative",
          "Adaptable",
        ],
        importantQualities: ["Friendly", "Adaptable", "Clean", "Communicative"],
        dealBreakers: ["Messiness", "Too Social"],
      },
    },
    {
      name: "Michael Brown",
      userId: "user-michael-003",
      email: "michael.brown@usj.edu.lb",
      picture:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      phone: "+9611234569",
      country: "United States",
      gender: "Male",
      role: "dorm_seeker",
      questionnaire: {
        sleepSchedule: "Early Bird",
        wakeUpTime: "Before 6 AM",
        sleepTime: "Before 10 PM",
        cleanliness: "Moderately Clean",
        organizationLevel: "Moderately Organized",
        socialLevel: "Prefer Privacy",
        guestFrequency: "Rarely (Few times/month)",
        sharedSpaces: "Prefer Minimal Sharing",
        smoking: "No",
        drinking: "No",
        pets: "No Pets - Prefer None",
        studyTime: "Morning",
        noiseLevel: "Very Quiet",
        musicWhileStudying: "No",
        temperaturePreference: "Cool",
        sharingItems: "Prefer Not To",
        interests: ["Fitness", "Reading", "Gaming", "Coding"],
        personalQualities: ["Respectful", "Reliable", "Honest", "Supportive"],
        importantQualities: ["Respectful", "Quiet", "Organized"],
        dealBreakers: ["Smoking", "Frequent Guests", "Too Social"],
      },
    },
    {
      name: "Lara Hassan",
      userId: "user-lara-004",
      email: "lara.hassan@lau.edu.lb",
      picture:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      phone: "+9611234570",
      country: "Lebanon",
      gender: "Female",
      role: "dorm_seeker",
      questionnaire: {
        sleepSchedule: "Balanced",
        wakeUpTime: "7-8 AM",
        sleepTime: "11 PM-12 AM",
        cleanliness: "Very Neat",
        organizationLevel: "Very Organized",
        socialLevel: "Moderately Social",
        guestFrequency: "Occasionally (1-2 times/week)",
        sharedSpaces: "Very Comfortable",
        smoking: "No",
        drinking: "Socially",
        pets: "No Pets - Open to Them",
        studyTime: "Afternoon",
        noiseLevel: "Very Quiet",
        musicWhileStudying: "Sometimes",
        temperaturePreference: "Moderate",
        sharingItems: "Yes",
        interests: ["Cooking", "Photography", "Travel", "Reading"],
        personalQualities: [
          "Respectful",
          "Reliable",
          "Communicative",
          "Honest",
        ],
        importantQualities: ["Clean", "Respectful", "Communicative"],
        dealBreakers: ["Messiness", "Smoking", "Loud Noise"],
      },
    },
    {
      name: "David Kim",
      userId: "user-david-005",
      email: "david.kim@aub.edu.lb",
      picture:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      phone: "+9611234571",
      country: "South Korea",
      gender: "Male",
      role: "dorm_seeker",
      questionnaire: {
        sleepSchedule: "Night Owl",
        wakeUpTime: "After 10 AM",
        sleepTime: "After 2 AM",
        cleanliness: "Moderately Clean",
        organizationLevel: "Moderately Organized",
        socialLevel: "Very Social",
        guestFrequency: "Frequently (3+ times/week)",
        sharedSpaces: "Very Comfortable",
        smoking: "Only Outside",
        drinking: "Socially",
        pets: "Have Pets",
        studyTime: "Late Night",
        noiseLevel: "Moderate",
        musicWhileStudying: "Yes",
        temperaturePreference: "Cool",
        sharingItems: "Yes",
        interests: ["Gaming", "Music", "Fitness", "Cooking"],
        personalQualities: [
          "Friendly",
          "Adaptable",
          "Easygoing",
          "Communicative",
        ],
        importantQualities: ["Friendly", "Adaptable", "Social", "Easygoing"],
        dealBreakers: ["Loud Noise", "Not Sharing"],
      },
    },
  ];

  // Get existing registered users
  const registeredUsers = JSON.parse(
    localStorage.getItem("registeredUsers") || "[]",
  );

  // Add each demo user if they don't already exist
  demoUsers.forEach((demoUser) => {
    const exists = registeredUsers.some(
      (user) => user.email === demoUser.email,
    );

    if (!exists) {
      // Add user to registeredUsers only if they don't exist
      registeredUsers.push({
        email: demoUser.email,
        userId: demoUser.userId,
        name: demoUser.name,
        phone: demoUser.phone,
        country: demoUser.country,
        gender: demoUser.gender,
        profilePicture: demoUser.picture,
        role: demoUser.role,
      });
    }

    // ALWAYS store questionnaire data for demo users (even if they already exist)
    const q = demoUser.questionnaire;
    Object.keys(q).forEach((key) => {
      const value = Array.isArray(q[key]) ? q[key].join(",") : q[key];
      localStorage.setItem(`q_${key}_${demoUser.email}`, value);
    });
  });

  // Save updated registeredUsers
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  console.log("✅ Demo users initialized with questionnaire data");
};
