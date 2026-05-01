import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllCarpools,
  getCarpoolById,
  getMyCarpools,
  getJoinedCarpools,
  createCarpool,
  joinCarpool,
  leaveCarpool,
  deleteCarpool,
} from "../controllers/CarpoolController.js";

const router = express.Router();

router.get("/", getAllCarpools);
router.get("/my", protect, getMyCarpools);
router.get("/joined", protect, getJoinedCarpools);
router.get("/:id", getCarpoolById);

router.post("/", protect, createCarpool);
router.post("/:id/join", protect, joinCarpool);
router.delete("/:id/leave", protect, leaveCarpool);
router.delete("/:id", protect, deleteCarpool);

export default router;
