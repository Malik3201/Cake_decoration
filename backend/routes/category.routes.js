import { Router } from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  listCategoriesController,
  updateCategoryController,
} from '../controllers/category.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validateId.middleware.js';
import { createCategoryValidator } from '../middleware/validate.middleware.js';

const router = Router();

// Public: list and get single category
router.get('/', listCategoriesController);
router.get('/:id', validateObjectId('id'), getCategoryController);

// Admin: CRUD
router.post('/', authenticate, requireRole('admin'), createCategoryValidator, createCategoryController);
router.put('/:id', authenticate, requireRole('admin'), validateObjectId('id'), updateCategoryController);
router.delete('/:id', authenticate, requireRole('admin'), validateObjectId('id'), deleteCategoryController);

export default router;
