import { prisma } from "../utils/database.js";

const posterSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  gender: true,
  university: true,
  profilePicture: true,
};

const parseArrays = (dorm) => {
  if (!dorm) return null;

  const parsed = { ...dorm };

  ["amenities", "images"].forEach((field) => {
    try {
      parsed[field] = parsed[field] ? JSON.parse(parsed[field]) : [];
    } catch {
      parsed[field] = [];
    }
  });

  return parsed;
};

export const FavoriteDormModel = {
  findIdsByUserId: async (userId) => {
    const favorites = await prisma.favoriteDorm.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { dormId: true },
    });

    return favorites.map((favorite) => favorite.dormId);
  },

  findDormsByUserId: async (userId) => {
    const favorites = await prisma.favoriteDorm.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        dorm: {
          include: {
            poster: {
              select: posterSelect,
            },
          },
        },
      },
    });

    return favorites.map((favorite) => ({
      ...parseArrays(favorite.dorm),
      favoritedAt: favorite.createdAt,
    }));
  },

  findUserForFavorite: async (userId) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        gender: true,
      },
    });
  },

  findDormForFavorite: async (dormId) => {
    return prisma.dormListing.findUnique({
      where: { id: dormId },
      include: {
        poster: {
          select: {
            gender: true,
          },
        },
      },
    });
  },

  add: async (userId, dormId) => {
    return prisma.favoriteDorm.upsert({
      where: {
        userId_dormId: {
          userId,
          dormId,
        },
      },
      update: {},
      create: {
        userId,
        dormId,
      },
    });
  },

  remove: async (userId, dormId) => {
    return prisma.favoriteDorm.deleteMany({
      where: {
        userId,
        dormId,
      },
    });
  },
};
