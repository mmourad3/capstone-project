import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * CREATE USER (SIGNUP / REGISTER)
 */
export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      role,
      country,
      university,
      region,
    } = req.body;

    // 1. check if user already exists
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      gender,
      role,
      country,
      university,
      region: region || null,
    });

    // 4. create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_CODE,
      { expiresIn: "1d" },
    );

    // 5. response (IMPORTANT: do NOT send password)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

/**
 * GET USER BY ID
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET CURRENT USER (LOGGED IN)
 */
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE USER PROFILE
 */
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await UserModel.update(req.user.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE USER
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await UserModel.delete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
