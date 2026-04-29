import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCarpool,
  deleteCarpool,
  getAllCarpools,
  getUserCarpools,
  joinCarpool,
  leaveCarpool,
} from "../controllers/carpoolController.js";

const router = express.Router();

router.get("/", getAllCarpools);
router.get("/user/:userId", protect, getUserCarpools);
router.post("/", protect, createCarpool);
router.post("/:id/join", protect, joinCarpool);
router.delete("/:id/leave", protect, leaveCarpool);
router.delete("/:id", protect, deleteCarpool);

export default router;
