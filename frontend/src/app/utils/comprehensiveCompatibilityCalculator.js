//DELETE WHEN IMPLEMENTING AI

/**
 * Comprehensive Compatibility Calculator for Roommate Matching
 */

// Field level mappings
const FIELD_LEVELS = {
  cleanliness: { 'Very Neat': 4, 'Moderately Clean': 3, 'Casual': 2, 'Relaxed': 1 },
  organizationLevel: { 'Very Organized': 3, 'Moderately Organized': 2, 'Go with the Flow': 1 },
  socialLevel: { 'Very Social': 3, 'Moderately Social': 2, 'Very Quiet': 1 },
  noiseLevel: { 'Loud': 3, 'Moderate': 2, 'Very Quiet': 1 },
  guestFrequency: { 'Frequently': 3, 'Sometimes': 2, 'Rarely': 1 },
  temperaturePreference: { 'Warm': 3, 'Moderate': 2, 'Cool': 1 },
  sleepSchedule: { 'Night Owl': 3, 'Flexible': 2, 'Early Bird': 1 }
};

// Helper functions
const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const getLevel = (field, value) => value ? FIELD_LEVELS[field]?.[value] || 0 : 0;

const getPointsFromDiff = (maxPoints, diff) => {
  if (diff === 0) return maxPoints;
  if (diff === 1) return Math.round(maxPoints * 0.90); // More generous: 80% → 90%
  if (diff === 2) return Math.round(maxPoints * 0.70); // More generous: 50% → 70%
  return Math.round(maxPoints * 0.40); // More generous: 20% → 40%
};

const parseTimeToHour = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  
  // Sleep times (handle midnight wraparound)
  if (timeStr === 'Before 10 PM') return 21;  // ~9 PM
  if (timeStr === '10-11 PM') return 22;
  if (timeStr === '11 PM-12 AM') return 23;
  if (timeStr === '12-1 AM') return 24;  // Midnight, treat as 24 to keep sequential
  if (timeStr === '1-2 AM') return 25;   // 1 AM, offset by 24
  if (timeStr === 'After 2 AM') return 26; // 2+ AM, offset by 24
  
  // Wake times
  if (timeStr === 'Before 6 AM') return 5;  // ~5 AM
  if (timeStr === '6-7 AM') return 6;
  if (timeStr === '7-8 AM') return 7;
  if (timeStr === '8-9 AM') return 8;
  if (timeStr === '9-10 AM') return 9;
  if (timeStr === 'After 10 AM') return 11; // ~11 AM
  
  return null;
};

// Reusable comparison function for level-based fields
const compareField = (field, v1, v2, config, bonusFields, matchReasons, conflicts) => {
  if (!v1 || !v2) return 0;
  
  const diff = Math.abs(getLevel(field, v1) - getLevel(field, v2));
  let points = getPointsFromDiff(config.maxPoints, diff);
  
  if (diff <= config.matchThreshold) {
    const detail = config.matchMsg(v1, v2, diff);
    matchReasons.push({ category: config.category, detail, points });
  } else {
    conflicts.push({
      category: config.category,
      detail: config.conflictMsg(v1, v2),
      severity: config.severity || 'medium'
    });
  }
  
  if (bonusFields.has(field)) {
    points = Math.round(points * 1.5);
  }
  
  return points;
};

