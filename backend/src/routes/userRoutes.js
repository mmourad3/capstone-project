import express from "express";
import {
  register,
  login,
  checkEmailExists,
  checkPhoneExists,
  getAllUsers,
  getUser,
  getMe,
  updateProfile,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-email", checkEmailExists);
router.get("/check-phone", checkPhoneExists);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
//router.get("/me", getMe);
//router.put("/me", updateProfile);
router.delete("/users/:id", deleteUser);

export default router;
