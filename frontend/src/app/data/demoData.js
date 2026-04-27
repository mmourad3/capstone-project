/**
 * ============================================================================
 * UNIMATE - CENTRALIZED DEMO DATA
 * ============================================================================
 * ALL demo data for the application in one place:
 * - Demo Users (33 users with full profiles: 13 dorm users + 20 carpool users)
 * - Demo Questionnaires (10 questionnaires for compatibility matching)
 * - Demo Dorm Listings (5 dorm listings)
 * - Demo Carpool Listings (3 static + 40-50 generated)
 * - Helper Functions (user lookup, data loading)
 */

import { EMAIL_UNIVERSITY_MAP } from "../config/universityConfig";

// ============================================================================
// HELPER FUNCTIONS FOR DEMO DATA GENERATION
// ============================================================================

/**
 * Get university email domain based on university name
 * @param {string} universityName - Full university name (e.g., "Lebanese American University (LAU) - Beirut")
 * @returns {string} Email domain (e.g., '@lau.edu.lb')
 */
const getUniversityEmailDomain = (universityName) => {
  // Search through EMAIL_UNIVERSITY_MAP to find matching domain
  // Handle campus variations: "Lebanese American University (LAU) - Beirut" matches "Lebanese American University (LAU)"
  for (const [domain, expectedUniversity] of Object.entries(
    EMAIL_UNIVERSITY_MAP,
  )) {
    // Check exact match or if university starts with the expected name (handles campus variations)
    // e.g., "Lebanese American University (LAU) - Beirut" starts with "Lebanese American University (LAU)"
    if (
      universityName === expectedUniversity ||
      universityName.startsWith(expectedUniversity)
    ) {
      return domain;
    }
  }

  // Fallback: Default for universities not in EMAIL_UNIVERSITY_MAP
  return "@edu.lb";
};

// ============================================================================
// DEMO USERS
// ============================================================================

