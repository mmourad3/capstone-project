import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_CODE || "dev_secret";

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

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findProfileById(id);

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

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findProfileById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const classSchedule =
      user.role === "carpool"
        ? await UserModel.findScheduleByUserId(user.id)
        : [];

    const { password, ...safeUser } = user;
    return res.json({ ...safeUser, classSchedule });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

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

export const deleteMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.delete(req.user.id);

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();

    const safeUsers = users.map(({ password, ...user }) => user);

    res.json(safeUsers);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await UserModel.findByIdWithPassword(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.update(req.user.id, {
      password: hashedPassword,
    });

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

export const updateMySchedule = async (req, res) => {
  try {
    const { classSchedule } = req.body;

    if (!Array.isArray(classSchedule) || classSchedule.length === 0) {
      return res.status(400).json({
        message: "Please add at least one schedule block",
      });
    }

    for (const block of classSchedule) {
      if (!Array.isArray(block.days) || block.days.length === 0) {
        return res.status(400).json({
          message: "Each schedule block must have at least one day",
        });
      }

      if (!block.startTime || !block.endTime) {
        return res.status(400).json({
          message: "Each schedule block must have start and end time",
        });
      }
    }

    const updatedSchedule = await UserModel.updateScheduleBlocks(
      req.user.id,
      classSchedule,
    );

    return res.json({ classSchedule: updatedSchedule });
  } catch (err) {
    console.error("Update schedule error:", err);
    return res.status(500).json({ message: "Failed to update schedule" });
  }
};