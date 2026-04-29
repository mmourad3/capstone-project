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

  return {
    ...carpool,
    driverSchedule: parseSchedule(carpool.driverSchedule),
    passengers: (carpool.passengers || []).map(formatPassenger),
  };
};

export const CarpoolModel = {
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
      where: {
        driverId,
        status: { not: "Deleted" },
      },
      include: { passengers: true },
      orderBy: { createdAt: "desc" },
    });

    return carpools.map(formatCarpool);
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
        university: data.university,
        region: data.region,
        pickupLocation: data.pickupLocation,
        pickupSpot: data.pickupSpot,
        destination: data.destination,
        date: data.date,
        endDate: data.endDate || null,
        time: data.time,
        returnTime: data.returnTime || null,
        driverSchedule: JSON.stringify(data.driverSchedule || []),
        seats: 0,
        totalSeats: Number(data.totalSeats),
        price: String(data.price),
        carModel: data.carModel,
        genderPreference: data.genderPreference || "both",
      },
      include: { passengers: true },
    });

    return formatCarpool(carpool);
  },

  delete: async (id) => {
    await prisma.carpoolListing.delete({ where: { id } });
  },

  addPassenger: async (carpool, passenger) => {
    await prisma.carpoolPassenger.create({
      data: {
        passengerId: passenger.id,
        passengerName: `${passenger.firstName || ""} ${passenger.lastName || ""}`.trim(),
        passengerEmail: passenger.email,
        passengerPhone: passenger.phone,
        passengerProfilePicture: passenger.profilePicture || null,
        passengerGender: passenger.gender,
        carpoolId: carpool.id,
      },
    });

    const seats = carpool.seats + 1;
    const updated = await prisma.carpoolListing.update({
      where: { id: carpool.id },
      data: {
        seats,
        status: seats >= carpool.totalSeats ? "Full" : "Active",
      },
      include: { passengers: true },
    });

    return formatCarpool(updated);
  },

  removePassenger: async (carpoolId, passengerId) => {
    await prisma.carpoolPassenger.delete({
      where: {
        passengerId_carpoolId: {
          passengerId,
          carpoolId,
        },
      },
    });

    const passengerCount = await prisma.carpoolPassenger.count({
      where: { carpoolId },
    });

    const updated = await prisma.carpoolListing.update({
      where: { id: carpoolId },
      data: {
        seats: passengerCount,
        status: "Active",
      },
      include: { passengers: true },
    });

    return formatCarpool(updated);
  },
};
