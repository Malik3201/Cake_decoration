import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../services/product.service.js';

export async function createProductController(req, res, next) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

export async function listProductsController(req, res, next) {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }
    filter.isActive = true;

    const products = await listProducts(filter);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

export async function getProductController(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

export async function updateProductController(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    await deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}


