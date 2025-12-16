import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 1000 requests per 15 minutes (generous for production)
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 1000, // Increased from 100
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

/**
 * Rate limiter for authentication endpoints
 * 20 attempts per 15 minutes to prevent brute force while allowing normal use
 */
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 20, // Increased from 5
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  skipSuccessfulRequests: true, // Don't count successful logins against limit
});

/**
 * AI endpoint rate limiter
 * 30 requests per minute to prevent abuse
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Increased from 20
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests, please slow down',
  },
});
