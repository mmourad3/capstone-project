import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllDormListings,
  getDormListingById,
  getMyDormListings,
  createDormListing,
  updateDormListing,
  deleteDormListing,
} from "../controllers/dormListingController.js";

const router = express.Router();

router.get("/", getAllDormListings);
router.get("/my-listings", protect, getMyDormListings);
router.get("/:id", getDormListingById);

router.post("/", protect, createDormListing);
router.put("/:id", protect, updateDormListing);
router.delete("/:id", protect, deleteDormListing);

export default router;
