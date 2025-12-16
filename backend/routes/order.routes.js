import { Router } from 'express';
import {
  cancelMyOrderController,
  cancelOrderController,
  createOrderController,
  getMyOrderController,
  getOrderController,
  listAllOrdersController,
  listMyOrdersController,
  markOrderPaidController,
  updateOrderStatusController,
} from '../controllers/order.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validateId.middleware.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
} from '../middleware/validate.middleware.js';

const router = Router();

// User routes
router.post('/', authenticate, createOrderValidator, createOrderController);
router.get('/me', authenticate, listMyOrdersController);
router.get('/me/:id', authenticate, validateObjectId('id'), getMyOrderController);
router.post('/me/:id/cancel', authenticate, validateObjectId('id'), cancelMyOrderController);

// Admin routes
router.get('/', authenticate, requireRole('admin'), listAllOrdersController);
router.get('/:id', authenticate, requireRole('admin'), validateObjectId('id'), getOrderController);
router.patch('/:id/status', authenticate, requireRole('admin'), validateObjectId('id'), updateOrderStatusValidator, updateOrderStatusController);
router.patch('/:id/paid', authenticate, requireRole('admin'), validateObjectId('id'), markOrderPaidController);
router.post('/:id/cancel', authenticate, requireRole('admin'), validateObjectId('id'), cancelOrderController);

export default router;
