import { prisma } from "../utils/database.js";

const arrayFields = ["amenities", "images"];

const stringifyArrays = (data) => {
  const formatted = { ...data };

  arrayFields.forEach((field) => {
    if (field in formatted) {
      formatted[field] = JSON.stringify(formatted[field] || []);
    }
  });

  return formatted;
};

const parseArrays = (dorm) => {
  if (!dorm) return null;

  const parsed = { ...dorm };

  arrayFields.forEach((field) => {
    try {
      parsed[field] = parsed[field] ? JSON.parse(parsed[field]) : [];
    } catch {
      parsed[field] = [];
    }
  });

  return parsed;
};

const parseDorms = (dorms) => dorms.map(parseArrays);

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

export const DormListingModel = {
  findAll: async () => {
    const dorms = await prisma.dormListing.findMany({
      include: {
        poster: {
          select: posterSelect,
        },
      },
      orderBy: {
        datePosted: "desc",
      },
    });

    return parseDorms(dorms);
  },

  findById: async (id) => {
    const dorm = await prisma.dormListing.findUnique({
      where: { id },
      include: {
        poster: {
          select: posterSelect,
        },
      },
    });

    return parseArrays(dorm);
  },

  findByPosterId: async (posterId) => {
    const dorms = await prisma.dormListing.findMany({
      where: { posterId },
      include: {
        poster: {
          select: posterSelect,
        },
      },
      orderBy: {
        datePosted: "desc",
      },
    });

    return parseDorms(dorms);
  },

  create: async (posterId, data) => {
    const formattedData = stringifyArrays(data);

    const dorm = await prisma.dormListing.create({
      data: {
        posterId,
        ...formattedData,
      },
      include: {
        poster: {
          select: posterSelect,
        },
      },
    });

    return parseArrays(dorm);
  },

  update: async (id, data) => {
    const formattedData = stringifyArrays(data);

    const dorm = await prisma.dormListing.update({
      where: { id },
      data: formattedData,
      include: {
        poster: {
          select: posterSelect,
        },
      },
    });

    return parseArrays(dorm);
  },

  delete: async (id) => {
    return prisma.dormListing.delete({
      where: { id },
    });
  },
};
