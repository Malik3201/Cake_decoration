import { logger } from '../utils/logger.js';

// 404 handler
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}

// Centralized error handler
export function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || 500;
  
  // Log error with context (use proper logger, not console)
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, {
    statusCode,
    stack: isProd ? undefined : err.stack,
    userId: req.user?._id,
  });

  // Handle MongoDB CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}`,
    });
  }

  // Don't expose internal error details in production
  const message = isProd && statusCode === 500 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
}
