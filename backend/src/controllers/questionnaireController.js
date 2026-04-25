import { prisma } from "../utils/database.js";

// CREATE or UPDATE questionnaire
export const saveQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = req.body;

    const questionnaire = await prisma.questionnaire.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET current user's questionnaire
export const getMyQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { userId },
    });

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};