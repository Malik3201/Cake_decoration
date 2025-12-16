import { Product } from '../models/product.model.js';

export async function createProduct(data) {
  return Product.create(data);
}

export async function listProducts(filter = {}) {
  return Product.find(filter)
    .populate('category')
    .sort({ createdAt: -1 });
}

export async function getProductById(id) {
  return Product.findById(id).populate('category');
}

export async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category');
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

export async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}


