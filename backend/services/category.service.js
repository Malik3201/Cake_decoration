import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { slugify } from '../utils/slugify.js';

export async function createCategory(data) {
  try {
    // Ensure slug is generated if not provided
    if (!data.slug && data.name) {
      data.slug = slugify(data.name);
    }
    return await Category.create(data);
  } catch (err) {
    // Handle duplicate category name (unique index violation)
    if (err && err.code === 11000) {
      const friendly = new Error('Category name already exists');
      friendly.statusCode = 400;
      throw friendly;
    }
    throw err;
  }
}

export async function listCategories() {
  return Category.find().sort({ name: 1 });
}

export async function getCategoryById(id) {
  return Category.findById(id);
}

export async function updateCategory(id, data) {
  // Ensure slug is generated if name is updated and slug not provided
  if (data.name && !data.slug) {
    data.slug = slugify(data.name);
  }
  
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}

export async function deleteCategory(id) {
  // Check if any products are using this category
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    const err = new Error(
      `Cannot delete category with ${productCount} product${productCount > 1 ? 's' : ''}. ` +
      `Please reassign or delete the products first.`
    );
    err.statusCode = 400;
    throw err;
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}
