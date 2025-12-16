import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '../services/category.service.js';

export async function createCategoryController(req, res, next) {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
}

export async function listCategoriesController(req, res, next) {
  try {
    const categories = await listCategories();
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryController(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategoryController(req, res, next) {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategoryController(req, res, next) {
  try {
    await deleteCategory(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}


