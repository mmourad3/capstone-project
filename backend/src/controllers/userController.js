import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_CODE || "dev_secret";

/**
 * SIGNUP / REGISTER
 */
export const register = async (req, res) => {
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
      countryCode,
      university,
      region,
      classSchedule,
      profilePicture,
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await UserModel.findByEmail(normalizedEmail);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPhone = await UserModel.findByPhone(phone);
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      gender,
      role,
      country,
      countryCode,
      university,
      region: region || null,
      profilePicture: profilePicture || null,
    });

    let savedSchedule = [];

    if (role === "carpool" && Array.isArray(classSchedule)) {
      savedSchedule = await UserModel.createScheduleBlocks(
        user.id,
        classSchedule,
      );
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        country: user.country,
        countryCode: user.countryCode,
        university: user.university,
        region: user.region,
        profilePicture: user.profilePicture,
        classSchedule: savedSchedule,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const classSchedule =
      user.role === "carpool"
        ? await UserModel.findScheduleByUserId(user.id)
        : [];

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        country: user.country,
        countryCode: user.countryCode,
        university: user.university,
        region: user.region,
        profilePicture: user.profilePicture,
        classSchedule,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * CHECK EMAIL EXISTS
 */
export const checkEmailExists = async (req, res) => {
  try {
    const email = req.query.email?.toLowerCase().trim();

    if (!email) {
      return res
        .status(400)
        .json({ exists: false, message: "Email is required" });
    }

    const user = await UserModel.findByEmail(email);

    return res.json({ exists: !!user });
  } catch (err) {
    console.error("Check email error:", err);
    return res
      .status(500)
      .json({ exists: false, message: "Email check failed" });
  }
};

/**
 * CHECK PHONE EXISTS
 */
export const checkPhoneExists = async (req, res) => {
  try {
    const phone = req.query.phone;

    if (!phone) {
      return res
        .status(400)
        .json({ exists: false, message: "Phone is required" });
    }

    const user = await UserModel.findByPhone(phone);

    return res.json({ exists: !!user });
  } catch (err) {
    console.error("Check phone error:", err);
    return res
      .status(500)
      .json({ exists: false, message: "Phone check failed" });
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
    const classSchedule =
      user.role === "carpool"
        ? await UserModel.findScheduleByUserId(user.id)
        : [];

    const { password, ...safeUser } = user;


    return res.json({
      ...safeUser,
      classSchedule,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET CURRENT USER
 */
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const classSchedule =
      user.role === "carpool"
        ? await UserModel.findScheduleByUserId(user.id)
        : [];

      const { password, ...safeUser } = user;
    return res.json({...safeUser,classSchedule,});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE USER PROFILE
 */
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await UserModel.update(req.user.id, req.body);

    return res.json({
      ...updatedUser,
      password: undefined,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE USER
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await UserModel.delete(id);

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();

    // Remove passwords before sending
    const safeUsers = users.map(({ password, ...user }) => user);

    res.json(safeUsers);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};