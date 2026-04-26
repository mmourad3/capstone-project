import { prisma } from "../utils/database.js";

const arrayFields = [
  "interests",
  "personalQualities",
  "importantQualities",
  "dealBreakers",
];

const stringifyArrays = (data) => {
  const formatted = { ...data };

  arrayFields.forEach((field) => {
    formatted[field] = JSON.stringify(formatted[field] || []);
  });

  return formatted;
};

const parseArrays = (questionnaire) => {
  if (!questionnaire) return null;

  const parsed = { ...questionnaire };

  arrayFields.forEach((field) => {
    try {
      parsed[field] = parsed[field] ? JSON.parse(parsed[field]) : [];
    } catch {
      parsed[field] = [];
    }
  });

  return parsed;
};

export const QuestionnaireModel = {
  findByUserId: async (userId) => {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { userId },
    });

    return parseArrays(questionnaire);
  },

  upsertByUserId: async (userId, data) => {
    const formattedData = stringifyArrays(data);

    const questionnaire = await prisma.questionnaire.upsert({
      where: { userId },
      update: formattedData,
      create: {
        userId,
        ...formattedData,
      },
    });

    return parseArrays(questionnaire);
  },

  
};
