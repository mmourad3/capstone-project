import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import dormListingRoutes from "./routes/dormListingRoutes.js";
import geminiChatRoutes from "./routes/geminiChatRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/dorms", dormListingRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/gemini-chat", geminiChatRoutes);

export default app;