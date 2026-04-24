import express from "express";
import {
  createUser,
  getUser,
  getMe,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/me", getMe);
router.get("/:id", getUser);
router.put("/me", updateProfile);
router.delete("/:id", deleteUser);

export default router;
