import { QuestionnaireModel } from "../models/QuestionnaireModel.js";

export const saveQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;

    const questionnaire = await QuestionnaireModel.upsertByUserId(
      userId,
      req.body,
    );

    return res.json({
      message: "Questionnaire saved successfully",
      questionnaire,
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

