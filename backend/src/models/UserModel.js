import { prisma } from "../utils/database.js";

export const UserModel = {
  findAll: () => prisma.user.findMany(),

  findById: (id) =>
    prisma.user.findUnique({
      where: { id },
    }),

    
  findProfileById: (id) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        questionnaire: true,
        classSchedule: true,
        dormListings: true,
        carpoolListings: true,
        carpoolPassengers: true,
      },
    }),

  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
    }),

  create: (data) => prisma.user.create({ data }),

  update: (id, data) =>
    prisma.user.update({
      where: { id },
      data,
    }),

  delete: (id) =>
    prisma.user.delete({
      where: { id },
    }),
};
