import { prisma } from "../utils/database.js";

const parseScheduleBlock = (block) => ({
  ...block,
  days: block.days ? JSON.parse(block.days) : [],
});

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

  findByPhone: (phone) =>
    prisma.user.findUnique({
      where: { phone },
    }),

  create: (data) =>
    prisma.user.create({
      data,
    }),

  createScheduleBlocks: async (userId, classSchedule) => {
    await prisma.classScheduleBlock.createMany({
      data: classSchedule.map((block) => ({
        userId,
        days: JSON.stringify(block.days || []),
        startTime: block.startTime,
        endTime: block.endTime,
      })),
    });

    const savedBlocks = await prisma.classScheduleBlock.findMany({
      where: { userId },
    });

    return savedBlocks.map(parseScheduleBlock);
  },

  findScheduleByUserId: async (userId) => {
    const blocks = await prisma.classScheduleBlock.findMany({
      where: { userId },
    });

    return blocks.map(parseScheduleBlock);
  },

  delete: (id) =>
    prisma.user.delete({
      where: { id },
    }),

  findByIdWithPassword: async (id) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  update: async (id, data) => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
