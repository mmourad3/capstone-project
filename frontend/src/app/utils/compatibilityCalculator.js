/**
 * Comprehensive Compatibility Calculator for Backend
 *
 * This is the server-side version that can be used with Prisma/PostgreSQL
 * Imports the core calculation logic from the shared calculator
 */

import { calculateCompatibility as coreCalculate } from "./comprehensiveCompatibilityCalculator.js";

/**
 * Calculate compatibility and format for database storage
 * @param {Object} seekerQuestionnaire - Seeker's questionnaire
 * @param {Object} providerQuestionnaire - Provider's questionnaire
 * @returns {Object} - Formatted for Prisma CompatibilityScore model
 */
export function calculateCompatibilityForDB(
  seekerQuestionnaire,
  providerQuestionnaire,
) {
  if (!seekerQuestionnaire || !providerQuestionnaire) {
    return {
      score: 0,
      matchReasons: JSON.stringify([]),
      potentialConflicts: JSON.stringify([]),
      dealBreakerViolations: JSON.stringify([]),
      categoryScores: JSON.stringify({}),
    };
  }

  // Use the comprehensive calculator
  const result = coreCalculate(seekerQuestionnaire, providerQuestionnaire);

  // Format for database (convert arrays/objects to JSON strings)
  return {
    score: result.score,
    matchReasons: JSON.stringify(result.matchReasons),
    potentialConflicts: JSON.stringify(result.potentialConflicts),
    dealBreakerViolations: JSON.stringify(result.dealBreakerViolations),
    categoryScores: JSON.stringify(result.categoryScores),
  };
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use calculateCompatibilityForDB instead
 */
export function calculateCompatibilityScore(
  seekerQuestionnaire,
  providerQuestionnaire,
) {
  const result = calculateCompatibilityForDB(
    seekerQuestionnaire,
    providerQuestionnaire,
  );
  return result.score;
}

/**
 * Parse database compatibility record back to object format
 * @param {Object} dbRecord - Record from Prisma CompatibilityScore model
 * @returns {Object} - Parsed compatibility data
 */
export function parseCompatibilityFromDB(dbRecord) {
  if (!dbRecord) return null;

  return {
    score: dbRecord.score,
    matchReasons: JSON.parse(dbRecord.matchReasons || "[]"),
    potentialConflicts: JSON.parse(dbRecord.potentialConflicts || "[]"),
    dealBreakerViolations: JSON.parse(dbRecord.dealBreakerViolations || "[]"),
    categoryScores: JSON.parse(dbRecord.categoryScores || "{}"),
    createdAt: dbRecord.createdAt,
    updatedAt: dbRecord.updatedAt,
  };
}
