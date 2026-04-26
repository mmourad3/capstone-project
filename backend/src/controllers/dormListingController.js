import { DormListingModel } from "../models/DormListingModel.js";

export const getAllDormListings = async (req, res) => {
  try {
    const dorms = await DormListingModel.findAll();
    return res.json(dorms);
  } catch (error) {
    console.error("Get dorm listings error:", error);
    return res.status(500).json({ message: "Failed to fetch dorm listings" });
  }
};

export const getDormListingById = async (req, res) => {
  try {
    const dorm = await DormListingModel.findById(req.params.id);

    if (!dorm) {
      return res.status(404).json({ message: "Dorm listing not found" });
    }

    return res.json(dorm);
  } catch (error) {
    console.error("Get dorm listing error:", error);
    return res.status(500).json({ message: "Failed to fetch dorm listing" });
  }
};

export const getMyDormListings = async (req, res) => {
  try {
    const dorms = await DormListingModel.findByPosterId(req.user.id);
    return res.json(dorms);
  } catch (error) {
    console.error("Get my dorm listings error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch your dorm listings" });
  }
};

export const createDormListing = async (req, res) => {
  try {
    const dorm = await DormListingModel.create(req.user.id, req.body);

    return res.status(201).json({
      message: "Dorm listing created successfully",
      dorm,
    });
  } catch (error) {
    console.error("Create dorm listing error:", error);
    return res.status(500).json({ message: "Failed to create dorm listing" });
  }
};

export const updateDormListing = async (req, res) => {
  try {
    const existingDorm = await DormListingModel.findById(req.params.id);

    if (!existingDorm) {
      return res.status(404).json({ message: "Dorm listing not found" });
    }

    if (existingDorm.posterId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own listings" });
    }

    const dorm = await DormListingModel.update(req.params.id, req.body);

    return res.json({
      message: "Dorm listing updated successfully",
      dorm,
    });
  } catch (error) {
    console.error("Update dorm listing error:", error);
    return res.status(500).json({ message: "Failed to update dorm listing" });
  }
};

export const deleteDormListing = async (req, res) => {
  try {
    const existingDorm = await DormListingModel.findById(req.params.id);

    if (!existingDorm) {
      return res.status(404).json({ message: "Dorm listing not found" });
    }

    if (existingDorm.posterId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own listings" });
    }

    await DormListingModel.delete(req.params.id);

    return res.json({ message: "Dorm listing deleted successfully" });
  } catch (error) {
    console.error("Delete dorm listing error:", error);
    return res.status(500).json({ message: "Failed to delete dorm listing" });
  }
};
