import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  checkEmailExists,
  checkPhoneExists,
  getAllUsers,
  getUser,
  getMe,
  updateProfile,
  deleteMe,
  changePassword
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-email", checkEmailExists);
router.get("/check-phone", checkPhoneExists);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/password", protect, changePassword);
router.delete("/me", protect, deleteMe);
export default router;
