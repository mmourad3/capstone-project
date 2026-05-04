import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllCarpools,
  getCarpoolById,
  getMyCarpools,
  getJoinedCarpools,
<<<<<<< HEAD
  createCarpool,
  joinCarpool,
  leaveCarpool,
  deleteCarpool,
} from "../controllers/CarpoolController.js";
=======
  getJoinedCarpoolIds,
  createCarpool,
  updateCarpool,
  deleteCarpool,
  joinCarpool,
  leaveCarpool,
  removePassenger,
} from "../controllers/carpoolController.js";
>>>>>>> 09e2ec550d79a039c8bfc4c8a5239d72a9b62607

const router = express.Router();

router.get("/", getAllCarpools);
<<<<<<< HEAD
router.get("/my", protect, getMyCarpools);
router.get("/joined", protect, getJoinedCarpools);
router.get("/:id", getCarpoolById);

router.post("/", protect, createCarpool);
router.post("/:id/join", protect, joinCarpool);
router.delete("/:id/leave", protect, leaveCarpool);
router.delete("/:id", protect, deleteCarpool);

=======
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

>>>>>>> 09e2ec550d79a039c8bfc4c8a5239d72a9b62607
export default router;
