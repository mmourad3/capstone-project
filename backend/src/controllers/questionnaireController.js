import { QuestionnaireModel } from "../models/QuestionnaireModel.js";
import { prisma } from "../utils/database.js";
import { calculateRoommateCompatibilityScore } from "../utils/roommateMatcher.js";
import { sendRoommateMatchEmail } from "../services/emailService.js";

const MATCH_THRESHOLD = 70;
const DORM_ROLES = ["dorm_seeker", "dorm_provider"];

const notifyUserAboutRoommateMatches = async (userId, questionnaire) => {
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

  if (matches.length === 0) {
    return { matchCount: 0, emailSent: false };
  }

  const emailResult = await sendRoommateMatchEmail({
    to: user.email,
    firstName: user.firstName,
    matchCount: matches.length,
  });

  return {
    matchCount: matches.length,
    emailSent: !emailResult.skipped,
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

    let matchNotification = null;

    if (!existingQuestionnaire) {
      try {
        matchNotification = await notifyUserAboutRoommateMatches(
          userId,
          questionnaire,
        );
      } catch (notificationError) {
        console.error("Roommate match notification error:", notificationError);
        matchNotification = {
          matchCount: 0,
          emailSent: false,
          error: "Roommate notification failed",
        };
      }
    }

    return res.json({
      message: "Questionnaire saved successfully",
      questionnaire,
      matchNotification,
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

