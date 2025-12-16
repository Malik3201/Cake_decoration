import { Router } from 'express';
import {
  createSaleController,
  deleteSaleController,
  getActiveSalesController,
  getSaleController,
  listSalesController,
  updateSaleController,
  addProductsController,
  removeProductsController,
} from '../controllers/sale.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validateId.middleware.js';

const router = Router();

// Public: Get active sales (for landing page)
router.get('/active', getActiveSalesController);

// Admin routes
router.get('/', authenticate, requireRole('admin'), listSalesController);
router.get('/:id', authenticate, requireRole('admin'), validateObjectId('id'), getSaleController);
router.post('/', authenticate, requireRole('admin'), createSaleController);
router.put('/:id', authenticate, requireRole('admin'), validateObjectId('id'), updateSaleController);
router.delete('/:id', authenticate, requireRole('admin'), validateObjectId('id'), deleteSaleController);

// Product management for sales
router.post('/:id/products', authenticate, requireRole('admin'), validateObjectId('id'), addProductsController);
router.delete('/:id/products', authenticate, requireRole('admin'), validateObjectId('id'), removeProductsController);

export default router;
