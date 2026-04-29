import { RoommateModel } from "../models/RoommateModel.js";
import { DormListingModel } from "../models/DormListingModel.js";

const getErrorResponse = (error) => {
  switch (error.message) {
    case "REQUEST_NOT_FOUND":
      return [404, "Roommate request not found"];
    case "NOT_REQUEST_RECIPIENT":
      return [403, "You can only accept or reject requests sent to you"];
    case "NOT_REQUEST_SENDER":
      return [403, "You can only cancel your own requests"];
    case "REQUEST_NOT_PENDING":
      return [400, "This request is no longer pending"];
    case "ACTIVE_ROOMMATE_EXISTS":
      return [400, "You or this user already has an active roommate"];
    case "RELATIONSHIP_NOT_FOUND":
      return [404, "Roommate relationship not found"];
    case "NOT_RELATIONSHIP_MEMBER":
      return [403, "You are not part of this roommate relationship"];
    default:
      return [500, "Something went wrong"];
  }
};

export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await RoommateModel.findIncomingRequests(req.user.id);
    return res.json(requests);
  } catch (error) {
    console.error("Get incoming roommate requests error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch roommate requests" });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const requests = await RoommateModel.findSentRequests(req.user.id);
    return res.json(requests);
  } catch (error) {
    console.error("Get sent roommate requests error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch sent roommate requests" });
  }
};

export const getActiveRoommates = async (req, res) => {
  try {
    const roommates = await RoommateModel.findActiveRelationships(req.user.id);
    return res.json(roommates);
  } catch (error) {
    console.error("Get active roommates error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch active roommates" });
  }
};

export const getStatus = async (req, res) => {
  try {
    const activeRelationship =
      await RoommateModel.findActiveRelationshipForUser(req.user.id);

    const pendingSentRequest = await RoommateModel.findPendingSentRequest(
      req.user.id,
    );

    return res.json({
      hasActiveRoommate: !!activeRelationship,
      hasPendingRequest: !!pendingSentRequest,
      activeRelationshipId: activeRelationship?.id || null,
      pendingRequest: pendingSentRequest || null,
    });
  } catch (error) {
    console.error("Get roommate status error:", error);
    return res.status(500).json({ message: "Failed to fetch roommate status" });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const { recipientId, dormId } = req.body;

    if (!recipientId || !dormId) {
      return res
        .status(400)
        .json({ message: "Recipient and dorm are required" });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({ message: "You cannot request yourself" });
    }

    const dorm = await DormListingModel.findById(dormId);

    if (!dorm) {
      return res.status(404).json({ message: "Dorm listing not found" });
    }

    if (dorm.posterId !== recipientId) {
      return res.status(400).json({
        message: "This dorm does not belong to the selected provider",
      });
    }

    if (dorm.status !== "Active") {
      return res.status(400).json({
        message: "This dorm is no longer available",
      });
    }

    const activeRelationship =
      await RoommateModel.findActiveRelationshipForUser(req.user.id);

    if (activeRelationship) {
      return res.status(400).json({
        message: "You already have an active roommate",
      });
    }

    const pendingRequest = await RoommateModel.findPendingSentRequest(
      req.user.id,
    );

    if (pendingRequest) {
      return res.status(400).json({
        message: "Cancel your pending request first",
      });
    }

    const request = await RoommateModel.createRequest({
      senderId: req.user.id,
      recipientId,
      dormId,
    });

    return res.status(201).json({
      message: "Roommate request sent",
      request,
    });
  } catch (error) {
    console.error("Send roommate request error:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "You already sent a request for this dorm",
      });
    }

    return res.status(500).json({ message: "Failed to send roommate request" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const relationship = await RoommateModel.acceptRequest(
      req.params.id,
      req.user.id,
    );

    return res.json({
      message: "Roommate request accepted",
      relationship,
    });
  } catch (error) {
    console.error("Accept roommate request error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    await RoommateModel.rejectRequest(req.params.id, req.user.id);

    return res.json({ message: "Roommate request declined" });
  } catch (error) {
    console.error("Reject roommate request error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    await RoommateModel.cancelRequest(req.params.id, req.user.id);

    return res.json({ message: "Roommate request cancelled" });
  } catch (error) {
    console.error("Cancel roommate request error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const endRelationship = async (req, res) => {
  try {
    const relationship = await RoommateModel.endRelationship(
      req.params.id,
      req.user.id,
    );

    return res.json({
      message: "Roommate relationship ended",
      relationship,
    });
  } catch (error) {
    console.error("End roommate relationship error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { rating, endReason, importantFactor } = req.body;

    if (!rating || !endReason || !importantFactor) {
      return res.status(400).json({
        message: "Rating, end reason, and important factor are required",
      });
    }

    const feedback = await RoommateModel.createFeedback(
      req.params.id,
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      message: "Feedback submitted",
      feedback,
    });
  } catch (error) {
    console.error("Submit roommate feedback error:", error);
    const [status, message] = getErrorResponse(error);
    return res.status(status).json({ message });
  }
};
