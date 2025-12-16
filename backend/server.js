import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/decora_bake';

/**
 * Validate required environment variables on startup
 */
function validateConfig() {
  const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    logger.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  // Warn about weak secrets in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_ACCESS_SECRET?.length < 32) {
      logger.warn('JWT_ACCESS_SECRET should be at least 32 characters in production');
    }
    if (process.env.JWT_REFRESH_SECRET?.length < 32) {
      logger.warn('JWT_REFRESH_SECRET should be at least 32 characters in production');
    }
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    // Validate configuration first
    validateConfig();
    
    await mongoose.connect(MONGODB_URI, {
      // options can be customized if needed
    });
    logger.info('✅ Connected to MongoDB');

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

startServer();
