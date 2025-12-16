import { Router } from 'express';
import {
  getSalesOverTimeController,
  getSummaryStatsController,
} from '../controllers/analytics.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/summary', authenticate, requireRole('admin'), getSummaryStatsController);
router.get('/sales', authenticate, requireRole('admin'), getSalesOverTimeController);

export default router;


