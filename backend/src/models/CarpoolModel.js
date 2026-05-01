import { prisma } from "../utils/database.js";

const parseSchedule = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const stringifySchedule = (value) => {
  return JSON.stringify(Array.isArray(value) ? value : []);
};

const formatPassenger = (passenger) => ({
  id: passenger.passengerId,
  name: passenger.passengerName,
  email: passenger.passengerEmail,
  phone: passenger.passengerPhone,
  profilePicture: passenger.passengerProfilePicture,
  gender: passenger.passengerGender,
  joinedAt: passenger.joinedAt,
});

const formatCarpool = (carpool) => {
  if (!carpool) return null;

  const passengers = (carpool.passengers || []).map(formatPassenger);
  const totalSeats = carpool.totalSeats || 0;
  const seats = carpool.seats ?? passengers.length;

  return {
    ...carpool,
    seats,
    totalSeats,
    availableSeats: Math.max(totalSeats - seats, 0),
    driverSchedule: parseSchedule(carpool.driverSchedule),
    passengers,
  };
};

export const CarpoolModel = {
  findUserById: async (userId) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        classSchedule: true,
      },
    });
  },
  findAll: async () => {
    const carpools = await prisma.carpoolListing.findMany({
      include: { passengers: true },
      orderBy: { createdAt: "desc" },
    });

    return carpools.map(formatCarpool);
  },

  findById: async (id) => {
    const carpool = await prisma.carpoolListing.findUnique({
      where: { id },
      include: { passengers: true },
    });

    return formatCarpool(carpool);
  },

  findByDriverId: async (driverId) => {
    const carpools = await prisma.carpoolListing.findMany({
      where: { driverId },
      include: { passengers: true },
      orderBy: { createdAt: "desc" },
    });

    return carpools.map(formatCarpool);
  },

  findJoinedByUserId: async (userId) => {
    const joined = await prisma.carpoolPassenger.findMany({
      where: {
        passengerId: userId,
        status: "Confirmed",
      },
      include: {
        carpool: {
          include: { passengers: true },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return joined.map((item) => formatCarpool(item.carpool));
  },

  create: async (driver, data) => {
    const carpool = await prisma.carpoolListing.create({
      data: {
        driverId: driver.id,
        driverName: `${driver.firstName || ""} ${driver.lastName || ""}`.trim(),
        driverEmail: driver.email,
        driverPhone: driver.phone,
        driverProfilePicture: driver.profilePicture || null,
        driverGender: driver.gender,

        university: data.university || driver.university,
        region: data.region || driver.region,
        pickupLocation: data.pickupLocation,
        pickupSpot: data.pickupSpot,
        destination: data.destination,

        date: data.date,
        endDate: data.endDate || null,
        time: data.time,
        returnTime: data.returnTime || null,

        driverSchedule: stringifySchedule(
          data.driverSchedule ||
            driver.classSchedule?.map((block) => ({
              ...block,
              days: parseSchedule(block.days),
            })) ||
            [],
        ),
        
        seats: 0,
        totalSeats: Number(data.totalSeats),

        price: String(data.price),
        carModel: data.carModel,

        genderPreference: data.genderPreference || "both",
        status: "Active",
      },
      include: { passengers: true },
    });

    return formatCarpool(carpool);
  },

  delete: async (id, driverId) => {
    const carpool = await prisma.carpoolListing.findUnique({
      where: { id },
    });

    if (!carpool) throw new Error("CARPOOL_NOT_FOUND");
    if (carpool.driverId !== driverId) throw new Error("NOT_CARPOOL_DRIVER");

    return prisma.carpoolListing.delete({
      where: { id },
    });
  },

  addPassenger: async (carpoolId, passenger) => {
    return prisma.$transaction(async (tx) => {
      const carpool = await tx.carpoolListing.findUnique({
        where: { id: carpoolId },
        include: { passengers: true },
      });

      if (!carpool) throw new Error("CARPOOL_NOT_FOUND");
      if (carpool.driverId === passenger.id)
        throw new Error("CANNOT_JOIN_OWN_CARPOOL");
      if (carpool.status === "Full") throw new Error("CARPOOL_FULL");
      if (carpool.seats >= carpool.totalSeats) throw new Error("CARPOOL_FULL");

      const alreadyJoined = await tx.carpoolPassenger.findUnique({
        where: {
          passengerId_carpoolId: {
            passengerId: passenger.id,
            carpoolId,
          },
        },
      });

      if (alreadyJoined) throw new Error("ALREADY_JOINED");

      if (
        carpool.genderPreference === "same" &&
        carpool.driverGender?.toLowerCase() !== passenger.gender?.toLowerCase()
      ) {
        throw new Error("GENDER_RESTRICTED");
      }

      await tx.carpoolPassenger.create({
        data: {
          passengerId: passenger.id,
          passengerName:
            `${passenger.firstName || ""} ${passenger.lastName || ""}`.trim(),
          passengerEmail: passenger.email,
          passengerPhone: passenger.phone,
          passengerProfilePicture: passenger.profilePicture || null,
          passengerGender: passenger.gender,
          carpoolId,
          status: "Confirmed",
        },
      });

      const newSeats = carpool.seats + 1;

      const updated = await tx.carpoolListing.update({
        where: { id: carpoolId },
        data: {
          seats: newSeats,
          status: newSeats >= carpool.totalSeats ? "Full" : "Active",
        },
        include: { passengers: true },
      });

      return formatCarpool(updated);
    });
  },

  removePassenger: async (carpoolId, passengerId) => {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.carpoolPassenger.findUnique({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
        include: { carpool: true },
      });

      if (!existing) throw new Error("PASSENGER_NOT_FOUND");

      await tx.carpoolPassenger.delete({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
      });

      const passengerCount = await tx.carpoolPassenger.count({
        where: { carpoolId },
      });

      const updated = await tx.carpoolListing.update({
        where: { id: carpoolId },
        data: {
          seats: passengerCount,
          status:
            passengerCount >= existing.carpool.totalSeats ? "Full" : "Active",
        },
        include: { passengers: true },
      });

      return formatCarpool(updated);
    });
  },
};
