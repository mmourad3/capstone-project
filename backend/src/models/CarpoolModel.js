import { prisma } from "../utils/database.js";

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const stringifyJsonArray = (value) => {
  return JSON.stringify(Array.isArray(value) ? value : []);
};

const fullName = (user) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  gender: true,
  profilePicture: true,
  university: true,
  region: true,
  role: true,
};

const formatPassenger = (record) => {
  const passenger = record.passenger;

  return {
    id: passenger?.id || record.passengerId,
    name: fullName(passenger),
    email: passenger?.email || "",
    phone: passenger?.phone || "",
    gender: passenger?.gender || "",
    profilePicture: passenger?.profilePicture || "",
    joinedAt: record.joinedAt,
  };
};

const formatCarpool = (carpool) => {
  const passengers = (carpool.passengers || []).map(formatPassenger);
  const totalSeats = carpool.totalSeats || 0;
  const seats = passengers.length;

  return {
    id: carpool.id,

    driverId: carpool.driverId,
    driverName: fullName(carpool.driver),
    driverEmail: carpool.driver?.email || "",
    driverPhone: carpool.driver?.phone || "",
    driverGender: carpool.driver?.gender || "",
    driverProfilePicture: carpool.driver?.profilePicture || "",

    university: carpool.university,
    region: carpool.region,
    pickupSpot: carpool.pickupSpot,
    destination: carpool.destination,

    date: carpool.date,
    time: carpool.time,
    returnTime: carpool.returnTime,

    driverSchedule: parseJsonArray(carpool.driverSchedule),

    seats,
    totalSeats,
    availableSeats: Math.max(totalSeats - seats, 0),

    price: carpool.price,
    carModel: carpool.carModel,
    genderPreference: carpool.genderPreference,
    status: seats >= totalSeats ? "Full" : carpool.status,

    passengers,

    createdAt: carpool.createdAt,
    updatedAt: carpool.updatedAt,
  };
};

const includeFullCarpool = {
  driver: { select: userSelect },
  passengers: {
    include: {
      passenger: { select: userSelect },
    },
    orderBy: { joinedAt: "asc" },
  },
};

const getDaysFromSchedule = (schedule) => {
  const blocks = parseJsonArray(schedule);

  return blocks
    .flatMap((block) => block.days || [])
    .map((day) => day.toLowerCase());
};

const hasDayOverlap = (daysA, daysB) => {
  return daysA.some((day) => daysB.includes(day));
};

