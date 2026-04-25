import { prisma } from "../utils/database.js";

export const createDorm = async (req, res) => {
  try {
    const dorm = await prisma.dorm.create({
      data: {
        ...req.body,
        providerId: req.user.id,
      },
    });

    res.status(201).json(dorm);
  } catch (error) {
    res.status(500).json({ message: "Failed to create dorm", error: error.message });
  }
};

export const getDorms = async (req, res) => {
  try {
    const dorms = await prisma.dorm.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(dorms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dorms", error: error.message });
  }
};

export const getDormById = async (req, res) => {
  try {
    const dorm = await prisma.dorm.findUnique({
      where: { id: req.params.id },
    });

    if (!dorm) return res.status(404).json({ message: "Dorm not found" });

    res.json(dorm);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dorm", error: error.message });
  }
};

export const updateDorm = async (req, res) => {
  try {
    const dorm = await prisma.dorm.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(dorm);
  } catch (error) {
    res.status(500).json({ message: "Failed to update dorm", error: error.message });
  }
};

export const deleteDorm = async (req, res) => {
  try {
    await prisma.dorm.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Dorm deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete dorm", error: error.message });
  }
};