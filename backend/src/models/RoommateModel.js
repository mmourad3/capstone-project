import { prisma } from "../utils/database.js";

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  gender: true,
  profilePicture: true,
  university: true,
};

const dormSelect = {
  id: true,
  title: true,
  location: true,
  status: true,
  posterId: true,
};

const fullName = (user) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

const formatRequest = (request) => ({
  id: request.id,

  senderUserId: request.senderId,
  senderEmail: request.sender?.email || "",
  senderName: fullName(request.sender),
  senderPicture: request.sender?.profilePicture || "",

  recipientUserId: request.recipientId,
  recipientEmail: request.recipient?.email || "",
  recipientName: fullName(request.recipient),
  recipientPicture: request.recipient?.profilePicture || "",

  dormId: request.dormId,
  dormTitle: request.dorm?.title || "",
  status: request.status,
  createdAt: request.createdAt,
});



const formatRelationshipForUser = (relationship, currentUserId) => {
  const isProvider = relationship.providerId === currentUserId;
  const currentUser = isProvider ? relationship.provider : relationship.seeker;
  const roommate = isProvider ? relationship.seeker : relationship.provider;

  return {
    id: relationship.id,

    userId: currentUser?.id || "",
    userEmail: currentUser?.email || "",
    userName: fullName(currentUser),
    userPicture: currentUser?.profilePicture || "",
    userPhone: currentUser?.phone || "",

    roommateUserId: roommate?.id || "",
    roommateEmail: roommate?.email || "",
    roommateName: fullName(roommate),
    roommatePicture: roommate?.profilePicture || "",
    roommatePhone: roommate?.phone || "",

    seekerId: relationship.seekerId,
    providerId: relationship.providerId,
    dormId: relationship.dormId,
    dormTitle: relationship.dorm?.title || "",
    status: relationship.status,
    startedAt: relationship.startedAt,
    endedAt: relationship.endedAt,
  };
};