export const DEMO_USERS = [
  // DORM PROVIDERS (users with dorm listings)
  {
    userId: "user-sarah-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@aub.edu.lb",
    phone: "+9611234567",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    country: "Lebanon",
    countryCode: "LB",
    countryISO: "LB",
    university: "American University of Beirut",
    role: "dorm_provider",
    verified: true,
    region: "Hamra",
  },
  {
    userId: "user-lara-004",
    name: "Lara Hassan",
    email: "lara.hassan@lau.edu.lb",
    phone: "+9611234570",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    country: "Lebanon",
    countryCode: "LB",
    countryISO: "LB",
    university: "Lebanese American University",
    role: "dorm_provider",
    verified: true,
    region: "Mar Mikhael",
  },
  {
    userId: "user-michael-003",
    name: "Michael Brown",
    email: "michael.brown@usj.edu.lb",
    phone: "+9611234569",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    country: "United States",
    countryCode: "US",
    countryISO: "US",
    university: "Université Saint-Joseph",
    role: "dorm_provider",
    verified: true,
    region: "Verdun",
  },

  // DORM PROVIDERS
  {
    userId: "user-emily-002",
    name: "Emily Chen",
    email: "emily.chen@lau.edu.lb",
    phone: "+9611234568",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    country: "Lebanon",
    countryCode: "LB",
    countryISO: "LB",
    university: "Lebanese American University",
    role: "dorm_provider",
    verified: true,
    region: "Achrafieh",
  },
  {
    userId: "user-rami-006",
    name: "Rami El-Khoury",
    email: "rami.elkhoury@aub.edu.lb",
    phone: "+9611234572",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    country: "Lebanon",
    countryCode: "LB",
    countryISO: "LB",
    university: "American University of Beirut",
    role: "dorm_provider",
    verified: true,
    region: "Hamra",
  },

  // DORM SEEKERS (students looking for dorms)
  {
    userId: "user-alex-009",
    name: "Alex Turner",
    email: "alex.turner@aub.edu.lb",
    phone: "+9611234575",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
    country: "United Kingdom",
    countryCode: "GB",
    countryISO: "GB",
    university: "American University of Beirut",
    role: "dorm_seeker",
    verified: true,
    region: "Hamra",
  },
  {
    userId: "user-sophia-010",
    name: "Sophia Martinez",
    email: "sophia.martinez@lau.edu.lb",
    phone: "+9611234576",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    country: "Spain",
    countryCode: "ES",
    countryISO: "ES",
    university: "Lebanese American University",
    role: "dorm_seeker",
    verified: true,
    region: "Achrafieh",
  },
  {
    userId: "user-omar-011",
    name: "Omar Khalil",
    email: "omar.khalil@aub.edu.lb",
    phone: "+9611234577",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400",
    country: "Lebanon",
    countryCode: "LB",
    countryISO: "LB",
    university: "American University of Beirut",
    role: "dorm_seeker",
    verified: true,
    region: "Hamra",
  },
  {
    userId: "user-jessica-012",
    name: "Jessica Park",
    email: "jessica.park@usj.edu.lb",
    phone: "+9611234578",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    country: "South Korea",
    countryCode: "KR",
    countryISO: "KR",
    university: "Université Saint-Joseph",
    role: "dorm_seeker",
    verified: true,
    region: "Verdun",
  },
  {
    userId: "user-pierre-013",
    name: "Pierre Dubois",
    email: "pierre.dubois@usj.edu.lb",
    phone: "+9611234579",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400",
    country: "France",
    countryCode: "FR",
    countryISO: "FR",
    university: "Université Saint-Joseph",
    role: "dorm_seeker",
    verified: true,
    region: "Mar Mikhael",
  },

  // CARPOOL USERS (DRIVERS & PASSENGERS)
  {
    userId: "user-david-005",
    name: "David Kim",
    email: "david.kim@aub.edu.lb",
    phone: "+9611234571",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    country: "South Korea",
    countryCode: "KR",
    countryISO: "KR",
    university: "American University of Beirut",
    role: "carpool",
    verified: true,
    region: "Jounieh",
    carModel: "Honda Civic 2020",
    classSchedule: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "15:00" },
      { day: "Friday", startTime: "10:00", endTime: "14:00" },
    ],
  },
  {
    userId: "user-nadia-007",
    name: "Nadia Mansour",
    email: "nadia.mansour@lau.edu.lb",
    phone: "+9611234573",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    country: "Lebanon",
    countryCode: "LB",
    countryISO: "LB",
    university: "Lebanese American University",
    role: "carpool",
    verified: true,
    region: "Byblos",
    carModel: "Toyota Corolla 2019",
    classSchedule: [
      { day: "Tuesday", startTime: "08:00", endTime: "16:00" },
      { day: "Thursday", startTime: "08:00", endTime: "16:00" },
    ],
  },
  {
    userId: "user-chris-008",
    name: "Chris Anderson",
    email: "chris.anderson@usj.edu.lb",
    phone: "+9611234574",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    country: "United States",
    countryCode: "US",
    countryISO: "US",
    university: "Université Saint-Joseph",
    role: "carpool",
    verified: true,
    region: "Tripoli",
    carModel: "Hyundai Elantra 2021",
    classSchedule: [
      { day: "Monday", startTime: "10:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
      { day: "Friday", startTime: "10:00", endTime: "14:00" },
    ],
  },

  // ADDITIONAL CARPOOL USERS
  {
    userId: "user-ahmad-014",
    name: "Ahmad Hassan",
    email: "ahmad.hassan@student.edu.lb",
    phone: "+9611234567",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    userId: "user-maria-015",
    name: "Maria Khoury",
    email: "maria.khoury@student.edu.lb",
    phone: "+9611234568",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    userId: "user-karim-016",
    name: "Karim Said",
    email: "karim.said@student.edu.lb",
    phone: "+9611234569",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    userId: "user-layla-017",
    name: "Layla Mahmoud",
    email: "layla.mahmoud@student.edu.lb",
    phone: "+9611234570",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  },
  {
    userId: "user-joseph-018",
    name: "Joseph Tannous",
    email: "joseph.tannous@student.edu.lb",
    phone: "+9611234571",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  },
  {
    userId: "user-nour-019",
    name: "Nour Khalil",
    email: "nour.khalil@student.edu.lb",
    phone: "+9611234572",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    userId: "user-rania-020",
    name: "Rania Youssef",
    email: "rania.youssef@student.edu.lb",
    phone: "+9611234573",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  },
  {
    userId: "user-sami-021",
    name: "Sami Nakhleh",
    email: "sami.nakhleh@student.edu.lb",
    phone: "+9611234574",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    userId: "user-zeina-022",
    name: "Zeina Abboud",
    email: "zeina.abboud@student.edu.lb",
    phone: "+9611234575",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
  },
  {
    userId: "user-tony-023",
    name: "Tony Haddad",
    email: "tony.haddad@student.edu.lb",
    phone: "+9611234576",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
  },
  {
    userId: "user-sara-024",
    name: "Sara Nader",
    email: "sara.nader@student.edu.lb",
    phone: "+9611234580",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
  },
  {
    userId: "user-fadi-025",
    name: "Fadi Moussa",
    email: "fadi.moussa@student.edu.lb",
    phone: "+9611234581",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400",
  },
  {
    userId: "user-hala-026",
    name: "Hala Jaber",
    email: "hala.jaber@student.edu.lb",
    phone: "+9611234582",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
  },
  {
    userId: "user-omar-027",
    name: "Omar Fares",
    email: "omar.fares@student.edu.lb",
    phone: "+9611234583",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400",
  },
  {
    userId: "user-lina-028",
    name: "Lina Saleh",
    email: "lina.saleh@student.edu.lb",
    phone: "+9611234584",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    userId: "user-ali-029",
    name: "Ali Ramadan",
    email: "ali.ramadan@student.edu.lb",
    phone: "+9611234585",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    userId: "user-maya-030",
    name: "Maya Karam",
    email: "maya.karam@student.edu.lb",
    phone: "+9611234586",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  },
  {
    userId: "user-youssef-031",
    name: "Youssef Habib",
    email: "youssef.habib@student.edu.lb",
    phone: "+9611234587",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
  {
    userId: "user-reem-032",
    name: "Reem Zahir",
    email: "reem.zahir@student.edu.lb",
    phone: "+9611234588",
    countryCode: "+961",
    gender: "Female",
    profilePicture:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  },
  {
    userId: "user-hassan-033",
    name: "Hassan Diab",
    email: "hassan.diab@student.edu.lb",
    phone: "+9611234589",
    countryCode: "+961",
    gender: "Male",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
];

// ============================================================================
// DEMO QUESTIONNAIRES (for compatibility matching)
// ============================================================================

export const DEMO_QUESTIONNAIRES = {
  "user-sarah-001": {
    sleepSchedule: "Early Bird",
    wakeUpTime: "6-7 AM",
    sleepTime: "Before 10 PM",
    cleanliness: "Very Neat",
    organizationLevel: "Very Organized",
    socialLevel: "Moderately Social",
    guestFrequency: "Occasionally (1-2 times/week)",
    sharedSpaces: "Very Comfortable",
    smoking: "No",
    drinking: "Socially",
    pets: "No Pets - Open to Them",
    studyTime: "Evening",
    noiseLevel: "Very Quiet",
    musicWhileStudying: "No",
    temperaturePreference: "Cool",
    sharingItems: "Yes",
    dietaryPreferences: "Vegetarian",
    allergies: "Pollen allergies",
    interests: ["Fitness", "Cooking", "Reading", "Music"],
    personalQualities: ["Friendly", "Respectful", "Honest", "Reliable"],
    importantQualities: ["Clean", "Communicative", "Respectful"],
    dealBreakers: ["Smoking", "Loud Noise", "Messiness"],
  },
  "user-emily-002": {
    sleepSchedule: "Early Bird",
    wakeUpTime: "6-7 AM",
    sleepTime: "10-11 PM",
    cleanliness: "Moderately Clean",
    organizationLevel: "Moderately Organized",
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
    dietaryPreferences: "No restrictions",
    allergies: "",
    interests: ["Music", "Art", "Traveling", "Cooking"],
    personalQualities: ["Friendly", "Adaptable", "Easygoing", "Communicative"],
    importantQualities: ["Communicative", "Adaptable", "Friendly", "Social"],
    dealBreakers: ["Smoking", "Messiness"],
  },
  "user-michael-003": {
    sleepSchedule: "Early Bird",
    wakeUpTime: "6-7 AM",
    sleepTime: "Before 10 PM",
    cleanliness: "Moderately Clean",
    organizationLevel: "Moderately Organized",
    socialLevel: "Prefer Privacy",
    guestFrequency: "Never",
    sharedSpaces: "Prefer Minimal Sharing",
    smoking: "No",
    drinking: "No",
    pets: "No Pets - Prefer None",
    studyTime: "Evening",
    noiseLevel: "Very Quiet",
    musicWhileStudying: "No",
    temperaturePreference: "Moderate",
    sharingItems: "Prefer Not To",
    dietaryPreferences: "Gluten-free",
    allergies: "Lactose intolerant, dust allergies",
    interests: ["Gaming", "Coding", "Fitness"],
    personalQualities: ["Honest", "Reliable", "Respectful"],
    importantQualities: ["Quiet", "Respectful", "Clean"],
    dealBreakers: ["Smoking", "Drinking", "Loud Noise", "Frequent Guests"],
  },
  "user-lara-004": {
    sleepSchedule: "Night Owl",
    wakeUpTime: "9-10 AM",
    sleepTime: "12-1 AM",
    cleanliness: "Moderately Clean",
    organizationLevel: "Moderately Organized",
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
    dietaryPreferences: "No restrictions",
    allergies: "",
    interests: ["Music", "Art", "Traveling", "Cooking"],
    personalQualities: ["Friendly", "Adaptable", "Easygoing", "Communicative"],
    importantQualities: ["Communicative", "Adaptable", "Friendly", "Social"],
    dealBreakers: ["Smoking", "Messiness"],
  },
  "user-rami-006": {
    sleepSchedule: "Balanced",
    wakeUpTime: "8-9 AM",
    sleepTime: "11 PM-12 AM",
    cleanliness: "Moderately Clean",
    organizationLevel: "Moderately Organized",
    socialLevel: "Moderately Social",
    guestFrequency: "Occasionally (1-2 times/week)",
    sharedSpaces: "Very Comfortable",
    smoking: "No",
    drinking: "Socially",
    pets: "No Pets - Prefer None",
    studyTime: "Evening",
    noiseLevel: "Moderate",
    musicWhileStudying: "Yes",
    temperaturePreference: "Moderate",
    sharingItems: "Yes",
    dietaryPreferences: "Halal",
    allergies: "",
    interests: ["Sports", "Music", "Traveling", "Cooking"],
    personalQualities: ["Friendly", "Supportive", "Communicative"],
    importantQualities: [
      "Communicative",
      "Respectful",
      "Friendly",
      "Adaptable",
    ],
    dealBreakers: ["Smoking", "Messiness"],
  },
  "user-alex-009": {
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
    studyTime: "Evening",
    noiseLevel: "Moderate",
    musicWhileStudying: "Sometimes",
    temperaturePreference: "Cool",
    sharingItems: "Yes",
    dietaryPreferences: "",
    allergies: "",
    interests: ["Music", "Sports", "Traveling", "Photography"],
    personalQualities: ["Friendly", "Honest", "Respectful"],
    importantQualities: ["Respectful", "Communicative", "Clean", "Adaptable"],
    dealBreakers: ["Smoking", "Messiness", "Loud Noise"],
  },
  "user-sophia-010": {
    sleepSchedule: "Night Owl",
    wakeUpTime: "9-10 AM",
    sleepTime: "1-2 AM",
    cleanliness: "Moderately Clean",
    organizationLevel: "Moderately Organized",
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
    dietaryPreferences: "Vegan",
    allergies: "Shellfish allergy",
    interests: ["Art", "Cooking", "Music", "Movies", "Traveling"],
    personalQualities: ["Friendly", "Easygoing", "Communicative"],
    importantQualities: ["Friendly", "Communicative", "Adaptable", "Easygoing"],
    dealBreakers: ["Smoking", "Messiness"],
  },
  "user-omar-011": {
    sleepSchedule: "Early Bird",
    wakeUpTime: "Before 6 AM",
    sleepTime: "Before 10 PM",
    cleanliness: "Very Neat",
    organizationLevel: "Very Organized",
    socialLevel: "Prefer Privacy",
    guestFrequency: "Rarely (Few times/month)",
    sharedSpaces: "Somewhat Comfortable",
    smoking: "No",
    drinking: "No",
    pets: "No Pets - Prefer None",
    studyTime: "Morning",
    noiseLevel: "Very Quiet",
    musicWhileStudying: "No",
    temperaturePreference: "Cool",
    sharingItems: "Prefer Not To",
    dietaryPreferences: "Halal",
    allergies: "",
    interests: ["Reading", "Fitness", "Coding"],
    personalQualities: ["Honest", "Respectful", "Reliable"],
    importantQualities: ["Respectful", "Quiet", "Clean", "Responsible"],
    dealBreakers: ["Smoking", "Drinking", "Frequent Guests"],
  },
  "user-jessica-012": {
    sleepSchedule: "Balanced",
    wakeUpTime: "8-9 AM",
    sleepTime: "11 PM-12 AM",
    cleanliness: "Moderately Clean",
    organizationLevel: "Moderately Organized",
    socialLevel: "Moderately Social",
    guestFrequency: "Occasionally (1-2 times/week)",
    sharedSpaces: "Very Comfortable",
    smoking: "No",
    drinking: "No",
    pets: "No Pets - Open to Them",
    studyTime: "Afternoon",
    noiseLevel: "Moderate",
    musicWhileStudying: "Sometimes",
    temperaturePreference: "Moderate",
    sharingItems: "Yes",
    dietaryPreferences: "",
    allergies: "",
    interests: ["Music", "Cooking", "Photography"],
    personalQualities: ["Friendly", "Honest", "Easygoing"],
    importantQualities: ["Communicative", "Respectful", "Clean", "Friendly"],
    dealBreakers: ["Smoking", "Messiness", "Loud Noise"],
  },
  "user-pierre-013": {
    sleepSchedule: "Night Owl",
    wakeUpTime: "After 10 AM",
    sleepTime: "After 2 AM",
    cleanliness: "Casual",
    organizationLevel: "Go with the Flow",
    socialLevel: "Very Social",
    guestFrequency: "Frequently (3+ times/week)",
    sharedSpaces: "Very Comfortable",
    smoking: "Yes",
    drinking: "Regularly",
    pets: "No Pets - Open to Them",
    studyTime: "Late Night",
    noiseLevel: "Loud",
    musicWhileStudying: "Yes",
    temperaturePreference: "Warm",
    sharingItems: "Yes",
    dietaryPreferences: "",
    allergies: "",
    interests: ["Music", "Movies", "Art", "Traveling"],
    personalQualities: ["Friendly", "Easygoing", "Communicative"],
    importantQualities: ["Friendly", "Adaptable", "Easygoing", "Social"],
    dealBreakers: ["Not Sharing"],
  },
};

// ============================================================================
// DEMO DORM LISTINGS
// ============================================================================
// NOTE: Compatibility scores are calculated dynamically using the same
// calculateCompatibility() function from /src/app/utils/compatibilityCalculator.js
// that is used when viewing profiles. Do NOT add hardcoded compatibilityScore,
// matchReasons, or potentialConflicts here - they will be calculated at runtime.

export const DEMO_DORM_LISTINGS = [
  {
    id: 1,
    title: "Spacious Single Room Near AUB",
    location: "Hamra Street, Ras Beirut",
    latitude: 33.8978,
    longitude: 35.4814,
    price: 650,
    roomType: "Single Room",
    genderPreference: "any", // Provider accepts any gender
    description:
      "Modern single room in shared apartment. Fully furnished with WiFi, utilities included. Walking distance to AUB campus and local cafes.",
    amenities: [
      "wifi",
      "ac",
      "furnished",
      "desk",
      "utilities",
      "kitchen",
      "laundry",
    ],
    images: [
      "https://images.unsplash.com/photo-1767800766055-1cdbd2e351b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwYmVkcm9vbSUyMGZ1cm5pc2hlZHxlbnwxfHx8fDE3NzIzMjM2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1564273795917-fe399b763988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwZG9ybSUyMHJvb20lMjBiZWQlMjBkZXNrfGVufDF8fHx8MTc3MjMyMzYxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    status: "Active",
    posterId: "user-sarah-001",
    posterEmail: "sarah.johnson@aub.edu.lb",
    posterName: "Sarah Johnson",
    posterPhone: "+9611234567",
    whatsapp: "9611234567",
    poster: "Sarah Johnson",
    posterGender: "Female",
    posterProfilePic:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    country: "Lebanon",
    countryCode: "LB",
    datePosted: "2026-03-05T10:30:00Z",
  },
  {
    id: 2,
    title: "Cozy Bedroom in Achrafieh",
    location: "Sassine Square, Achrafieh",
    latitude: 33.89,
    longitude: 35.52,
    price: 550,
    roomType: "Single Room",
    genderPreference: "same", // Provider (Female) accepts same gender only
    description:
      "Bright and cozy room with private bathroom. Safe neighborhood with easy access to public transport. Perfect for serious students.",
    amenities: ["wifi", "bathroom", "furnished", "desk", "heating", "parking"],
    images: [
      "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjMyMzYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1692455067486-d4637182a61c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwd2luZG93JTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc3MjMyMzYxNHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    status: "Active",
    posterId: "user-emily-002",
    posterEmail: "emily.chen@lau.edu.lb",
    posterName: "Emily Chen",
    posterPhone: "+9611234568",
    whatsapp: "9611234568",
    poster: "Emily Chen",
    posterGender: "Female",
    posterProfilePic:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    country: "Lebanon",
    countryCode: "LB",
    datePosted: "2026-03-03T14:20:00Z",
  },
  {
    id: 3,
    title: "Modern Room with Study Area",
    location: "Verdun, Beirut",
    latitude: 33.87,
    longitude: 35.49,
    price: 750,
    roomType: "Single Room",
    genderPreference: "same", // Provider (Male) accepts same gender only
    description:
      "Spacious single room with dedicated study area and private bathroom. Close to shops and restaurants. Great for students who value privacy and comfort. Modern building with elevator and 24/7 security.",
    amenities: ["wifi", "ac", "bathroom", "furnished", "desk", "utilities"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1080",
    ],
    status: "Active",
    posterId: "user-michael-003",
    posterEmail: "michael.brown@usj.edu.lb",
    posterName: "Michael Brown",
    posterPhone: "+9611234569",
    whatsapp: "9611234569",
    poster: "Michael Brown",
    posterGender: "Male",
    posterProfilePic:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    country: "Lebanon",
    countryCode: "LB",
    datePosted: "2026-03-08T09:15:00Z",
  },
  {
    id: 4,
    title: "Affordable Shared Room in Mar Mikhael",
    location: "Mar Mikhael, Beirut",
    latitude: 33.895,
    longitude: 35.515,
    price: 400,
    roomType: "Shared Room",
    genderPreference: "any", // Provider accepts any gender
    description:
      "Budget-friendly shared room in vibrant Mar Mikhael area. Great for students who enjoy a lively neighborhood with plenty of cafes and art galleries nearby. Utilities included.",
    amenities: ["wifi", "kitchen", "laundry", "furnished"],
    images: [
      "https://images.unsplash.com/photo-1610513492097-13a9a4c343c6?w=1080",
    ],
    status: "Active",
    posterId: "user-lara-004",
    posterEmail: "lara.hassan@lau.edu.lb",
    posterName: "Lara Hassan",
    posterPhone: "+9611234570",
    whatsapp: "9611234570",
    poster: "Lara Hassan",
    posterGender: "Female",
    posterProfilePic:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    country: "Lebanon",
    countryCode: "LB",
    datePosted: "2026-02-28T16:45:00Z",
  },
  {
    id: 5,
    title: "Student-Friendly Room in Hamra",
    location: "Hamra, Beirut",
    latitude: 33.8985,
    longitude: 35.4825,
    price: 600,
    roomType: "Single Room",
    genderPreference: "same", // Provider (Male) accepts same gender only
    description:
      "Comfortable single room near AUB campus. Perfect for active students who enjoy sports and outdoor activities. Includes gym access in building. Quiet neighborhood ideal for studying with easy access to campus.",
    amenities: [
      "wifi",
      "ac",
      "furnished",
      "desk",
      "utilities",
      "gym",
      "parking",
    ],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1080",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1080",
    ],
    status: "Active",
    posterId: "user-rami-006",
    posterEmail: "rami.elkhoury@aub.edu.lb",
    posterName: "Rami El-Khoury",
    posterPhone: "+9611234572",
    whatsapp: "9611234572",
    poster: "Rami El-Khoury",
    posterGender: "Male",
    posterProfilePic:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    country: "Lebanon",
    countryCode: "LB",
    datePosted: "2026-03-01T11:00:00Z",
  },
];

// ============================================================================
// DEMO CARPOOL LISTINGS (Static)
// ============================================================================

export const DEMO_CARPOOL_LISTINGS = [
  {
    id: "carpool-001",
    driverId: "user-david-005",
    driverName: "David Kim",
    driverEmail: "david.kim@aub.edu.lb",
    driverPhone: "+9611234571",
    driverCountryCode: "+961",
    driverGender: "Male",
    driverProfilePicture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    university: "American University of Beirut",
    region: "Jounieh",
    pickupLocation: "Jounieh",
    pickupSpot: "Jounieh Municipality",
    destination: "American University of Beirut",
    date: "2025-03-10",
    endDate: "2025-06-15",
    time: "08:00",
    returnTime: "17:00",
    seats: 0,
    totalSeats: 3,
    availableSeats: 3,
    price: 5.0,
    carModel: "Honda Civic 2020",
    status: "Active",
    passengers: [],
    driverSchedule: [
      {
        courseName: "Computer Science 101",
        days: ["monday", "wednesday"],
        startTime: "09:00",
        endTime: "17:00",
      },
    ],
    postedAt: "2025-02-25T12:00:00Z",
    createdAt: "2025-02-25T12:00:00Z",
    genderPreference: "both",
  },
  {
    id: "carpool-002",
    driverId: "user-nadia-007",
    driverName: "Nadia Mansour",
    driverEmail: "nadia.mansour@lau.edu.lb",
    driverPhone: "+9611234573",
    driverCountryCode: "+961",
    driverGender: "Female",
    driverProfilePicture:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    university: "Lebanese American University",
    region: "Byblos",
    pickupLocation: "Byblos",
    pickupSpot: "Byblos Old Souk",
    destination: "Lebanese American University",
    date: "2025-03-05",
    endDate: "2025-06-20",
    time: "07:30",
    returnTime: "16:00",
    seats: 2,
    totalSeats: 4,
    availableSeats: 2,
    price: 4.0,
    carModel: "Toyota Corolla 2019",
    status: "Active",
    passengers: [
      {
        id: "user-sarah-001", // Passenger user ID
        name: "Sarah Johnson",
        email: "sarah.johnson@aub.edu.lb",
        phone: "+9611234567",
        countryCode: "+961",
        gender: "Female",
        profilePicture:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        joinedAt: "2025-02-28T10:00:00Z",
      },
      {
        id: "user-lara-004", // Passenger user ID
        name: "Lara Hassan",
        email: "lara.hassan@lau.edu.lb",
        phone: "+9611234570",
        countryCode: "+961",
        gender: "Female",
        profilePicture:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        joinedAt: "2025-03-01T14:30:00Z",
      },
    ],
    driverSchedule: [
      {
        courseName: "Business Management 201",
        days: ["tuesday", "thursday"],
        startTime: "08:00",
        endTime: "16:00",
      },
    ],
    postedAt: "2025-02-22T08:00:00Z",
    createdAt: "2025-02-22T08:00:00Z",
    genderPreference: "both",
  },
  {
    id: "carpool-003",
    driverId: "user-chris-008",
    driverName: "Chris Anderson",
    driverEmail: "chris.anderson@usj.edu.lb",
    driverPhone: "+9611234574",
    driverCountryCode: "+961",
    driverGender: "Male",
    driverProfilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    university: "Université Saint-Joseph",
    region: "Tripoli",
    pickupLocation: "Tripoli",
    pickupSpot: "Tripoli International Fair",
    destination: "Université Saint-Joseph",
    date: "2025-03-08",
    endDate: "2025-06-10",
    time: "09:00",
    returnTime: "18:00",
    seats: 0,
    totalSeats: 4,
    availableSeats: 4,
    price: 6.0,
    carModel: "Hyundai Elantra 2021",
    status: "Active",
    passengers: [],
    driverSchedule: [
      {
        courseName: "Engineering Fundamentals",
        days: ["monday", "wednesday"],
        startTime: "10:00",
        endTime: "18:00",
      },
    ],
    postedAt: "2025-02-27T16:00:00Z",
    createdAt: "2025-02-27T16:00:00Z",
    genderPreference: "both",
  },
];

// ============================================================================
// GENERATE DYNAMIC CARPOOL LISTINGS (40-50 carpools)
// ============================================================================

/**
 * Generate demo carpool listings based on user's region and university
 * @param {string} userRegion - User's selected region
 * @param {string} userUniversity - User's university
 * @returns {Array} Array of 40-50 generated demo carpool listings
 */
export function generateDemoCarpools(userRegion, userUniversity) {
  // If user hasn't set region/university yet, return empty array
  if (!userRegion || !userUniversity) {
    console.log("⚠️ User region/university not set.");
    return [];
  }

  // Get user's class schedule from localStorage
  const userClassSchedule = JSON.parse(
    localStorage.getItem("classSchedule") || "[]",
  );

  console.log(
    "🚗 Generating SMART carpools for user schedule:",
    userClassSchedule,
  );

  const today = new Date();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getDaysFromToday = (daysOffset) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysOffset);
    return formatDate(date);
  };

  // Get university email domain
  const emailDomain = getUniversityEmailDomain(userUniversity);
  console.log(`📧 Using email domain: ${emailDomain} for ${userUniversity}`);

  // Get ALL carpool users from DEMO_USERS (users with ids 014-033)
  // These users can be BOTH drivers AND passengers
  const carpoolUsers = DEMO_USERS.filter((user) => {
    const userNum = parseInt(user.userId.split("-")[2]);
    return userNum >= 14 && userNum <= 33;
  });

  // Update emails to match user's university
  const allCarpoolUsers = carpoolUsers.map((user) => ({
    ...user,
    email: `${user.name.toLowerCase().replace(/\s+/g, ".")}${emailDomain}`,
  }));

  // For listing creation: use first 10 users as drivers (but they can also be passengers in other carpools)
  const driversPool = allCarpoolUsers.slice(0, 10);

  // For joining carpools: use all 20 users as potential passengers
  const passengersPool = allCarpoolUsers;

  const carModels = [
    "Honda Civic 2020",
    "Toyota Corolla 2019",
    "Hyundai Elantra 2021",
    "Kia Cerato 2020",
    "Nissan Sunny 2018",
    "BMW 320i 2019",
    "Mercedes C-Class 2020",
    "Chevrolet Cruze 2019",
    "Ford Focus 2018",
    "Mazda 3 2021",
  ];

  const pickupSpots = [
    "Main Square",
    "Bus Station",
    "City Center",
    "Near the Mosque",
    "Shopping Mall Entrance",
    "Gas Station",
    "Public Library",
    "Town Hall",
    "Central Park",
    "Hospital Parking",
  ];

  // Helper: Generate departure times BEFORE user's class start (with variety)
  const generateDepartTimes = (startTime) => {
    const [hour, min] = startTime.split(":").map(Number);
    const times = [];

    // Generate 4 different times: 1.5h before, 1h before, 30min before, exactly at start
    for (let offset of [90, 60, 30, 0]) {
      let h = hour;
      let m = min - offset;
      while (m < 0) {
        m += 60;
        h -= 1;
      }
      if (h >= 5)
        times.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        );
    }

    return times;
  };

  // Helper: Generate return times AFTER user's class end (with variety)
  const generateReturnTimes = (endTime) => {
    const [hour, min] = endTime.split(":").map(Number);
    const times = [];

    // Generate 4 different times: exactly at end, 30min after, 1h after, 1.5h after
    for (let offset of [0, 30, 60, 90]) {
      let h = hour;
      let m = min + offset;
      while (m >= 60) {
        m -= 60;
        h += 1;
      }
      if (h < 22)
        times.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        );
    }

    return times;
  };

  // Helper: Generate all non-empty subsets of an array (power set minus empty set)
  const getAllSubsets = (arr) => {
    const result = [];
    const total = Math.pow(2, arr.length);

    for (let i = 1; i < total; i++) {
      // Start from 1 to exclude empty set
      const subset = [];
      for (let j = 0; j < arr.length; j++) {
        if (i & (1 << j)) {
          subset.push(arr[j]);
        }
      }
      result.push(subset);
    }

    return result;
  };

  const demoCarpools = [];

  // If no class schedule, return empty (let user set schedule first)
  if (!userClassSchedule || userClassSchedule.length === 0) {
    return [];
  }

  let globalIdx = 0;
  const TARGET_CARPOOLS = 45; // Target 40-50 carpools

  // Track used days per driver to prevent overlaps
  const driverUsedDays = {};

  // Generate carpools for each schedule block with various day combinations
  userClassSchedule.forEach((block, blockIdx) => {
    const departTimes = generateDepartTimes(block.startTime);
    const returnTimes = generateReturnTimes(block.endTime);

    // Get all possible day combinations (subsets) from this block
    const dayCombinations = getAllSubsets(block.days || []);

    // Generate carpools for each day combination
    dayCombinations.forEach((dayCombo, comboIdx) => {
      // Create multiple carpools per combination (with different times/drivers)
      const carpoolsPerCombo = Math.min(
        4,
        Math.ceil(
          TARGET_CARPOOLS / (userClassSchedule.length * dayCombinations.length),
        ),
      );

      for (let i = 0; i < carpoolsPerCombo; i++) {
        if (globalIdx >= TARGET_CARPOOLS) return; // Stop at target

        const driver = driversPool[globalIdx % driversPool.length];
        const driverId = driver.userId;

        // Check if driver already has a listing with overlapping days
        if (!driverUsedDays[driverId]) {
          driverUsedDays[driverId] = [];
        }

        const hasOverlap = driverUsedDays[driverId].some((usedDays) =>
          dayCombo.some((day) => usedDays.includes(day)),
        );

        // Skip this listing if driver has overlapping days
        if (hasOverlap) {
          globalIdx++; // Increment to try next driver
          continue;
        }

        // Mark these days as used by this driver
        driverUsedDays[driverId].push(dayCombo);
        const daysOffset = Math.floor(globalIdx / 6);
        const date = getDaysFromToday(daysOffset);
        const departTime = departTimes[i % departTimes.length];
        const returnTime = returnTimes[i % returnTimes.length];
        const carModel = carModels[globalIdx % carModels.length];
        const pickupSpot = pickupSpots[globalIdx % pickupSpots.length];

        const totalSeats = 3 + (globalIdx % 2); // 3 or 4 seats

        // Varied gender preferences: 50% both, 50% same gender
        const genderPreference = globalIdx % 2 === 0 ? "both" : "same";

        // Distribution of passenger occupancy (NO full carpools):
        // 30% empty, 40% half-full, 30% nearly-full
        let numPassengers;
        const occupancyType = globalIdx % 10;
        if (occupancyType < 3) {
          numPassengers = 0; // 30% empty (0, 1, 2)
        } else if (occupancyType < 7) {
          numPassengers = Math.floor(totalSeats / 2); // 40% half-full (3, 4, 5, 6)
        } else {
          numPassengers = totalSeats - 1; // 30% nearly-full, always 1 seat available (7, 8, 9)
        }

        // Create passengers array (using actual user IDs)
        const passengers = [];
        for (let j = 0; j < numPassengers; j++) {
          const randomPassenger =
            passengersPool[(globalIdx + j) % passengersPool.length];
          passengers.push({
            id: randomPassenger.userId, // Use actual user ID
            name: randomPassenger.name,
            email: randomPassenger.email,
            phone: randomPassenger.phone,
            countryCode: randomPassenger.countryCode,
            gender: randomPassenger.gender,
            profilePicture: randomPassenger.profilePicture,
            joinedAt: new Date(
              today.getTime() - (globalIdx + j) * 3600000,
            ).toISOString(),
          });
        }

        // Calculate actual seats based on passengers
        const actualSeats = passengers.length;
        const actualAvailableSeats = totalSeats - actualSeats;
        const carpoolStatus = actualSeats >= totalSeats ? "Full" : "Active";

        demoCarpools.push({
          id: `carpool_${Date.now()}_${globalIdx}`,
          driverId: driver.userId, // Use actual user ID
          driverName: driver.name,
          driverEmail: driver.email,
          driverPhone: driver.phone,
          driverCountryCode: driver.countryCode, // From driver's country
          driverProfilePicture: driver.profilePicture,
          driverGender: driver.gender,
          driverSchedule: [
            {
              id: `block_${blockIdx + 1}_combo_${comboIdx}`,
              courseName: block.courseName || `Course ${blockIdx + 1}`,
              days: dayCombo, // Use the day combination
              startTime: block.startTime,
              endTime: block.endTime,
            },
          ],
          university: userUniversity,
          region: userRegion,
          pickupLocation: userRegion,
          pickupSpot: pickupSpot,
          destination: userUniversity,
          date: date,
          time: departTime,
          returnTime: returnTime,
          totalSeats: totalSeats,
          seats: actualSeats, // Calculated from passengers.length
          availableSeats: actualAvailableSeats, // totalSeats - passengers.length
          price: parseFloat((5.0 + (globalIdx % 10) * 2.0).toFixed(2)), // DECIMAL: 5.00, 7.00, 9.00, 11.00, etc
          carModel: carModel,
          genderPreference: genderPreference,
          passengers: passengers,
          status: carpoolStatus, // 'Full' if no seats left, 'Active' otherwise
          createdAt: new Date(
            today.getTime() - globalIdx * 3600000,
          ).toISOString(),
        });

        globalIdx++;
      }
    });
  });

  console.log(
    `✅ Generated ${demoCarpools.length} SMART carpools with NO overlapping driver days!`,
  );
  return demoCarpools;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user by email
 */
