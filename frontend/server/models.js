import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Initialize Prisma connection
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

// Helper functions for data serialization
export const serializeQuestionnaire = (questionnaire) => {
  if (!questionnaire) return null;
  return {
    ...questionnaire,
    interests: JSON.parse(questionnaire.interests),
    importantQualities: JSON.parse(questionnaire.importantQualities),
    dealBreakers: JSON.parse(questionnaire.dealBreakers)
  };
};

export const serializeDormListing = (dorm) => {
  return {
    ...dorm,
    amenities: JSON.parse(dorm.amenities),
    images: JSON.parse(dorm.images)
  };
};

export const serializeCarpoolListing = (carpool) => {
  return {
    ...carpool,
    driverSchedule: JSON.parse(carpool.driverSchedule)
  };
};

export const serializeClassSchedule = (scheduleBlocks) => {
  return scheduleBlocks.map(block => ({
    ...block,
    days: JSON.parse(block.days)
  }));
};
