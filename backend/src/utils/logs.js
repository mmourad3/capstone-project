import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_DIRECTORY = path.resolve(__dirname, "../../logs");
const AI_MATCH_LOG_FILE = path.join(LOG_DIRECTORY, "ai-matching.log");

export const saveAiMatchLog = async ({
  seekerId,
  candidateId,
  ruleScore,
  transformerScore,
  ruleContribution,
  aiContribution,
  finalScore,
  model,
}) => {
  try {
    await fs.mkdir(LOG_DIRECTORY, { recursive: true });

    const logEntry = {
      timestamp: new Date().toISOString(),
      seekerId,
      candidateId,
      model,
      ruleScoreOutOf100: ruleScore,
      transformerScoreOutOf100: transformerScore,
      similarityOutOf70: ruleContribution,
      aiOutOf30: aiContribution,
      finalScoreOutOf100: finalScore,
    };

    await fs.appendFile(
      AI_MATCH_LOG_FILE,
      `${JSON.stringify(logEntry)}\n`,
      "utf8",
    );
  } catch (error) {
    console.error("Failed to save AI match log:", error);
  }
};
