import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, serializeQuestionnaire, serializeDormListing, serializeCarpoolListing, serializeClassSchedule } from './models.js';
import { calculateCompatibilityForDB, parseCompatibilityFromDB } from './compatibilityCalculator.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ========================================
// AUTH CONTROLLERS
// ========================================

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, role, country, university, profilePicture } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    if (!profilePicture) {
      return res.status(400).json({ error: 'Profile picture is required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        gender,
        role,
        country,
        university,
        profilePicture,
        emailVerified: false
      }
    });
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        country: user.country,
        university: user.university,
        profilePicture: user.profilePicture,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const checkEmailExists = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { email: decodeURIComponent(req.params.email) }
    });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================================
// USER CONTROLLERS
// ========================================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        questionnaire: true,
        classSchedule: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
      country: user.country,
      university: user.university,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
      questionnaire: serializeQuestionnaire(user.questionnaire),
      classSchedule: serializeClassSchedule(user.classSchedule)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { profilePicture: base64Image }
    });
    
    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(profilePicture && { profilePicture })
      }
    });
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(req.params.email) },
      include: { questionnaire: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      profilePicture: user.profilePicture,
      questionnaire: serializeQuestionnaire(user.questionnaire)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================================
// QUESTIONNAIRE CONTROLLERS
// ========================================

export const saveQuestionnaire = async (req, res) => {
  try {
    const data = req.body;
    
    const questionnaire = await prisma.questionnaire.upsert({
      where: { userId: req.userId },
      update: {
        sleepSchedule: data.sleepSchedule,
        wakeUpTime: data.wakeUpTime,
        sleepTime: data.sleepTime,
        cleanliness: data.cleanliness,
        organizationLevel: data.organizationLevel,
        socialLevel: data.socialLevel,
        guestFrequency: data.guestFrequency,
        sharedSpaces: data.sharedSpaces,
        smoking: data.smoking,
        drinking: data.drinking,
        pets: data.pets,
        dietaryPreferences: data.dietaryPreferences,
        studyTime: data.studyTime,
        noiseLevel: data.noiseLevel,
        musicWhileStudying: data.musicWhileStudying,
        temperaturePreference: data.temperaturePreference,
        sharingItems: data.sharingItems,
        allergies: data.allergies,
        interests: JSON.stringify(data.interests || []),
        personalQualities: JSON.stringify(data.personalQualities || []),
        importantQualities: JSON.stringify(data.importantQualities || []),
        dealBreakers: JSON.stringify(data.dealBreakers || [])
      },
      create: {
        userId: req.userId,
        sleepSchedule: data.sleepSchedule,
        wakeUpTime: data.wakeUpTime,
        sleepTime: data.sleepTime,
        cleanliness: data.cleanliness,
        organizationLevel: data.organizationLevel,
        socialLevel: data.socialLevel,
        guestFrequency: data.guestFrequency,
        sharedSpaces: data.sharedSpaces,
        smoking: data.smoking,
        drinking: data.drinking,
        pets: data.pets,
        dietaryPreferences: data.dietaryPreferences,
        studyTime: data.studyTime,
        noiseLevel: data.noiseLevel,
        musicWhileStudying: data.musicWhileStudying,
        temperaturePreference: data.temperaturePreference,
        sharingItems: data.sharingItems,
        allergies: data.allergies,
        interests: JSON.stringify(data.interests || []),
        personalQualities: JSON.stringify(data.personalQualities || []),
        importantQualities: JSON.stringify(data.importantQualities || []),
        dealBreakers: JSON.stringify(data.dealBreakers || [])
      }
    });
    
    res.json({ success: true, questionnaire });
  } catch (error) {
    console.error('Save questionnaire error:', error);
    res.status(500).json({ error: 'Failed to save questionnaire' });
  }
};

// ========================================
// CLASS SCHEDULE CONTROLLERS
// ========================================

export const saveClassSchedule = async (req, res) => {
  try {
    const { schedules } = req.body;
    
    await prisma.classScheduleBlock.deleteMany({
      where: { userId: req.userId }
    });
    
    const created = await prisma.classScheduleBlock.createMany({
      data: schedules.map(s => ({
        userId: req.userId,
        courseName: s.courseName,
        days: JSON.stringify(s.days),
        startTime: s.startTime,
        endTime: s.endTime
      }))
    });
    
    res.json({ success: true, count: created.count });
  } catch (error) {
    console.error('Save schedule error:', error);
    res.status(500).json({ error: 'Failed to save schedule' });
  }
};

// ========================================
// DORM LISTING CONTROLLERS
// ========================================

export const getAllDormListings = async (req, res) => {
  try {
    const dorms = await prisma.dormListing.findMany({
      where: { status: 'Active' },
      orderBy: { createdAt: 'desc' },
      include: {
        poster: {
          select: {
            name: true,
            email: true,
            profilePicture: true,
            gender: true,
            phone: true
          }
        }
      }
    });
    
    res.json(dorms.map(serializeDormListing));
  } catch (error) {
    console.error('Get dorms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyDormListings = async (req, res) => {
  try {
    const dorms = await prisma.dormListing.findMany({
      where: { posterId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(dorms.map(serializeDormListing));
  } catch (error) {
    console.error('Get my dorms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createDormListing = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    
    const dorm = await prisma.dormListing.create({
      data: {
        posterId: req.userId,
        posterName: user.name,
        posterEmail: user.email,
        title: req.body.title,
        location: req.body.location,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        price: req.body.price,
        roomType: req.body.roomType,
        gender: req.body.gender,
        description: req.body.description,
        amenities: JSON.stringify(req.body.amenities),
        images: JSON.stringify(req.body.images),
        status: 'Active'
      }
    });
    
    res.json(serializeDormListing(dorm));
  } catch (error) {
    console.error('Create dorm error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

export const updateDormListing = async (req, res) => {
  try {
    const dorm = await prisma.dormListing.findUnique({
      where: { id: req.params.id }
    });
    
    if (!dorm || dorm.posterId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updated = await prisma.dormListing.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        location: req.body.location,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        price: req.body.price,
        roomType: req.body.roomType,
        gender: req.body.gender,
        description: req.body.description,
        amenities: JSON.stringify(req.body.amenities),
        images: JSON.stringify(req.body.images),
        ...(req.body.status && { status: req.body.status })
      }
    });
    
    res.json(serializeDormListing(updated));
  } catch (error) {
    console.error('Update dorm error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

export const deleteDormListing = async (req, res) => {
  try {
    const dorm = await prisma.dormListing.findUnique({
      where: { id: req.params.id }
    });
    
    if (!dorm || dorm.posterId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await prisma.dormListing.delete({
      where: { id: req.params.id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete dorm error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

// ========================================
// DORM APPLICATION CONTROLLERS
// ========================================

export const applyToDorm = async (req, res) => {
  try {
    const dorm = await prisma.dormListing.findUnique({
      where: { id: req.params.dormId }
    });
    
    if (!dorm) {
      return res.status(404).json({ error: 'Dorm not found' });
    }
    
    const existing = await prisma.dormApplication.findUnique({
      where: {
        applicantId_dormId: {
          applicantId: req.userId,
          dormId: req.params.dormId
        }
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }
    
    const application = await prisma.dormApplication.create({
      data: {
        applicantId: req.userId,
        dormId: req.params.dormId,
        ownerId: dorm.posterId,
        message: req.body.message,
        status: 'Pending'
      }
    });
    
    await prisma.dormListing.update({
      where: { id: req.params.dormId },
      data: { inquiries: { increment: 1 } }
    });
    
    res.json(application);
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Application failed' });
  }
};

export const getReceivedApplications = async (req, res) => {
  try {
    const applications = await prisma.dormApplication.findMany({
      where: { ownerId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        applicant: {
          select: {
            name: true,
            email: true,
            gender: true,
            phone: true,
            profilePicture: true,
            questionnaire: true
          }
        },
        dorm: true
      }
    });
    
    res.json(applications.map(app => ({
      ...app,
      applicant: {
        ...app.applicant,
        questionnaire: serializeQuestionnaire(app.applicant.questionnaire)
      },
      dorm: serializeDormListing(app.dorm)
    })));
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSentApplications = async (req, res) => {
  try {
    const applications = await prisma.dormApplication.findMany({
      where: { applicantId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        dorm: {
          include: {
            poster: {
              select: {
                name: true,
                email: true,
                profilePicture: true
              }
            }
          }
        }
      }
    });
    
    res.json(applications.map(app => ({
      ...app,
      dorm: serializeDormListing(app.dorm)
    })));
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await prisma.dormApplication.findUnique({
      where: { id: req.params.id }
    });
    
    if (!application || application.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updated = await prisma.dormApplication.update({
      where: { id: req.params.id },
      data: { 
        status,
        respondedAt: new Date()
      }
    });
    
    res.json(updated);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

// ========================================
// CARPOOL LISTING CONTROLLERS
// ========================================

export const getCarpoolListings = async (req, res) => {
  try {
    const { university, region } = req.query;
    
    const today = new Date().toISOString().split('T')[0];
    
    const where = {
      status: 'Active',
      date: { gte: today },
      ...(university && { university }),
      ...(region && { region })
    };
    
    const carpools = await prisma.carpoolListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        passengers: true
      }
    });
    
    res.json(carpools.map(c => ({
      ...serializeCarpoolListing(c),
      passengers: c.passengers
    })));
  } catch (error) {
    console.error('Get carpools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyCarpoolListings = async (req, res) => {
  try {
    const carpools = await prisma.carpoolListing.findMany({
      where: { driverId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        passengers: true
      }
    });
    
    res.json(carpools.map(c => ({
      ...serializeCarpoolListing(c),
      passengers: c.passengers
    })));
  } catch (error) {
    console.error('Get my carpools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCarpoolListing = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    
    const carpool = await prisma.carpoolListing.create({
      data: {
        driverId: req.userId,
        driverName: user.name,
        driverEmail: user.email,
        driverPhone: user.phone,
        driverProfilePicture: user.profilePicture,
        driverGender: user.gender,
        university: req.body.university,
        region: req.body.region,
        pickupLocation: req.body.pickupLocation,
        pickupSpot: req.body.pickupSpot,
        destination: req.body.destination,
        date: req.body.date,
        endDate: req.body.endDate,
        time: req.body.time,
        returnTime: req.body.returnTime,
        driverSchedule: JSON.stringify(req.body.driverSchedule || []),
        seats: 0,
        totalSeats: parseInt(req.body.totalSeats),
        price: req.body.price,
        carModel: req.body.carModel,
        genderPreference: req.body.genderPreference || 'both',
        status: 'Active'
      }
    });
    
    res.json(serializeCarpoolListing(carpool));
  } catch (error) {
    console.error('Create carpool error:', error);
    res.status(500).json({ error: 'Failed to create carpool' });
  }
};

export const updateCarpoolListing = async (req, res) => {
  try {
    const carpool = await prisma.carpoolListing.findUnique({
      where: { id: req.params.id }
    });
    
    if (!carpool || carpool.driverId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updated = await prisma.carpoolListing.update({
      where: { id: req.params.id },
      data: {
        pickupSpot: req.body.pickupSpot,
        date: req.body.date,
        endDate: req.body.endDate,
        time: req.body.time,
        returnTime: req.body.returnTime,
        totalSeats: parseInt(req.body.totalSeats),
        price: req.body.price,
        carModel: req.body.carModel,
        genderPreference: req.body.genderPreference,
        ...(req.body.status && { status: req.body.status })
      }
    });
    
    res.json(serializeCarpoolListing(updated));
  } catch (error) {
    console.error('Update carpool error:', error);
    res.status(500).json({ error: 'Failed to update carpool' });
  }
};

export const deleteCarpoolListing = async (req, res) => {
  try {
    const carpool = await prisma.carpoolListing.findUnique({
      where: { id: req.params.id }
    });
    
    if (!carpool || carpool.driverId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await prisma.carpoolListing.delete({
      where: { id: req.params.id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete carpool error:', error);
    res.status(500).json({ error: 'Failed to delete carpool' });
  }
};

// ========================================
// CARPOOL PASSENGER CONTROLLERS
// ========================================

export const joinCarpool = async (req, res) => {
  try {
    const carpool = await prisma.carpoolListing.findUnique({
      where: { id: req.params.carpoolId },
      include: { passengers: true }
    });
    
    if (!carpool) {
      return res.status(404).json({ error: 'Carpool not found' });
    }
    
    if (carpool.seats >= carpool.totalSeats) {
      return res.status(400).json({ error: 'Carpool is full' });
    }
    
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    
    const passenger = await prisma.carpoolPassenger.create({
      data: {
        passengerId: req.userId,
        passengerName: user.name,
        passengerEmail: user.email,
        passengerPhone: user.phone,
        passengerProfilePicture: user.profilePicture,
        passengerGender: user.gender,
        carpoolId: req.params.carpoolId,
        status: 'Confirmed'
      }
    });
    
    await prisma.carpoolListing.update({
      where: { id: req.params.carpoolId },
      data: { 
        seats: { increment: 1 },
        status: carpool.seats + 1 >= carpool.totalSeats ? 'Full' : 'Active'
      }
    });
    
    res.json(passenger);
  } catch (error) {
    console.error('Join carpool error:', error);
    res.status(500).json({ error: 'Failed to join carpool' });
  }
};

export const leaveCarpool = async (req, res) => {
  try {
    const passenger = await prisma.carpoolPassenger.findUnique({
      where: {
        passengerId_carpoolId: {
          passengerId: req.userId,
          carpoolId: req.params.carpoolId
        }
      }
    });
    
    if (!passenger) {
      return res.status(404).json({ error: 'Not in this carpool' });
    }
    
    await prisma.carpoolPassenger.delete({
      where: {
        passengerId_carpoolId: {
          passengerId: req.userId,
          carpoolId: req.params.carpoolId
        }
      }
    });
    
    await prisma.carpoolListing.update({
      where: { id: req.params.carpoolId },
      data: { 
        seats: { decrement: 1 },
        status: 'Active'
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Leave carpool error:', error);
    res.status(500).json({ error: 'Failed to leave carpool' });
  }
};

export const getMyRides = async (req, res) => {
  try {
    const passengers = await prisma.carpoolPassenger.findMany({
      where: { passengerId: req.userId },
      include: {
        carpool: true
      }
    });
    
    res.json(passengers.map(p => serializeCarpoolListing(p.carpool)));
  } catch (error) {
    console.error('Get my rides error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========================================
// COMPATIBILITY SCORE CONTROLLERS
// ========================================

export const getCompatibilityScore = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Check if score already exists
    let compatScore = await prisma.compatibilityScore.findUnique({
      where: {
        seekerId_providerId: {
          seekerId: req.userId,
          providerId: providerId
        }
      }
    });
    
    // If score doesn't exist, calculate and store it
    if (!compatScore) {
      // Get both questionnaires
      const seekerUser = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { questionnaire: true }
      });
      
      const providerUser = await prisma.user.findUnique({
        where: { id: providerId },
        include: { questionnaire: true }
      });
      
      if (!seekerUser?.questionnaire || !providerUser?.questionnaire) {
        return res.status(404).json({ error: 'Questionnaires not found' });
      }
      
      // Calculate comprehensive compatibility score
      const seekerQ = serializeQuestionnaire(seekerUser.questionnaire);
      const providerQ = serializeQuestionnaire(providerUser.questionnaire);
      const compatibilityData = calculateCompatibilityForDB(seekerQ, providerQ);
      
      // Store in database with all details
      compatScore = await prisma.compatibilityScore.create({
        data: {
          seekerId: req.userId,
          providerId: providerId,
          score: compatibilityData.score,
          matchReasons: compatibilityData.matchReasons,
          potentialConflicts: compatibilityData.potentialConflicts,
          dealBreakerViolations: compatibilityData.dealBreakerViolations,
          categoryScores: compatibilityData.categoryScores
        }
      });
    }
    
    // Parse and return the full compatibility data
    const parsedData = parseCompatibilityFromDB(compatScore);
    res.json(parsedData);
  } catch (error) {
    console.error('Get compatibility score error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const recalculateCompatibilityScores = async (req, res) => {
  try {
    // Delete all existing scores for this user (as seeker)
    await prisma.compatibilityScore.deleteMany({
      where: { seekerId: req.userId }
    });
    
    // Also delete scores where this user is the provider
    await prisma.compatibilityScore.deleteMany({
      where: { providerId: req.userId }
    });
    
    res.json({ success: true, message: 'Compatibility scores will be recalculated on next view' });
  } catch (error) {
    console.error('Recalculate scores error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};