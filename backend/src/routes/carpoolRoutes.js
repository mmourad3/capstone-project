import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllCarpools,
  getCarpoolById,
  getMyCarpools,
  getJoinedCarpools,
  getJoinedCarpoolIds,
  createCarpool,
  updateCarpool,
  deleteCarpool,
  joinCarpool,
  leaveCarpool,
  removePassenger,
} from "../controllers/carpoolController.js";

const router = express.Router();

router.get("/", getAllCarpools);
router.get("/my-listings", protect, getMyCarpools);
router.get("/joined", protect, getJoinedCarpools);
router.get("/joined/ids", protect, getJoinedCarpoolIds);
router.get("/:id", getCarpoolById);

router.post("/", protect, createCarpool);
router.put("/:id", protect, updateCarpool);
router.delete("/:id", protect, deleteCarpool);

router.post("/:id/join", protect, joinCarpool);
router.delete("/:id/leave", protect, leaveCarpool);
router.delete("/:id/passengers/:passengerId", protect, removePassenger);

export default router;
