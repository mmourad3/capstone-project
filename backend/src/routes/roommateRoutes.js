import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getIncomingRequests,
  getSentRequests,
  getActiveRoommates,
  getStatus,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  endRelationship,
  submitFeedback,
} from "../controllers/roommateController.js";

const router = express.Router();

router.get("/requests/incoming", protect, getIncomingRequests);
router.get("/requests/sent", protect, getSentRequests);
router.get("/active", protect, getActiveRoommates);
router.get("/status", protect, getStatus);

router.post("/requests", protect, sendRequest);
router.patch("/requests/:id/accept", protect, acceptRequest);
router.patch("/requests/:id/reject", protect, rejectRequest);
router.delete("/requests/:id", protect, cancelRequest);

router.patch("/relationships/:id/end", protect, endRelationship);
router.post("/relationships/:id/feedback", protect, submitFeedback);

export default router;
