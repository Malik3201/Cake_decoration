import { Sale } from '../models/sale.model.js';
import { Product } from '../models/product.model.js';

/**
 * Create a new sale
 */
export async function createSale(data) {
  // Validate dates
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  
  if (endDate <= startDate) {
    const err = new Error('End date must be after start date');
    err.statusCode = 400;
    throw err;
  }

  // Validate products exist
  if (data.products && data.products.length > 0) {
    const productCount = await Product.countDocuments({
      _id: { $in: data.products },
    });
    if (productCount !== data.products.length) {
      const err = new Error('One or more products not found');
      err.statusCode = 400;
      throw err;
    }
  }

  const sale = await Sale.create({
    label: data.label,
    discountPercent: data.discountPercent,
    startDate,
    endDate,
    products: data.products || [],
    isActive: data.isActive !== false,
  });

  return sale.populate('products');
}

/**
 * Get all sales (admin)
 */
export async function listSales() {
  return Sale.find()
    .populate('products', 'title price images')
    .sort({ createdAt: -1 });
}

/**
 * Get active sales (public)
 */
export async function getActiveSales() {
  const now = new Date();
  return Sale.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .populate('products', 'title price salePrice images description stock')
    .sort({ endDate: 1 });
}

/**
 * Get sale by ID
 */
export async function getSaleById(id) {
  return Sale.findById(id).populate('products', 'title price images');
}

/**
 * Update a sale
 */
export async function updateSale(id, data) {
  const sale = await Sale.findById(id);
  if (!sale) {
    const err = new Error('Sale not found');
    err.statusCode = 404;
    throw err;
  }

  // Validate dates if provided
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate <= startDate) {
      const err = new Error('End date must be after start date');
      err.statusCode = 400;
      throw err;
    }
  }

  // Validate products if provided
  if (data.products && data.products.length > 0) {
    const productCount = await Product.countDocuments({
      _id: { $in: data.products },
    });
    if (productCount !== data.products.length) {
      const err = new Error('One or more products not found');
      err.statusCode = 400;
      throw err;
    }
  }

  // Update fields
  if (data.label !== undefined) sale.label = data.label;
  if (data.discountPercent !== undefined) sale.discountPercent = data.discountPercent;
  if (data.startDate !== undefined) sale.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) sale.endDate = new Date(data.endDate);
  if (data.products !== undefined) sale.products = data.products;
  if (data.isActive !== undefined) sale.isActive = data.isActive;

  await sale.save();
  return sale.populate('products');
}

/**
 * Delete a sale
 */
export async function deleteSale(id) {
  const sale = await Sale.findByIdAndDelete(id);
  if (!sale) {
    const err = new Error('Sale not found');
    err.statusCode = 404;
    throw err;
  }
  return sale;
}

/**
 * Add products to a sale
 */
export async function addProductsToSale(saleId, productIds) {
  const sale = await Sale.findById(saleId);
  if (!sale) {
    const err = new Error('Sale not found');
    err.statusCode = 404;
    throw err;
  }

  // Validate products exist
  const productCount = await Product.countDocuments({
    _id: { $in: productIds },
  });
  if (productCount !== productIds.length) {
    const err = new Error('One or more products not found');
    err.statusCode = 400;
    throw err;
  }

  // Add products (avoid duplicates)
  const existingIds = sale.products.map(p => p.toString());
  const newProducts = productIds.filter(id => !existingIds.includes(id));
  sale.products.push(...newProducts);

  await sale.save();
  return sale.populate('products');
}

/**
 * Remove products from a sale
 */
export async function removeProductsFromSale(saleId, productIds) {
  const sale = await Sale.findById(saleId);
  if (!sale) {
    const err = new Error('Sale not found');
    err.statusCode = 404;
    throw err;
  }

  sale.products = sale.products.filter(
    p => !productIds.includes(p.toString())
  );

  await sale.save();
  return sale.populate('products');
}
