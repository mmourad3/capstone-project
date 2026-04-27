const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const LEVELS = {
  cleanliness: {
    "Very Neat": 4,
    "Moderately Clean": 3,
    Casual: 2,
    Relaxed: 1,
  },
  organizationLevel: {
    "Very Organized": 3,
    "Moderately Organized": 2,
    "Go with the Flow": 1,
  },
  socialLevel: {
    "Very Social": 3,
    "Moderately Social": 2,
    "Prefer Privacy": 1,
    "Very Quiet": 1,
  },
  noiseLevel: {
    Loud: 3,
    Moderate: 2,
    "Very Quiet": 1,
  },
  temperaturePreference: {
    Warm: 3,
    Moderate: 2,
    Cool: 1,
  },
  sleepSchedule: {
    "Night Owl": 3,
    Balanced: 2,
    Flexible: 2,
    "Early Bird": 1,
  },
};

const scoreLevelField = (field, a, b, maxPoints) => {
  const aLevel = LEVELS[field]?.[a];
  const bLevel = LEVELS[field]?.[b];

  if (!aLevel || !bLevel) return 0;

  const diff = Math.abs(aLevel - bLevel);
  if (diff === 0) return maxPoints;
  if (diff === 1) return Math.round(maxPoints * 0.7);
  return Math.round(maxPoints * 0.3);
};

const scoreExactField = (a, b, maxPoints) => {
  if (!a || !b) return 0;
  return a === b ? maxPoints : 0;
};

const violatesDealBreakers = (dealBreakers, candidate) => {
  return parseArray(dealBreakers).some((breaker) => {
    const normalized = breaker.toLowerCase();

    if (normalized.includes("smok")) return candidate.smoking === "Yes";
    if (normalized.includes("drink")) {
      return ["Yes", "Regularly"].includes(candidate.drinking);
    }
    if (normalized.includes("pet")) {
      return candidate.pets === "Yes" || candidate.pets?.includes("Have Pets");
    }
    if (normalized.includes("mess")) {
      return ["Casual", "Relaxed"].includes(candidate.cleanliness);
    }
    if (normalized.includes("loud") || normalized.includes("noise")) {
      return candidate.noiseLevel === "Loud" || candidate.musicWhileStudying === "Yes";
    }
    if (normalized.includes("late") || normalized.includes("night")) {
      return candidate.sleepSchedule === "Night Owl";
    }
    if (normalized.includes("social")) return candidate.socialLevel === "Very Social";
    if (normalized.includes("guest")) {
      return candidate.guestFrequency?.includes("Frequently");
    }
    if (normalized.includes("sharing")) return candidate.sharingItems === "Prefer Not To";

    return false;
  });
};

export const calculateRoommateCompatibilityScore = (questionnaire, candidate) => {
  if (!questionnaire || !candidate) return 0;
  if (violatesDealBreakers(questionnaire.dealBreakers, candidate)) return 0;
  if (violatesDealBreakers(candidate.dealBreakers, questionnaire)) return 0;

  let score = 0;

  score += scoreLevelField("sleepSchedule", questionnaire.sleepSchedule, candidate.sleepSchedule, 10);
  score += scoreExactField(questionnaire.wakeUpTime, candidate.wakeUpTime, 5);
  score += scoreExactField(questionnaire.sleepTime, candidate.sleepTime, 5);
  score += scoreLevelField("cleanliness", questionnaire.cleanliness, candidate.cleanliness, 15);
  score += scoreLevelField("organizationLevel", questionnaire.organizationLevel, candidate.organizationLevel, 10);
  score += scoreLevelField("socialLevel", questionnaire.socialLevel, candidate.socialLevel, 10);
  score += scoreExactField(questionnaire.guestFrequency, candidate.guestFrequency, 5);
  score += scoreExactField(questionnaire.sharedSpaces, candidate.sharedSpaces, 5);
  score += scoreExactField(questionnaire.smoking, candidate.smoking, 5);
  score += scoreExactField(questionnaire.drinking, candidate.drinking, 3);
  score += scoreExactField(questionnaire.pets, candidate.pets, 4);
  score += scoreExactField(questionnaire.studyTime, candidate.studyTime, 4);
  score += scoreLevelField("noiseLevel", questionnaire.noiseLevel, candidate.noiseLevel, 5);
  score += scoreExactField(questionnaire.musicWhileStudying, candidate.musicWhileStudying, 3);
  score += scoreLevelField(
    "temperaturePreference",
    questionnaire.temperaturePreference,
    candidate.temperaturePreference,
    3,
  );
  score += scoreExactField(questionnaire.sharingItems, candidate.sharingItems, 3);

  const interests = parseArray(questionnaire.interests);
  const candidateInterests = parseArray(candidate.interests);
  const sharedInterests = interests.filter((interest) => candidateInterests.includes(interest));
  score += Math.min(10, sharedInterests.length * 4);

  return Math.min(100, Math.max(0, score));
};

