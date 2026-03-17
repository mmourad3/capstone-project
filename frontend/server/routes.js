import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import * as controllers from './controllers.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Multer for file uploads
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  storage: multer.memoryStorage()
});

// ========================================
// MIDDLEWARE
// ========================================

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ========================================
// AUTH ROUTES
// ========================================

router.post('/auth/register', controllers.register);
router.post('/auth/login', controllers.login);
router.get('/auth/check-email/:email', controllers.checkEmailExists);

// ========================================
// USER ROUTES
// ========================================

router.get('/user/me', authenticate, controllers.getCurrentUser);
router.post('/user/profile-picture', authenticate, upload.single('profilePicture'), controllers.uploadProfilePicture);
router.put('/user/profile', authenticate, controllers.updateUserProfile);
router.get('/users/:email', controllers.getUserByEmail);

// ========================================
// QUESTIONNAIRE ROUTES
// ========================================

router.post('/questionnaire', authenticate, controllers.saveQuestionnaire);

// ========================================
// CLASS SCHEDULE ROUTES
// ========================================

router.post('/class-schedule', authenticate, controllers.saveClassSchedule);

// ========================================
// DORM LISTING ROUTES
// ========================================

router.get('/dorms', controllers.getAllDormListings);
router.get('/dorms/my-listings', authenticate, controllers.getMyDormListings);
router.post('/dorms', authenticate, controllers.createDormListing);
router.put('/dorms/:id', authenticate, controllers.updateDormListing);
router.delete('/dorms/:id', authenticate, controllers.deleteDormListing);

// ========================================
// DORM APPLICATION ROUTES
// ========================================

router.post('/dorms/:dormId/apply', authenticate, controllers.applyToDorm);
router.get('/dorms/applications/received', authenticate, controllers.getReceivedApplications);
router.get('/dorms/applications/sent', authenticate, controllers.getSentApplications);
router.put('/dorms/applications/:id', authenticate, controllers.updateApplication);

// ========================================
// CARPOOL LISTING ROUTES
// ========================================

router.get('/carpools', controllers.getCarpoolListings);
router.get('/carpools/my-listings', authenticate, controllers.getMyCarpoolListings);
router.post('/carpools', authenticate, controllers.createCarpoolListing);
router.put('/carpools/:id', authenticate, controllers.updateCarpoolListing);
router.delete('/carpools/:id', authenticate, controllers.deleteCarpoolListing);

// ========================================
// CARPOOL PASSENGER ROUTES
// ========================================

router.post('/carpools/:carpoolId/join', authenticate, controllers.joinCarpool);
router.delete('/carpools/:carpoolId/leave', authenticate, controllers.leaveCarpool);
router.get('/carpools/my-rides', authenticate, controllers.getMyRides);

// ========================================
// COMPATIBILITY SCORE ROUTES
// ========================================

router.get('/compatibility/:providerId', authenticate, controllers.getCompatibilityScore);
router.post('/compatibility/recalculate', authenticate, controllers.recalculateCompatibilityScores);

export default router;