export const getUserByEmail = (email) => {
  return DEMO_USERS.find((user) => user.email === email) || null;
};

/**
 * Get user by ID
 */
export const getUserById = (userId) => {
  return DEMO_USERS.find((user) => user.userId === userId) || null;
};

/**
 * Get users by role
 */
export const getUsersByRole = (role) => {
  return DEMO_USERS.filter((user) => user.role === role);
};

/**
 * Get dorm listings by poster ID
 */
export const getDormListingsByPosterId = (posterId) => {
  return DEMO_DORM_LISTINGS.filter((listing) => listing.posterId === posterId);
};

/**
 * Get carpool listings by driver ID
 */
export const getCarpoolListingsByDriverId = (driverId) => {
  return DEMO_CARPOOL_LISTINGS.filter(
    (carpool) => carpool.driverId === driverId,
  );
};

/**
 * Get active dorm listings
 */
export const getActiveDormListings = () => {
  return DEMO_DORM_LISTINGS.filter((listing) => listing.status === "Active");
};

/**
 * Get active carpool listings
 */
export const getActiveCarpoolListings = () => {
  return DEMO_CARPOOL_LISTINGS.filter((carpool) => carpool.status === "Active");
};

/**
 * Load demo user into localStorage
 */
export const loadDemoUser = (emailOrId) => {
  const user = getUserByEmail(emailOrId) || getUserById(emailOrId);

  if (!user) {
    console.error("Demo user not found:", emailOrId);
    return false;
  }

  try {
    // Set basic user data
    localStorage.setItem("userId", user.userId);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userPhone", user.phone);
    localStorage.setItem("gender", user.gender);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("profilePicture", user.profilePicture);
    localStorage.setItem("country", user.country);
    localStorage.setItem("countryCode", user.countryCode);
    localStorage.setItem("countryISO", user.countryISO);
    localStorage.setItem("university", user.university || "");
    localStorage.setItem("userVerified", user.verified.toString());

    // Set phone number with demo prefix
    localStorage.setItem(`phone_${user.email}`, user.phone);

    // Set region if available
    if (user.region) {
      localStorage.setItem("userRegion", user.region);
    }

    // Set car model if available
    if (user.carModel) {
      localStorage.setItem("carModel", user.carModel);
    }

    // Set class schedule if available
    if (user.classSchedule) {
      localStorage.setItem("classSchedule", JSON.stringify(user.classSchedule));
    }

    // Set questionnaire data if available (user-scoped)
    if (user.questionnaire) {
      const userId = user.userId;
      const questionnaireKey = `user_${userId}_questionnaire`;
      const completedKey = `user_${userId}_questionnaire_completed`;

      localStorage.setItem(
        questionnaireKey,
        JSON.stringify(user.questionnaire),
      );
      localStorage.setItem(completedKey, "true");
    }

    console.log(`✅ Loaded demo user: ${user.name} (${user.role})`);
    return true;
  } catch (error) {
    console.error("Error loading demo user:", error);
    return false;
  }
};