export const RoommateModel = {
  findIncomingRequests: async (userId) => {
    const requests = await prisma.roommateRequest.findMany({
      where: {
        recipientId: userId,
        status: "Pending",
      },
      include: {
        sender: { select: userSelect },
        recipient: { select: userSelect },
        dorm: { select: dormSelect },
      },
      orderBy: { createdAt: "desc" },
    });

    return requests.map(formatRequest);
  },

  findSentRequests: async (userId) => {
    const requests = await prisma.roommateRequest.findMany({
      where: {
        senderId: userId,
        status: "Pending",
      },
      include: {
        sender: { select: userSelect },
        recipient: { select: userSelect },
        dorm: { select: dormSelect },
      },
      orderBy: { createdAt: "desc" },
    });

    return requests.map(formatRequest);
  },

  findActiveRelationships: async (userId) => {
    const relationships = await prisma.roommateRelationship.findMany({
      where: {
        status: "Active",
        OR: [{ seekerId: userId }, { providerId: userId }],
      },
      include: {
        seeker: { select: userSelect },
        provider: { select: userSelect },
        dorm: { select: dormSelect },
      },
      orderBy: { startedAt: "desc" },
    });

    return relationships.map((relationship) =>
      formatRelationshipForUser(relationship, userId),
    );
  },

  findActiveRelationshipForUser: async (userId) => {
    return prisma.roommateRelationship.findFirst({
      where: {
        status: "Active",
        OR: [{ seekerId: userId }, { providerId: userId }],
      },
    });
  },

  findPendingSentRequest: async (userId) => {
    return prisma.roommateRequest.findFirst({
      where: {
        senderId: userId,
        status: "Pending",
      },
    });
  },

  createRequest: async ({ senderId, recipientId, dormId }) => {
    return prisma.roommateRequest.create({
      data: {
        senderId,
        recipientId,
        dormId,
      },
      include: {
        sender: { select: userSelect },
        recipient: { select: userSelect },
        dorm: { select: dormSelect },
      },
    });
  },

  acceptRequest: async (requestId, currentUserId) => {
    return prisma.$transaction(async (tx) => {
      const request = await tx.roommateRequest.findUnique({
        where: { id: requestId },
        include: {
          dorm: true,
          sender: { select: userSelect },
          recipient: { select: userSelect },
        },
      });

      if (!request) {
        throw new Error("REQUEST_NOT_FOUND");
      }

      if (request.recipientId !== currentUserId) {
        throw new Error("NOT_REQUEST_RECIPIENT");
      }

      if (request.status !== "Pending") {
        throw new Error("REQUEST_NOT_PENDING");
      }

      const activeRelationship = await tx.roommateRelationship.findFirst({
        where: {
          status: "Active",
          OR: [
            { seekerId: request.senderId },
            { providerId: request.senderId },
            { seekerId: request.recipientId },
            { providerId: request.recipientId },
          ],
        },
      });

      if (activeRelationship) {
        throw new Error("ACTIVE_ROOMMATE_EXISTS");
      }

      const relationship = await tx.roommateRelationship.create({
        data: {
          seekerId: request.senderId,
          providerId: request.recipientId,
          dormId: request.dormId,
          status: "Active",
        },
        include: {
          seeker: { select: userSelect },
          provider: { select: userSelect },
          dorm: { select: dormSelect },
        },
      });

      await tx.dormListing.update({
        where: { id: request.dormId },
        data: { status: "Inactive" },
      });

      await tx.roommateRequest.deleteMany({
        where: {
          status: "Pending",
          OR: [
            { dormId: request.dormId },
            { senderId: request.senderId },
            { recipientId: request.senderId },
            { senderId: request.recipientId },
            { recipientId: request.recipientId },
          ],
        },
      });

      return formatRelationshipForUser(relationship, currentUserId);
    });
  },

  rejectRequest: async (requestId, currentUserId) => {
    const request = await prisma.roommateRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("REQUEST_NOT_FOUND");
    }

    if (request.recipientId !== currentUserId) {
      throw new Error("NOT_REQUEST_RECIPIENT");
    }

    return prisma.roommateRequest.delete({
      where: { id: requestId },
    });
  },

  cancelRequest: async (requestId, currentUserId) => {
    const request = await prisma.roommateRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("REQUEST_NOT_FOUND");
    }

    if (request.senderId !== currentUserId) {
      throw new Error("NOT_REQUEST_SENDER");
    }

    return prisma.roommateRequest.delete({
      where: { id: requestId },
    });
  },
  deletePendingRequestsByDormId: async (dormId) => {
    return prisma.roommateRequest.deleteMany({
      where: {
        dormId,
        status: "Pending",
      },
    });
  },

  endRelationship: async (relationshipId, currentUserId) => {
    return prisma.$transaction(async (tx) => {
      const relationship = await tx.roommateRelationship.findUnique({
        where: { id: relationshipId },
        include: {
          seeker: { select: userSelect },
          provider: { select: userSelect },
          dorm: { select: dormSelect },
        },
      });

      if (!relationship) {
        throw new Error("RELATIONSHIP_NOT_FOUND");
      }

      if (
        relationship.seekerId !== currentUserId &&
        relationship.providerId !== currentUserId
      ) {
        throw new Error("NOT_RELATIONSHIP_MEMBER");
      }

      const updatedRelationship = await tx.roommateRelationship.update({
        where: { id: relationshipId },
        data: {
          status: "Ended",
          endedAt: new Date(),
        },
        include: {
          seeker: { select: userSelect },
          provider: { select: userSelect },
          dorm: { select: dormSelect },
        },
      });

      await tx.dormListing.update({
        where: { id: relationship.dormId },
        data: { status: "Inactive" },
      });

      return formatRelationshipForUser(updatedRelationship, currentUserId);
    });
  },

  createFeedback: async (relationshipId, reviewerId, data) => {
    const relationship = await prisma.roommateRelationship.findUnique({
      where: { id: relationshipId },
    });

    if (!relationship) {
      throw new Error("RELATIONSHIP_NOT_FOUND");
    }

    if (
      relationship.seekerId !== reviewerId &&
      relationship.providerId !== reviewerId
    ) {
      throw new Error("NOT_RELATIONSHIP_MEMBER");
    }

    const roommateId =
      relationship.seekerId === reviewerId
        ? relationship.providerId
        : relationship.seekerId;

    return prisma.roommateFeedback.upsert({
      where: {
        relationshipId_reviewerId: {
          relationshipId,
          reviewerId,
        },
      },
      update: {
        rating: data.rating,
        review: data.review || null,
        endReason: data.endReason,
        conflictType: data.conflictType || null,
        importantFactor: data.importantFactor,
      },
      create: {
        relationshipId,
        reviewerId,
        roommateId,
        rating: data.rating,
        review: data.review || null,
        endReason: data.endReason,
        conflictType: data.conflictType || null,
        importantFactor: data.importantFactor,
      },
    });
  },
};
