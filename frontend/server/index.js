import express from 'express';
import cors from 'cors';
import { connectDatabase, disconnectDatabase } from './models.js';
import router from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========================================
// API ROUTES
// ========================================

app.use('/api', router);

// ========================================
// HEALTH CHECK
// ========================================

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'UniMate API is running' });
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log('========================================');
      console.log('🚀 UniMate Backend Server');
      console.log('========================================');
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ API endpoint: http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log('========================================');
      console.log('📋 Available Routes:');
      console.log('   Auth: /api/auth/register, /api/auth/login');
      console.log('   Users: /api/user/me, /api/users/:email');
      console.log('   Questionnaire: /api/questionnaire');
      console.log('   Dorms: /api/dorms, /api/dorms/my-listings');
      console.log('   Carpools: /api/carpools, /api/carpools/my-listings');
      console.log('   Applications: /api/dorms/applications/received');
      console.log('========================================');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await disconnectDatabase();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
