import { Router } from 'express';
import multer from 'multer';
import {
  exportOrdersCsvController,
  exportProductsCsvController,
  importProductsCsvController,
} from '../controllers/report.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All report routes are admin-only
router.get('/orders', authenticate, requireRole('admin'), exportOrdersCsvController);
router.get('/products', authenticate, requireRole('admin'), exportProductsCsvController);
router.post(
  '/products/import',
  authenticate,
  requireRole('admin'),
  upload.single('file'),
  importProductsCsvController
);

export default router;


