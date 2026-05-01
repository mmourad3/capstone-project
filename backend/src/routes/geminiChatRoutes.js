import express from "express";
import { chatWithGemini } from "../controllers/geminiChatController.js";

const router = express.Router();

router.post("/", chatWithGemini);

export default router;