// Deal breaker checking
const checkDealBreakers = (dealBreakers, questionnaire) => {
  const violations = [];
  const dealBreakerList = parseArray(dealBreakers).filter(b => b && typeof b === 'string');
  if (!questionnaire) return violations;
  
  dealBreakerList.forEach(breaker => {
    const breakerLower = breaker.toLowerCase();
    let violated = false, detail = '';
    
    if (breakerLower.includes('smok') && questionnaire.smoking === 'Yes') {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: They smoke`;
    } else if ((breakerLower.includes('drink') || breakerLower.includes('alcohol')) && 
               (questionnaire.drinking === 'Regularly' || questionnaire.drinking === 'Yes')) {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: They drink ${questionnaire.drinking ? questionnaire.drinking.toLowerCase() : 'regularly'}`;
    } else if (breakerLower.includes('pet') && (questionnaire.pets === 'Yes' || questionnaire.pets.includes('Have Pets'))) {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: They have pets`;
    } else if ((breakerLower.includes('mess') || breakerLower.includes('dirty') || breakerLower.includes('clean')) && 
               (questionnaire.cleanliness === 'Relaxed' || questionnaire.cleanliness === 'Casual')) {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: Their cleanliness is ${questionnaire.cleanliness}`;
    } else if ((breakerLower.includes('loud') || breakerLower.includes('noise')) && 
               (questionnaire.musicWhileStudying === 'Yes' || questionnaire.musicWhileStudying === 'Sometimes' || questionnaire.noiseLevel === 'Loud')) {
      violated = true;
      if (questionnaire.noiseLevel === 'Loud') {
        detail = `Deal breaker \"${breaker}\" violated: They prefer loud environments`;
      } else {
        detail = `Deal breaker \"${breaker}\" violated: They play music while studying`;
      }
    } else if ((breakerLower.includes('night') || breakerLower.includes('late')) && questionnaire.sleepSchedule === 'Night Owl') {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: They are a ${questionnaire.sleepSchedule}`;
    } else if ((breakerLower.includes('social') || breakerLower.includes('too social')) && 
               questionnaire.socialLevel === 'Very Social') {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: They are very social`;
    } else if ((breakerLower.includes('guest') || breakerLower.includes('frequent guest')) && 
               (questionnaire.guestFrequency === 'Frequently (3+ times/week)' || questionnaire.guestFrequency === 'Occasionally (1-2 times/week)')) {
      violated = true;
      detail = `Deal breaker \"${breaker}\" violated: They have guests ${questionnaire.guestFrequency.toLowerCase()}`;
    } else if ((breakerLower.includes('temp') || breakerLower.includes('temperature')) && 
               (questionnaire.temperaturePreference === 'Warm' || questionnaire.temperaturePreference === 'Cool')) {
      violated = true;
      detail = `Deal breaker "${breaker}" violated: They prefer '${questionnaire.temperaturePreference}' temperature`;
    } else if ((breakerLower.includes('shar') || breakerLower.includes('not sharing')) && 
               questionnaire.sharingItems === 'Prefer Not To') {
      violated = true;
      detail = `Deal breaker "${breaker}" violated: They don't like sharing items`;
    }
    
    if (violated) violations.push({ breaker, detail, severity: 'critical' });
  });
  
  return violations;
};

// Important qualities mapping
const QUALITY_FIELD_MAPPING = {
  'cleanliness': 'cleanliness', 'clean': 'cleanliness', 'tidy': 'cleanliness', 'neat': 'cleanliness',
  'organization': 'organizationLevel', 'organized': 'organizationLevel',
  'quiet': 'noiseLevel', 'quiet environment': 'noiseLevel', 'peace': 'noiseLevel',
  'sleep': 'sleepSchedule', 'sleep schedule': 'sleepSchedule', 'early bird': 'sleepSchedule', 'night owl': 'sleepSchedule',
  'social': 'socialLevel', 'respect': 'guestFrequency', 'privacy': 'guestFrequency', 'guests': 'guestFrequency',
  'smoking': 'smoking', 'non-smoking': 'smoking', 'pets': 'pets', 'temperature': 'temperaturePreference'
};

const getImportantFieldMatches = (user1ImportantQualities, user2ImportantQualities, user1Q, user2Q) => {
  const bonusFields = new Set();
  const user1Important = parseArray(user1ImportantQualities).filter(q => q && typeof q === 'string');
  const user2Important = parseArray(user2ImportantQualities).filter(q => q && typeof q === 'string');
  
  const commonQualities = user1Important.filter(q => 
    user2Important.some(q2 => {
      if (!q || !q2) return false;
      const qLower = q.toLowerCase();
      const q2Lower = q2.toLowerCase();
      return qLower.includes(q2Lower) || q2Lower.includes(qLower);
    })
  );
  
  commonQualities.forEach(quality => {
    if (!quality || typeof quality !== 'string') return;
    const qualityLower = quality.toLowerCase();
    const field = Object.keys(QUALITY_FIELD_MAPPING).find(key => qualityLower.includes(key));
    if (field) {
      const mappedField = QUALITY_FIELD_MAPPING[field];
      if (user1Q && user2Q && user1Q[mappedField] && user2Q[mappedField] && user1Q[mappedField] === user2Q[mappedField]) {
        bonusFields.add(mappedField);
      }
    }
  });
  
  return bonusFields;
};

