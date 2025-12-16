import { Router } from 'express';
import {
  confirmPaymentController,
  createPaymentIntentController,
} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/intent', authenticate, createPaymentIntentController);
router.post('/confirm', authenticate, confirmPaymentController);

export default router;


