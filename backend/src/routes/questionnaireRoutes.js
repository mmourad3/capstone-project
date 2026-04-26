import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveQuestionnaire,
  getMyQuestionnaire,
} from "../controllers/questionnaireController.js";

const router = express.Router();

router.post("/", protect, saveQuestionnaire);
router.get("/me", protect, getMyQuestionnaire);

export default router;