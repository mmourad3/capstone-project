import { CarpoolModel } from "../models/CarpoolModel.js";

const getErrorResponse = (error) => {
  switch (error.message) {
    case "CARPOOL_NOT_FOUND":
      return [404, "Carpool listing not found"];
    case "USER_NOT_FOUND":
      return [404, "User not found"];
    case "ONLY_CARPOOL_USERS":
      return [403, "Only carpool users can use this feature"];
    case "CANNOT_JOIN_OWN_CARPOOL":
      return [400, "You cannot join your own carpool"];
    case "CARPOOL_FULL":
      return [400, "This carpool is already full"];
    case "UNIVERSITY_MISMATCH":
      return [400, "You can only join carpools for your university"];
    case "REGION_MISMATCH":
      return [400, "You can only join carpools from your region"];
    case "GENDER_MISMATCH":
      return [403, "This carpool is restricted to the driver's same gender"];
    case "ALREADY_JOINED":
      return [400, "You already joined this carpool"];
    case "CREATED_DAY_CONFLICT":
      return [400, "You already created a carpool on one of these days"];
    case "JOINED_DAY_CONFLICT":
      return [400, "You already joined a carpool on one of these days"];
    case "PASSENGER_NOT_FOUND":
      return [404, "Passenger is not in this carpool"];
    case "NOT_CARPOOL_DRIVER":
      return [403, "Only the driver can do this"];
    default:
      return [500, "Something went wrong"];
  }
};

const validateCarpoolPayload = (data) => {
  if (!data.pickupSpot) return "Pickup spot is required";
  if (!data.destination) return "Destination is required";
  if (!data.date) return "Date is required";
  if (!data.time) return "Time is required";
  if (!Array.isArray(data.driverSchedule) || data.driverSchedule.length === 0) {
    return "Driver schedule is required";
  }
  if (!data.totalSeats || Number(data.totalSeats) <= 0) {
    return "Total seats must be greater than 0";
  }
  if (!data.price) return "Price is required";
  if (!data.carModel) return "Car model is required";

  return null;
};

export const getAllCarpools = async (req, res) => {
  try {
    const carpools = await CarpoolModel.findAll();
    return res.json(carpools);
  } catch (error) {
    console.error("Get all carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch carpools" });
  }
};

export const getCarpoolById = async (req, res) => {
  try {
    const carpool = await CarpoolModel.findById(req.params.id);

    if (!carpool) {
      return res.status(404).json({ message: "Carpool listing not found" });
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
    const carpools = await CarpoolModel.findJoinedByPassengerId(req.user.id);
    return res.json(carpools);
  } catch (error) {
    console.error("Get joined carpools error:", error);
    return res.status(500).json({ message: "Failed to fetch joined carpools" });
  }
};

export const getJoinedCarpoolIds = async (req, res) => {
  try {
    const ids = await CarpoolModel.findJoinedIdsByPassengerId(req.user.id);
    return res.json(ids);
  } catch (error) {
    console.error("Get joined carpool ids error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch joined carpool ids" });
  }
};

export const createCarpool = async (req, res) => {
  try {
    const validationError = validateCarpoolPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const carpool = await CarpoolModel.create(req.user.id, req.body);

    return res.status(201).json({
      message: "Carpool created successfully",
      carpool,
    });
  } catch (error) {
    console.error("Create carpool error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const updateCarpool = async (req, res) => {
  try {
    const existingCarpool = await CarpoolModel.findRawById(req.params.id);

    if (!existingCarpool) {
      return res.status(404).json({ message: "Carpool listing not found" });
    }

    if (existingCarpool.driverId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own carpool" });
    }

    if (
      req.body.totalSeats &&
      Number(req.body.totalSeats) < existingCarpool.passengers.length
    ) {
      return res.status(400).json({
        message: "Total seats cannot be less than current passengers",
      });
    }

    const carpool = await CarpoolModel.update(req.params.id, req.body);

    return res.json({
      message: "Carpool updated successfully",
      carpool,
    });
  } catch (error) {
    console.error("Update carpool error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const deleteCarpool = async (req, res) => {
  try {
    const existingCarpool = await CarpoolModel.findRawById(req.params.id);

    if (!existingCarpool) {
      return res.status(404).json({ message: "Carpool listing not found" });
    }

    if (existingCarpool.driverId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own carpool" });
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
    const carpool = await CarpoolModel.join(req.params.id, req.user.id);

    return res.json({
      message: "Joined carpool successfully",
      carpool,
    });
  } catch (error) {
    console.error("Join carpool error:", error);

    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "You already joined this carpool" });
    }

    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const leaveCarpool = async (req, res) => {
  try {
    const carpool = await CarpoolModel.leave(req.params.id, req.user.id);

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

export const removePassenger = async (req, res) => {
  try {
    const { passengerId } = req.params;

    if (!passengerId) {
      return res.status(400).json({ message: "Passenger is required" });
    }

    const carpool = await CarpoolModel.removePassenger(
      req.params.id,
      passengerId,
      req.user.id,
    );

    return res.json({
      message: "Passenger removed successfully",
      carpool,
    });
  } catch (error) {
    console.error("Remove passenger error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};
