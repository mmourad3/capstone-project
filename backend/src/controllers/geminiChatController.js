import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SYSTEM_PROMPT = `
You are UniMate AI, a helpful chatbot for a student platform.

UniMate helps students:
- Find roommates
- Browse dorm listings
- Post dorm listings
- Complete questionnaires
- Get compatibility scores
- Use carpools

Rules:
- Be friendly.
- Keep answers short.
- Guide users step by step.
- Do not ask for passwords or sensitive data.
- If unsure, tell the user to check the correct section in the app.
`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const systemFilePath = path.resolve(__dirname, "../../data/system.txt");

let systemFileText = "";

try {
  systemFileText = fs.readFileSync(systemFilePath, "utf-8");
} catch (err) {
  console.log("System file not found, continuing without it.");
}

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;
    const trimmedMessage = message?.trim();

    if (!trimmedMessage) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        response: "Chatbot is not configured. Please add GEMINI_API_KEY in .env.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `
${SYSTEM_PROMPT}

Knowledge base:
${systemFileText}

User question:
${trimmedMessage}
  `,
    });

    res.json({
      response: response.text || "Sorry, I could not answer that.",
    });
  } catch (error) {
    console.error("Gemini chatbot error:", error);
    res.status(500).json({
      message: "Gemini chatbot failed. Please try again.",
    });
  }
};
