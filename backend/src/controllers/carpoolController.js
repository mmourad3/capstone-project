import { CarpoolModel } from "../models/CarpoolModel.js";
import { UserModel } from "../models/UserModel.js";

export const getAllCarpools = async (_req, res) => {
  try {
    const carpools = await CarpoolModel.findAll();
    return res.json(carpools);
  } catch (error) {
    console.error("Get carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch carpools" });
  }
};

export const getUserCarpools = async (req, res) => {
  try {
    const carpools = await CarpoolModel.findByDriverId(req.params.userId);
    return res.json(carpools);
  } catch (error) {
    console.error("Get user carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch user carpools" });
  }
};

export const createCarpool = async (req, res) => {
  try {
    const driver = await UserModel.findById(req.user.id);

    if (!driver || driver.role !== "carpool") {
      return res.status(403).json({ message: "Only registered carpool students can create carpools" });
    }

    const carpool = await CarpoolModel.create(driver, req.body);
    return res.status(201).json(carpool);
  } catch (error) {
    console.error("Create carpool error:", error);
    return res.status(500).json({ message: "Failed to create carpool" });
  }
};

export const deleteCarpool = async (req, res) => {
  try {
    const carpool = await CarpoolModel.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({ message: "Carpool not found" });
    }

    if (carpool.driverId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own carpools" });
    }

    await CarpoolModel.delete(req.params.id);
    return res.json({ message: "Carpool deleted successfully" });
  } catch (error) {
    console.error("Delete carpool error:", error);
    return res.status(500).json({ message: "Failed to delete carpool" });
  }
};

export const joinCarpool = async (req, res) => {
  try {
    const carpool = await CarpoolModel.findById(req.params.id);
    const passenger = await UserModel.findById(req.user.id);

    if (!carpool) {
      return res.status(404).json({ message: "Carpool not found" });
    }

    if (!passenger || passenger.role !== "carpool") {
      return res.status(403).json({ message: "Only registered carpool students can join carpools" });
    }

    if (carpool.driverId === passenger.id) {
      return res.status(400).json({ message: "You cannot join your own carpool" });
    }

    if (carpool.seats >= carpool.totalSeats) {
      return res.status(400).json({ message: "This carpool is full" });
    }

    if (carpool.passengers.some((item) => item.id === passenger.id)) {
      return res.status(400).json({ message: "You already joined this carpool" });
    }

    const updated = await CarpoolModel.addPassenger(carpool, passenger);
    return res.json(updated);
  } catch (error) {
    console.error("Join carpool error:", error);
    return res.status(500).json({ message: "Failed to join carpool" });
  }
};

export const leaveCarpool = async (req, res) => {
  try {
    const updated = await CarpoolModel.removePassenger(req.params.id, req.user.id);
    return res.json(updated);
  } catch (error) {
    console.error("Leave carpool error:", error);
    return res.status(500).json({ message: "Failed to leave carpool" });
  }
};