/**
 * Load demo dorm listings into localStorage
 */
export const loadDemoDormListings = () => {
  try {
    localStorage.setItem("postedDorms", JSON.stringify(DEMO_DORM_LISTINGS));
    console.log(`✅ Loaded ${DEMO_DORM_LISTINGS.length} demo dorm listings`);
    return true;
  } catch (error) {
    console.error("Error loading demo dorm listings:", error);
    return false;
  }
};

/**
 * Load demo carpool listings into localStorage
 */
export const loadDemoCarpoolListings = () => {
  try {
    localStorage.setItem("allCarpools", JSON.stringify(DEMO_CARPOOL_LISTINGS));
    console.log(
      `✅ Loaded ${DEMO_CARPOOL_LISTINGS.length} demo carpool listings`,
    );
    return true;
  } catch (error) {
    console.error("Error loading demo carpool listings:", error);
    return false;
  }
};

/**
 * Load all demo data at once
 */
export const loadAllDemoData = () => {
  loadDemoDormListings();
  loadDemoCarpoolListings();
  console.log("✅ All demo data loaded");
};

/**
 * Quick switch between demo users
 */
export const switchToUser = (emailOrId) => {
  const success = loadDemoUser(emailOrId);
  if (success) {
    // Reload the page to apply changes
    window.location.reload();
  }
  return success;
};

/**
 * Initialize demo data in localStorage for profile viewing
 * @param {Array} mockListings - Array of mock dorm listings
 */
export function initializeDormDemoData(mockListings) {
  // Store demo users
  const demoUsers = mockListings.map((listing) => ({
    userId: listing.posterId,
    email: listing.posterEmail,
    name: listing.posterName,
    gender: listing.posterGender,
    profilePicture: listing.posterProfilePic,
    role: "dorm_provider",
    phone: listing.posterPhone,
  }));
  localStorage.setItem("demoUsers", JSON.stringify(demoUsers));

  // Store demo questionnaires
  mockListings.forEach((listing) => {
    const questionnaire = DEMO_QUESTIONNAIRES[listing.posterId];
    if (questionnaire) {
      const key = `user_${listing.posterId}_questionnaire`;
      const completedKey = `user_${listing.posterId}_questionnaire_completed`;
      localStorage.setItem(key, JSON.stringify(questionnaire));
      localStorage.setItem(completedKey, "true");
    }
  });
}
