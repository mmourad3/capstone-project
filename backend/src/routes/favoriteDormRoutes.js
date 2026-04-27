import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyFavoriteDormIds,
  getMyFavoriteDorms,
  addFavoriteDorm,
  removeFavoriteDorm,
} from "../controllers/favoriteDormController.js";

const router = express.Router();

router.get("/ids", protect, getMyFavoriteDormIds);
router.get("/", protect, getMyFavoriteDorms);
router.post("/", protect, addFavoriteDorm);
router.delete("/:dormId", protect, removeFavoriteDorm);

export default router;
