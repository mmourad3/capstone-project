import { QuestionnaireModel } from "../models/QuestionnaireModel.js";
import { prisma } from "../utils/database.js";
import { calculateRoommateCompatibilityScore } from "../utils/roommateMatcher.js";

const MATCH_THRESHOLD = 70;
const DORM_ROLES = ["dorm_seeker", "dorm_provider"];

const syncRoommateMatches = async (userId, questionnaire) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      university: true,
      role: true,
    },
  });

  if (!user || !DORM_ROLES.includes(user.role)) {
    return null;
  }

  const candidates = await prisma.questionnaire.findMany({
    where: {
      userId: { not: user.id },
      user: {
        role: { in: DORM_ROLES },
        university: user.university,
      },
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const matches = candidates
    .map((candidate) => ({
      userId: candidate.userId,
      score: calculateRoommateCompatibilityScore(questionnaire, candidate),
    }))
    .filter((match) => match.score >= MATCH_THRESHOLD);

  await Promise.all(
    matches.map((match) =>
      prisma.compatibilityScore.upsert({
        where: {
          seekerId_providerId: {
            seekerId: user.id,
            providerId: match.userId,
          },
        },
        update: {
          score: match.score,
          matchReasons: JSON.stringify([]),
          potentialConflicts: JSON.stringify([]),
          dealBreakerViolations: JSON.stringify([]),
          categoryScores: JSON.stringify({}),
        },
        create: {
          seekerId: user.id,
          providerId: match.userId,
          score: match.score,
          matchReasons: JSON.stringify([]),
          potentialConflicts: JSON.stringify([]),
          dealBreakerViolations: JSON.stringify([]),
          categoryScores: JSON.stringify({}),
        },
      }),
    ),
  );

  return {
    matchCount: matches.length,
  };
};

export const saveQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingQuestionnaire = await QuestionnaireModel.findByUserId(userId);

    const questionnaire = await QuestionnaireModel.upsertByUserId(
      userId,
      req.body,
    );

    let matchSync = null;

    if (!existingQuestionnaire) {
      try {
        matchSync = await syncRoommateMatches(
          userId,
          questionnaire,
        );
      } catch (matchSyncError) {
        console.error("Roommate match sync error:", matchSyncError);
        matchSync = {
          matchCount: 0,
          error: "Roommate match sync failed",
        };
      }
    }

    return res.json({
      message: "Questionnaire saved successfully",
      questionnaire,
      matchSync,
      matchNotification: matchSync,
    });
  } catch (error) {
    console.error("Save questionnaire error:", error);
    return res.status(500).json({ message: "Failed to save questionnaire" });
  }
};

export const getMyQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;

    const questionnaire = await QuestionnaireModel.findByUserId(userId);

    if (!questionnaire) {
      return res.status(404).json({ message: "Questionnaire not found" });
    }

    return res.json(questionnaire);
  } catch (error) {
    console.error("Get questionnaire error:", error);
    return res.status(500).json({ message: "Failed to fetch questionnaire" });
  }
};

