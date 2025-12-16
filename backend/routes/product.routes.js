import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  getProductController,
  listProductsController,
  updateProductController,
} from '../controllers/product.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validateId.middleware.js';
import { createProductValidator } from '../middleware/validate.middleware.js';

const router = Router();

// Public product listing and details
router.get('/', listProductsController);
router.get('/:id', validateObjectId('id'), getProductController);

// Admin CRUD
router.post('/', authenticate, requireRole('admin'), createProductValidator, createProductController);
router.put('/:id', authenticate, requireRole('admin'), validateObjectId('id'), updateProductController);
router.delete('/:id', authenticate, requireRole('admin'), validateObjectId('id'), deleteProductController);

export default router;
