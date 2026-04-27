import { FavoriteDormModel } from "../models/FavoriteDormModel.js";

export const getMyFavoriteDormIds = async (req, res) => {
  try {
    const ids = await FavoriteDormModel.findIdsByUserId(req.user.id);
    return res.json(ids);
  } catch (error) {
    console.error("Get favorite dorm ids error:", error);
    return res.status(500).json({ message: "Failed to fetch favorite dorms" });
  }
};

export const getMyFavoriteDorms = async (req, res) => {
  try {
    const dorms = await FavoriteDormModel.findDormsByUserId(req.user.id);
    return res.json(dorms);
  } catch (error) {
    console.error("Get favorite dorms error:", error);
    return res.status(500).json({ message: "Failed to fetch favorite dorms" });
  }
};

export const addFavoriteDorm = async (req, res) => {
  try {
    const { dormId } = req.body;

    if (!dormId) {
      return res.status(400).json({ message: "Dorm ID is required" });
    }

    await FavoriteDormModel.add(req.user.id, dormId);

    return res.status(201).json({ message: "Dorm added to favorites" });
  } catch (error) {
    console.error("Add favorite dorm error:", error);
    return res.status(500).json({ message: "Failed to add favorite dorm" });
  }
};

export const removeFavoriteDorm = async (req, res) => {
  try {
    const result = await FavoriteDormModel.remove(
      req.user.id,
      req.params.dormId,
    );

    if (result.count === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.json({ message: "Dorm removed from favorites" });
  } catch (error) {
    console.error("Remove favorite dorm error:", error);
    return res.status(500).json({ message: "Failed to remove favorite dorm" });
  }
};