export const CarpoolModel = {
  findAll: async () => {
    const carpools = await prisma.carpoolListing.findMany({
      include: includeFullCarpool,
      orderBy: { createdAt: "desc" },
    });

    return carpools.map(formatCarpool);
  },

  findById: async (id) => {
    const carpool = await prisma.carpoolListing.findUnique({
      where: { id },
      include: includeFullCarpool,
    });

    return carpool ? formatCarpool(carpool) : null;
  },

  findRawById: async (id) => {
    return prisma.carpoolListing.findUnique({
      where: { id },
      include: includeFullCarpool,
    });
  },

  findByDriverId: async (driverId) => {
    const carpools = await prisma.carpoolListing.findMany({
      where: {
        driverId,
      },
      include: includeFullCarpool,
      orderBy: { createdAt: "desc" },
    });

    return carpools.map(formatCarpool);
  },

  findJoinedByPassengerId: async (passengerId) => {
    const passengerRows = await prisma.carpoolPassenger.findMany({
      where: { passengerId },
      include: {
        carpool: {
          include: includeFullCarpool,
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return passengerRows.map((row) => formatCarpool(row.carpool));
  },

  findJoinedIdsByPassengerId: async (passengerId) => {
    const rows = await prisma.carpoolPassenger.findMany({
      where: { passengerId },
      select: { carpoolId: true },
    });

    return rows.map((row) => row.carpoolId);
  },

  create: async (driverId, data) => {
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      select: userSelect,
    });

    if (!driver) {
      throw new Error("USER_NOT_FOUND");
    }

    if (driver.role !== "carpool") {
      console.log("User role:", driver.role);
      throw new Error("ONLY_CARPOOL_USERS");
    }
    const newListingDays = (data.driverSchedule || [])
      .flatMap((block) => block.days || [])
      .map((day) => day.toLowerCase());

    const joinedRows = await prisma.carpoolPassenger.findMany({
      where: { passengerId: driverId },
      include: {
        carpool: true,
      },
    });

    for (const joined of joinedRows) {
      const existingDays = getDaysFromSchedule(joined.carpool.driverSchedule);

      if (hasDayOverlap(newListingDays, existingDays)) {
        throw new Error("JOINED_DAY_CONFLICT");
      }
    }
    const carpool = await prisma.carpoolListing.create({
      data: {
        driverId,
        university: driver.university,
        region: driver.region,
        pickupSpot: data.pickupSpot,
        destination: data.destination,
        date: data.date,
        time: data.time,
        returnTime: data.returnTime || null,
        driverSchedule: stringifyJsonArray(data.driverSchedule),
        seats: 0,
        totalSeats: Number(data.totalSeats),
        price: String(data.price),
        carModel: data.carModel,
        genderPreference: data.genderPreference || "both",
        status: "Active",
      },
      include: includeFullCarpool,
    });

    return formatCarpool(carpool);
  },

  update: async (id, data) => {
    const updateData = { ...data };

    if ("driverSchedule" in updateData) {
      updateData.driverSchedule = stringifyJsonArray(updateData.driverSchedule);
    }

    if ("totalSeats" in updateData) {
      updateData.totalSeats = Number(updateData.totalSeats);
    }

    if ("price" in updateData) {
      updateData.price = String(updateData.price);
    }

    delete updateData.pickupLocation;

    const carpool = await prisma.carpoolListing.update({
      where: { id },
      data: updateData,
      include: includeFullCarpool,
    });

    return formatCarpool(carpool);
  },

  delete: async (id) => {
    return prisma.carpoolListing.delete({
      where: { id },
    });
  },

  join: async (carpoolId, passengerId) => {
    return prisma.$transaction(async (tx) => {
      const carpool = await tx.carpoolListing.findUnique({
        where: { id: carpoolId },
        include: includeFullCarpool,
      });

      if (!carpool) {
        throw new Error("CARPOOL_NOT_FOUND");
      }

      if (carpool.driverId === passengerId) {
        throw new Error("CANNOT_JOIN_OWN_CARPOOL");
      }

      if (carpool.status === "Full") {
        throw new Error("CARPOOL_FULL");
      }

      const passenger = await tx.user.findUnique({
        where: { id: passengerId },
        select: userSelect,
      });

      if (!passenger) {
        throw new Error("USER_NOT_FOUND");
      }

      if (passenger.role !== "carpool") {
        throw new Error("ONLY_CARPOOL_USERS");
      }

      if (carpool.university !== passenger.university) {
        throw new Error("UNIVERSITY_MISMATCH");
      }

      if (carpool.region !== passenger.region) {
        throw new Error("REGION_MISMATCH");
      }

      if (
        carpool.genderPreference === "same" &&
        carpool.driver?.gender &&
        passenger.gender &&
        carpool.driver.gender !== passenger.gender
      ) {
        throw new Error("GENDER_MISMATCH");
      }

      const existingPassenger = await tx.carpoolPassenger.findUnique({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
      });

      if (existingPassenger) {
        throw new Error("ALREADY_JOINED");
      }

      const currentPassengerCount = carpool.passengers.length;

      if (currentPassengerCount >= carpool.totalSeats) {
        throw new Error("CARPOOL_FULL");
      }

      const newCarpoolDays = getDaysFromSchedule(carpool.driverSchedule);

      const createdCarpools = await tx.carpoolListing.findMany({
        where: {
          driverId: passengerId,
        },
      });

      for (const created of createdCarpools) {
        const existingDays = getDaysFromSchedule(created.driverSchedule);

        if (hasDayOverlap(newCarpoolDays, existingDays)) {
          throw new Error("CREATED_DAY_CONFLICT");
        }
      }

      const joinedRows = await tx.carpoolPassenger.findMany({
        where: { passengerId },
        include: {
          carpool: true,
        },
      });

      for (const joined of joinedRows) {
        const existingDays = getDaysFromSchedule(joined.carpool.driverSchedule);

        if (hasDayOverlap(newCarpoolDays, existingDays)) {
          throw new Error("JOINED_DAY_CONFLICT");
        }
      }

      await tx.carpoolPassenger.create({
        data: {
          passengerId,
          carpoolId,
          status: "Confirmed",
        },
      });

      const newSeats = currentPassengerCount + 1;
      const newStatus = newSeats >= carpool.totalSeats ? "Full" : "Active";

      const updated = await tx.carpoolListing.update({
        where: { id: carpoolId },
        data: {
          seats: newSeats,
          status: newStatus,
        },
        include: includeFullCarpool,
      });

      return formatCarpool(updated);
    });
  },

  leave: async (carpoolId, passengerId) => {
    return prisma.$transaction(async (tx) => {
      const carpool = await tx.carpoolListing.findUnique({
        where: { id: carpoolId },
        include: includeFullCarpool,
      });

      if (!carpool) {
        throw new Error("CARPOOL_NOT_FOUND");
      }

      const passengerRow = await tx.carpoolPassenger.findUnique({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
      });

      if (!passengerRow) {
        throw new Error("PASSENGER_NOT_FOUND");
      }

      await tx.carpoolPassenger.delete({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
      });

      const newSeats = Math.max(carpool.passengers.length - 1, 0);

      const updated = await tx.carpoolListing.update({
        where: { id: carpoolId },
        data: {
          seats: newSeats,
          status: "Active",
        },
        include: includeFullCarpool,
      });

      return formatCarpool(updated);
    });
  },

  removePassenger: async (carpoolId, passengerId, driverId) => {
    return prisma.$transaction(async (tx) => {
      const carpool = await tx.carpoolListing.findUnique({
        where: { id: carpoolId },
        include: includeFullCarpool,
      });

      if (!carpool) {
        throw new Error("CARPOOL_NOT_FOUND");
      }

      if (carpool.driverId !== driverId) {
        throw new Error("NOT_CARPOOL_DRIVER");
      }

      const passengerRow = await tx.carpoolPassenger.findUnique({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
      });

      if (!passengerRow) {
        throw new Error("PASSENGER_NOT_FOUND");
      }

      await tx.carpoolPassenger.delete({
        where: {
          passengerId_carpoolId: {
            passengerId,
            carpoolId,
          },
        },
      });

      const newSeats = Math.max(carpool.passengers.length - 1, 0);

      const updated = await tx.carpoolListing.update({
        where: { id: carpoolId },
        data: {
          seats: newSeats,
          status: "Active",
        },
        include: includeFullCarpool,
      });

      return formatCarpool(updated);
    });
  },
};
