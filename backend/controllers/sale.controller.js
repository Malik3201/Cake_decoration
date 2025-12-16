import {
  createSale,
  deleteSale,
  getActiveSales,
  getSaleById,
  listSales,
  updateSale,
  addProductsToSale,
  removeProductsFromSale,
} from '../services/sale.service.js';

// Admin: Create sale
export async function createSaleController(req, res, next) {
  try {
    const sale = await createSale(req.body);
    res.status(201).json({ success: true, sale });
  } catch (err) {
    next(err);
  }
}

// Admin: List all sales
export async function listSalesController(req, res, next) {
  try {
    const sales = await listSales();
    res.json({ success: true, sales });
  } catch (err) {
    next(err);
  }
}

// Public: Get active sales
export async function getActiveSalesController(req, res, next) {
  try {
    const sales = await getActiveSales();
    res.json({ success: true, sales });
  } catch (err) {
    next(err);
  }
}

// Admin: Get sale by ID
export async function getSaleController(req, res, next) {
  try {
    const sale = await getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, sale });
  } catch (err) {
    next(err);
  }
}

// Admin: Update sale
export async function updateSaleController(req, res, next) {
  try {
    const sale = await updateSale(req.params.id, req.body);
    res.json({ success: true, sale });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete sale
export async function deleteSaleController(req, res, next) {
  try {
    await deleteSale(req.params.id);
    res.json({ success: true, message: 'Sale deleted' });
  } catch (err) {
    next(err);
  }
}

// Admin: Add products to sale
export async function addProductsController(req, res, next) {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'productIds array required' });
    }
    const sale = await addProductsToSale(req.params.id, productIds);
    res.json({ success: true, sale });
  } catch (err) {
    next(err);
  }
}

// Admin: Remove products from sale
export async function removeProductsController(req, res, next) {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'productIds array required' });
    }
    const sale = await removeProductsFromSale(req.params.id, productIds);
    res.json({ success: true, sale });
  } catch (err) {
    next(err);
  }
}
