import { Router } from 'express';
import {
  adminLogin,
  changePassword,
  getProfile,
  login,
  logout,
  refreshTokenController,
  register,
  updateProfile,
} from '../controllers/auth.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from '../middleware/validate.middleware.js';

const router = Router();

// Public (with rate limiting for security)
router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/admin/login', authLimiter, loginValidator, adminLogin);
router.post('/refresh', refreshTokenController);

// Authenticated
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getProfile);
router.patch('/me', authenticate, updateProfileValidator, updateProfile);
router.post('/change-password', authenticate, changePasswordValidator, changePassword);

// Example protected admin route
router.get('/admin/protected', authenticate, requireRole('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'You are an admin and can access this route.',
  });
});

export default router;
