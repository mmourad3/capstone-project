import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createDorm,
  getDorms,
  getDormById,
  updateDorm,
  deleteDorm,
} from "../controllers/dormController.js";

const router = express.Router();

router.post("/", protect, createDorm);
router.get("/", getDorms);
router.get("/:id", getDormById);
router.put("/:id", protect, updateDorm);
router.delete("/:id", protect, deleteDorm);

export default router;