// Main compatibility calculation
export const calculateCompatibility = (user1Questionnaire, user2Questionnaire) => {
  if (!user1Questionnaire || !user2Questionnaire) {
    return {
      score: 0,
      matchReasons: [],
      potentialConflicts: [],
      dealBreakerViolations: [],
      categoryScores: {}
    };
  }
  
  const q1 = user1Questionnaire;
  const q2 = user2Questionnaire;
  
  let baseScore = 0;
  const matchReasons = [];
  const potentialConflicts = [];
  const categoryScores = {
    personalQualities: 0,
    coreLifestyle: 0,
    studyEnvironment: 0,
    healthLifestyle: 0,
    personalConnection: 0
  };
  
  // Track points for each category
  let qualitiesPoints = 0;
  let corePoints = 0;
  let studyPoints = 0;
  let healthPoints = 0;
  let connectionPoints = 0;
  
  // Fields that will get bonus multipliers
  const bonusFields = getImportantFieldMatches(q1.importantQualities, q2.importantQualities, q1, q2);
  
  // ========================================
  // PERSONAL QUALITIES MATCH (20 points)
  // ========================================
  
  // Check what user1 wants and if user2 has those qualities
  const user1WantsQualities = parseArray(q1.importantQualities).filter(q => q && typeof q === 'string');
  const user2HasQualities = parseArray(q2.personalQualities).filter(q => q && typeof q === 'string');
  
  if (user1WantsQualities.length > 0) {
    // Count how many of user1's wanted qualities user2 has
    const matchedQualities = user1WantsQualities.filter(wantedQuality => 
      user2HasQualities.some(hasQuality => {
        const wanted = wantedQuality.toLowerCase().trim();
        const has = hasQuality.toLowerCase().trim();
        // Check for exact match or close match
        return wanted === has || wanted.includes(has) || has.includes(wanted);
      })
    );
    
    const matchRatio = matchedQualities.length / user1WantsQualities.length;
    // Increased by 50%: 20 points → 30 points max
    qualitiesPoints = Math.round(matchRatio * 30);
    
    if (qualitiesPoints > 0) {
      matchReasons.push({
        category: 'Personal Qualities',
        detail: `They have ${matchedQualities.length}/${user1WantsQualities.length} qualities you're looking for${matchedQualities.length > 0 ? ': ' + matchedQualities.join(', ') : ''}`,
        points: qualitiesPoints
      });
    } else if (user1WantsQualities.length > 0) {
      potentialConflicts.push({
        category: 'Personal Qualities',
        detail: `They don't have the specific qualities you're looking for (You want: ${user1WantsQualities.join(', ')})`,
        severity: 'medium'
      });
    }
  }
  
  categoryScores.personalQualities = qualitiesPoints;
  baseScore += qualitiesPoints;
  
  // ========================================
  // CORE LIFESTYLE COMPATIBILITY (35 points)
  // ========================================
  
  // 1. Sleep Schedule (5 points)
  let sleepPoints = 0;
  if (q1.sleepSchedule && q2.sleepSchedule) {
    const sleepDiff = Math.abs(getLevel('sleepSchedule', q1.sleepSchedule) - getLevel('sleepSchedule', q2.sleepSchedule));
    if (q1.sleepSchedule === q2.sleepSchedule) {
      sleepPoints = 5;
      matchReasons.push({
        category: 'Sleep Schedule',
        detail: `You both are '${q1.sleepSchedule}s' - perfect match for sleep compatibility`,
        points: 5
      });
    } else if (q1.sleepSchedule === 'Flexible' || q2.sleepSchedule === 'Flexible') {
      sleepPoints = 3;
      matchReasons.push({
        category: 'Sleep Schedule',
        detail: `Your sleep schedules can adapt to each other (${q1.sleepSchedule === 'Flexible' ? 'you are' : 'they are'} '${q1.sleepSchedule === 'Flexible' ? 'Flexible' : q2.sleepSchedule}')`,
        points: 3
      });
    } else {
      potentialConflicts.push({
        category: 'Sleep Schedule',
        detail: `Different sleep schedules: You are ${q1.sleepSchedule === 'Early Bird' ? 'an' : 'a'} '${q1.sleepSchedule}' while they are ${q2.sleepSchedule === 'Early Bird' ? 'an' : 'a'} '${q2.sleepSchedule}'`,
        severity: 'high'
      });
    }
  }
  
  // Apply bonus if sleep is important to both
  if (bonusFields.has('sleepSchedule')) {
    sleepPoints = Math.round(sleepPoints * 1.5);
  }
  corePoints += sleepPoints;
  
  // 2. Wake/Sleep Time Alignment (4 points total: 2 for wake, 2 for sleep)
  let timePoints = 0;
  try {
    const wake1 = parseTimeToHour(q1.wakeUpTime);
    const wake2 = parseTimeToHour(q2.wakeUpTime);
    const sleep1 = parseTimeToHour(q1.sleepTime);
    const sleep2 = parseTimeToHour(q2.sleepTime);
    
    if (wake1 !== null && wake2 !== null && sleep1 !== null && sleep2 !== null) {
      const wakeDiff = Math.abs(wake1 - wake2);
      const sleepDiff = Math.abs(sleep1 - sleep2);
      
      // Check wake times separately (2 points)
      if (wakeDiff <= 1) {
        timePoints += 2;
        matchReasons.push({
          category: 'Wake Up Time',
          detail: `You both wake up around the same time (You: ${q1.wakeUpTime}, Them: ${q2.wakeUpTime})`,
          points: 2
        });
      } else if (wakeDiff <= 2) {
        timePoints += 1;
        matchReasons.push({
          category: 'Wake Up Time',
          detail: `Similar wake up times with a small difference (You: ${q1.wakeUpTime}, Them: ${q2.wakeUpTime})`,
          points: 1
        });
      } else {
        potentialConflicts.push({
          category: 'Wake Up Time',
          detail: `Different wake up times - you wake up at ${q1.wakeUpTime} while they wake up at ${q2.wakeUpTime}`,
          severity: wakeDiff > 4 ? 'high' : 'medium'
        });
      }
      
      // Check sleep times separately (2 points)
      if (sleepDiff <= 1) {
        timePoints += 2;
        matchReasons.push({
          category: 'Sleep Time',
          detail: `You both go to bed around the same time (You: ${q1.sleepTime}, Them: ${q2.sleepTime})`,
          points: 2
        });
      } else if (sleepDiff <= 2) {
        timePoints += 1;
        matchReasons.push({
          category: 'Sleep Time',
          detail: `Similar bed times with a small difference (You: ${q1.sleepTime}, Them: ${q2.sleepTime})`,
          points: 1
        });
      } else {
        potentialConflicts.push({
          category: 'Sleep Time',
          detail: `Different bed times - you sleep at ${q1.sleepTime} while they sleep at ${q2.sleepTime}`,
          severity: sleepDiff > 4 ? 'high' : 'medium'
        });
      }
    }
  } catch (e) {
    // Skip time comparison if parsing fails
  }
  corePoints += timePoints;
  
  // 3. Cleanliness (9 points)
  corePoints += compareField('cleanliness', q1.cleanliness, q2.cleanliness, {
    maxPoints: 9,
    matchThreshold: 2,
    category: 'Cleanliness',
    matchMsg: (v1, v2, diff) => diff === 0 ? `You both have the same cleanliness standards: '${v1}'` :
                                 diff === 1 ? `Very close cleanliness levels (You: '${v1}', Them: '${v2}') - minor compromise` :
                                 `Some difference in cleanliness (You: '${v1}', Them: '${v2}') - may need discussion`,
    conflictMsg: (v1, v2) => `Significant cleanliness difference: You are '${v1}' while they are '${v2}'`,
    severity: 'high'
  }, bonusFields, matchReasons, potentialConflicts);
  
  // 4. Organization (7 points)
  corePoints += compareField('organizationLevel', q1.organizationLevel, q2.organizationLevel, {
    maxPoints: 7,
    matchThreshold: 1,
    category: 'Organization',
    matchMsg: (v1, v2, diff) => diff === 0 ? `You both have compatible organization styles: '${v1}'` :
                                `Compatible organization styles (You: '${v1}', Them: '${v2}')`,
    conflictMsg: (v1, v2) => `Different organization approaches: You are '${v1}' while they are '${v2}'`,
    severity: 'medium'
  }, bonusFields, matchReasons, potentialConflicts);
  
  // 5. Social Level (10 points)
  corePoints += compareField('socialLevel', q1.socialLevel, q2.socialLevel, {
    maxPoints: 10,
    matchThreshold: 1,
    category: 'Social Preferences',
    matchMsg: (v1, v2, diff) => diff === 0 ? `You both are '${v1}' - aligned social needs` :
                                 `Slightly different social levels (You: '${v1}', Them: '${v2}') but can balance`,
    conflictMsg: (v1, v2) => `Opposite social needs: You are '${v1}' while they are '${v2}'`,
    severity: 'high'
  }, bonusFields, matchReasons, potentialConflicts);
  
  categoryScores.coreLifestyle = corePoints;
  baseScore += corePoints;
  
  // ========================================
  // STUDY & ENVIRONMENT (20 points)
  // ========================================
  
  // 6. Study Time (3 points)
  if (q1.studyTime && q2.studyTime && q1.studyTime === q2.studyTime) {
    studyPoints += 3;
    matchReasons.push({
      category: 'Study Time',
      detail: `Both of you prefer studying in the ${q1.studyTime}`,
      points: 3
    });
  }
  
  // 7. Noise Level (5 points)
  studyPoints += compareField('noiseLevel', q1.noiseLevel, q2.noiseLevel, {
    maxPoints: 5,
    matchThreshold: 1,
    category: 'Noise Level',
    matchMsg: (v1, v2, diff) => diff === 0 ? `You both prefer '${v1}' noise levels` :
                                 `Close noise preferences (You: '${v1}', Them: '${v2}')`,
    conflictMsg: (v1, v2) => `Very different noise preferences: You prefer '${v1}' while they prefer '${v2}'`,
    severity: 'high'
  }, bonusFields, matchReasons, potentialConflicts);
  
  // 8. Music While Studying (2 points)
  if (q1.musicWhileStudying && q2.musicWhileStudying && q1.musicWhileStudying === q2.musicWhileStudying) {
    studyPoints += 2;
    matchReasons.push({
      category: 'Study Music',
      detail: `You both ${q1.musicWhileStudying === 'Yes' ? 'like' : 'prefer no'} music while studying`,
      points: 2
    });
  }
  
  // 9. Guest Frequency (5 points)
  studyPoints += compareField('guestFrequency', q1.guestFrequency, q2.guestFrequency, {
    maxPoints: 5,
    matchThreshold: 1,
    category: 'Guest Frequency',
    matchMsg: (v1, v2, diff) => diff === 0 ? `You both have guests '${v1}' - aligned expectations` :
                                 `Similar guest frequency (You: '${v1}', Them: '${v2}')`,
    conflictMsg: (v1, v2) => `Different guest expectations: You have guests '${v1}' while they have guests '${v2}'`,
    severity: 'high'
  }, bonusFields, matchReasons, potentialConflicts);
  
  // 10. Temperature (4 points)
  studyPoints += compareField('temperaturePreference', q1.temperaturePreference, q2.temperaturePreference, {
    maxPoints: 4,
    matchThreshold: 1,
    category: 'Temperature',
    matchMsg: (v1, v2, diff) => diff === 0 ? `You both prefer '${v1}' temperatures` :
                                 `Close temperature preferences (You: '${v1}', Them: '${v2}')`,
    conflictMsg: (v1, v2) => `Opposite temperature preferences: You prefer '${v1}' while they prefer '${v2}'`,
    severity: 'medium'
  }, bonusFields, matchReasons, potentialConflicts);
  
  // 11. Shared Spaces (1 point)
  if (q1.sharedSpaces && q2.sharedSpaces && q1.sharedSpaces === q2.sharedSpaces) {
    studyPoints += 1;
    matchReasons.push({
      category: 'Shared Spaces',
      detail: `Both of you ${q1.sharedSpaces === 'Yes' ? 'are comfortable' : 'prefer not'} sharing common spaces`,
      points: 1
    });
  }
  
  categoryScores.studyEnvironment = studyPoints;
  baseScore += studyPoints;
  
  // ========================================
  // HEALTH & LIFESTYLE (10 points)
  // ========================================
  
  // 12. Smoking (5 points) - Critical
  if (q1.smoking && q2.smoking) {
    if (q1.smoking === q2.smoking) {
      healthPoints += 5;
      matchReasons.push({
        category: 'Smoking',
        detail: `Both ${q1.smoking === 'Yes' ? 'smoke' : q1.smoking === 'No' ? 'are non-smokers' : 'occasionally smoke'}`,
        points: 5
      });
    } else {
      potentialConflicts.push({
        category: 'Smoking',
        detail: `Smoking preference mismatch: ${q1.smoking} vs ${q2.smoking}`,
        severity: (q1.smoking === 'Yes' && q2.smoking === 'No') || (q1.smoking === 'No' && q2.smoking === 'Yes') ? 'critical' : 'medium'
      });
    }
    
    if (bonusFields.has('smoking')) {
      healthPoints += 2; // Flat bonus instead of multiplier
    }
  }
  
  // 13. Drinking (2 points)
  if (q1.drinking && q2.drinking && q1.drinking === q2.drinking) {
    healthPoints += 2;
    matchReasons.push({
      category: 'Drinking',
      detail: `Both drink ${q1.drinking.toLowerCase()}`,
      points: 2
    });
  }
  
  // 14. Pets (3 points)
  if (q1.pets && q2.pets) {
    // Normalize pet values for comparison
    const hasPets1 = q1.pets.includes('Have Pets') || q1.pets === 'Yes';
    const hasPets2 = q2.pets.includes('Have Pets') || q2.pets === 'Yes';
    const openToPets1 = q1.pets.includes('Open to Them') || q1.pets === 'Maybe';
    const openToPets2 = q2.pets.includes('Open to Them') || q2.pets === 'Maybe';
    const noPets1 = q1.pets.includes('Prefer None') || q1.pets === 'No';
    const noPets2 = q2.pets.includes('Prefer None') || q2.pets === 'No';
    
    // Full compatibility scenarios (3 points)
    if (q1.pets === q2.pets) {
      // Exact match
      healthPoints += 3;
      matchReasons.push({
        category: 'Pets',
        detail: `Both have matching pet preferences: ${q1.pets}`,
        points: 3
      });
    }
    else if ((hasPets1 && openToPets2) || (hasPets2 && openToPets1)) {
      // One has pets, other is open to them - fully compatible!
      healthPoints += 3;
      matchReasons.push({
        category: 'Pets',
        detail: `Fully compatible - one has pets, the other is open to them`,
        points: 3
      });
    }
    else if ((openToPets1 && openToPets2)) {
      // Both open to pets - fully compatible!
      healthPoints += 3;
      matchReasons.push({
        category: 'Pets',
        detail: `Both are open to pets - fully flexible and compatible`,
        points: 3
      });
    }
    // Partial compatibility scenarios (1 point)
    else if ((noPets1 && openToPets2) || (noPets2 && openToPets1)) {
      healthPoints += 1;
      matchReasons.push({
        category: 'Pets',
        detail: `One prefers no pets, but the other is flexible - possible compromise`,
        points: 1
      });
    }
    // Conflict scenarios (0 points)
    else if ((hasPets1 && noPets2) || (hasPets2 && noPets1)) {
      potentialConflicts.push({
        category: 'Pets',
        detail: `Pet conflict: ${q1.pets} vs ${q2.pets}`,
        severity: 'high'
      });
    }
    else {
      potentialConflicts.push({
        category: 'Pets',
        detail: `Pet preferences differ: ${q1.pets} vs ${q2.pets}`,
        severity: 'medium'
      });
    }
    
    if (bonusFields.has('pets')) {
      healthPoints += 1;
    }
  }
  
  categoryScores.healthLifestyle = healthPoints;
  baseScore += healthPoints;
  
  // ========================================
  // PERSONAL CONNECTION (10 points)
  // ========================================
  
  // 15. Shared Interests (up to 15 points - increased from 10)
  const interests1 = parseArray(q1.interests);
  const interests2 = parseArray(q2.interests);
  const sharedInterests = interests1.filter(interest => interests2.includes(interest));
  
  let interestPoints = 0;
  // Increased scoring: ~5 points per shared interest
  if (sharedInterests.length >= 3) {
    interestPoints = 15;
    matchReasons.push({
      category: 'Shared Interests',
      detail: `${sharedInterests.length} common interests: ${sharedInterests.slice(0, 5).join(', ')}${sharedInterests.length > 5 ? '...' : ''}`,
      points: 15
    });
  } else if (sharedInterests.length === 2) {
    interestPoints = 10;
    matchReasons.push({
      category: 'Shared Interests',
      detail: `Several common interests: ${sharedInterests.join(', ')}`,
      points: 10
    });
  } else if (sharedInterests.length === 1) {
    interestPoints = 5;
    matchReasons.push({
      category: 'Shared Interests',
      detail: `One common interest: ${sharedInterests[0]}`,
      points: 5
    });
  }
  
  connectionPoints += interestPoints;
  categoryScores.personalConnection = connectionPoints;
  baseScore += connectionPoints;
  
  // ========================================
  // DEAL BREAKERS (Unidirectional - only user1's perspective)
  // ========================================
  
  // Only check if user2 violates user1's deal breakers (not the other way around)
  const dealBreakerViolations = checkDealBreakers(q1.dealBreakers, q2);
  
  // Add violations to conflicts AND deduct points
  dealBreakerViolations.forEach(violation => {
    potentialConflicts.push({
      category: 'Deal Breaker Violation',
      detail: violation.detail,
      severity: 'critical'
    });
    
    // REDUCED PENALTY: Deduct 10 points per deal breaker violation (was 15)
    baseScore -= 10;
  });
  
  // Apply +10 bonus if user1 has deal breakers and user2 doesn't violate any (was +5)
  const dealBreakers1 = parseArray(q1.dealBreakers);
  if (dealBreakers1.length > 0 && dealBreakerViolations.length === 0) {
    baseScore += 10;
    matchReasons.push({
      category: 'Deal Breakers',
      detail: `No deal breaker conflicts - they respect all your requirements!`,
      points: 10
    });
  } else if (dealBreakerViolations.length > 0) {
    // Add a match reason showing the total deduction
    const totalDeduction = dealBreakerViolations.length * 10;
    matchReasons.push({
      category: 'Deal Breaker Penalties',
      detail: `${dealBreakerViolations.length} critical violation${dealBreakerViolations.length > 1 ? 's' : ''} - severe compatibility concerns`,
      points: -totalDeduction
    });
  }
  
  // ========================================
  // REVERSE DEAL BREAKERS (For "Things to Discuss")
  // ========================================
  // Check if user1 violates user2's deal breakers (doesn't affect score)
  const reverseDealBreakerViolations = checkDealBreakers(q2.dealBreakers, q1);
  
  // ========================================
  // FINAL SCORE
  // ========================================
  
  // Normalize to 0-100
  const finalScore = Math.min(100, Math.max(0, Math.round(baseScore)));
  
  return {
    score: finalScore,
    matchReasons: matchReasons.sort((a, b) => (b.points || 0) - (a.points || 0)), // Sort by points descending
    potentialConflicts: potentialConflicts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    dealBreakerViolations: dealBreakerViolations,
    reverseDealBreakerViolations: reverseDealBreakerViolations, // NEW: User 1 meets User 2's deal breakers
    categoryScores
  };
};

/**
 * Get compatibility badge color based on score
 */
export const getCompatibilityColor = (score) => {
  if (score >= 85) return 'green';
  if (score >= 70) return 'blue';
  if (score >= 50) return 'yellow';
  return 'red';
};

/**
 * Get compatibility label based on score
 */
export const getCompatibilityLabel = (score) => {
  if (score >= 90) return 'Excellent Match';
  if (score >= 80) return 'Great Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Fair Match';
  if (score >= 50) return 'Possible Match';
  return 'Low Compatibility';
};

/**
 * Sort listings by compatibility score
 */
export const sortByCompatibility = (listings) => {
  return [...listings].sort((a, b) => {
    const scoreA = a.compatibilityScore || 0;
    const scoreB = b.compatibilityScore || 0;
    return scoreB - scoreA;
  });
};