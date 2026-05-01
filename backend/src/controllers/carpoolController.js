import { CarpoolModel } from "../models/CarpoolModel.js";

const getErrorResponse = (error) => {
  switch (error.message) {
    case "CARPOOL_NOT_FOUND":
      return [404, "Carpool not found"];
    case "NOT_CARPOOL_DRIVER":
      return [403, "You can only delete your own carpool"];
    case "CANNOT_JOIN_OWN_CARPOOL":
      return [400, "You cannot join your own carpool"];
    case "CARPOOL_FULL":
      return [400, "This carpool is full"];
    case "ALREADY_JOINED":
      return [400, "You already joined this carpool"];
    case "GENDER_RESTRICTED":
      return [
        403,
        "You cannot join this carpool because of the gender preference",
      ];
    case "PASSENGER_NOT_FOUND":
      return [404, "You have not joined this carpool"];
    default:
      return [500, "Something went wrong"];
  }
};

export const getAllCarpools = async (req, res) => {
  try {
    const carpools = await CarpoolModel.findAll();
    return res.json(carpools);
  } catch (error) {
    console.error("Get carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch carpools" });
  }
};

export const getCarpoolById = async (req, res) => {
  try {
    const carpool = await CarpoolModel.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({ message: "Carpool not found" });
    }

    return res.json(carpool);
  } catch (error) {
    console.error("Get carpool error:", error);
    return res.status(500).json({ message: "Failed to fetch carpool" });
  }
};

export const getMyCarpools = async (req, res) => {
  try {
    const carpools = await CarpoolModel.findByDriverId(req.user.id);
    return res.json(carpools);
  } catch (error) {
    console.error("Get my carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch your carpools" });
  }
};

export const getJoinedCarpools = async (req, res) => {
  try {
    const carpools = await CarpoolModel.findJoinedByUserId(req.user.id);
    return res.json(carpools);
  } catch (error) {
    console.error("Get joined carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch joined carpools" });
  }
};

export const createCarpool = async (req, res) => {
  try {
    const driver = await CarpoolModel.findUserById(req.user.id);

    if (!driver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (driver.role !== "carpool") {
      return res.status(403).json({
        message: "Only carpool users can create carpool listings",
      });
    }

    const requiredFields = [
      "pickupLocation",
      "pickupSpot",
      "destination",
      "date",
      "time",
      "totalSeats",
      "price",
      "carModel",
    ];

    const missingField = requiredFields.find((field) => !req.body[field]);

    if (missingField) {
      return res.status(400).json({
        message: `${missingField} is required`,
      });
    }

    if (Number(req.body.totalSeats) <= 0) {
      return res.status(400).json({
        message: "Total seats must be greater than 0",
      });
    }

    const carpool = await CarpoolModel.create(driver, req.body);

    return res.status(201).json({
      message: "Carpool created successfully",
      carpool,
    });
  } catch (error) {
    console.error("Create carpool error:", error);
    return res.status(500).json({ message: "Failed to create carpool" });
  }
};

export const joinCarpool = async (req, res) => {
  try {
    const passenger = await CarpoolModel.findUserById(req.user.id);

    if (!passenger) {
      return res.status(404).json({ message: "User not found" });
    }

    if (passenger.role !== "carpool") {
      return res.status(403).json({
        message: "Only carpool users can join carpools",
      });
    }

    const carpool = await CarpoolModel.addPassenger(req.params.id, passenger);

    return res.json({
      message: "Joined carpool successfully",
      carpool,
    });
  } catch (error) {
    console.error("Join carpool error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const leaveCarpool = async (req, res) => {
  try {
    const carpool = await CarpoolModel.removePassenger(
      req.params.id,
      req.user.id,
    );

    return res.json({
      message: "Left carpool successfully",
      carpool,
    });
  } catch (error) {
    console.error("Leave carpool error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const deleteCarpool = async (req, res) => {
  try {
    await CarpoolModel.delete(req.params.id, req.user.id);

    return res.json({
      message: "Carpool deleted successfully",
    });
  } catch (error) {
    console.error("Delete carpool error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};
