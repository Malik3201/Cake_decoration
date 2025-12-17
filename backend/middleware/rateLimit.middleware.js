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
 * Rate limiter for authentication (login) endpoints
 * Default: 20 failed attempts per 15 minutes per IP
 * Successful logins are not counted to keep UX smooth.
 */
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  skipSuccessfulRequests: true, // Don't count successful logins against limit
});

/**
 * Dedicated rate limiter for registration endpoints
 * Signups are rare compared to logins, so we allow fewer attempts but over a longer window
 * Default: 10 attempts per hour per IP
 */
export const registerLimiter = rateLimit({
  windowMs: parseInt(process.env.REGISTER_RATE_LIMIT_WINDOW_MS, 10) || 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.REGISTER_RATE_LIMIT_MAX, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many sign-up attempts from this device. Please wait a while and try again.',
  },
  skipSuccessfulRequests: true,
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
