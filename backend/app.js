import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import reportRoutes from './routes/report.routes.js';
import saleRoutes from './routes/sale.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { logger } from './utils/logger.js';

const app = express();

// Ensure MongoDB connection is initialized when app is imported (e.g. in serverless environments like Vercel)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error('MONGODB_URI is not set. Please configure it in your environment variables.');
} else if (mongoose.connection.readyState === 0) {
  // Only attempt to connect if not already connected (prevents duplicate connects when server.js runs locally)
  mongoose
    .connect(MONGODB_URI, {
      // You can customize options for Atlas here if needed
      // serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
      logger.info('✅ MongoDB connected (app.js bootstrap)');
    })
    .catch(err => {
      logger.error('❌ MongoDB connection error during app bootstrap:', err);
    });
}

// Security headers
app.use(helmet());

// Global middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sales', saleRoutes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;


