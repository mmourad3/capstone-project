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

  // DORM SEEKERS (students looking for dorms
  
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