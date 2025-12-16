import mongoose from 'mongoose';
import { Order, STATUS_TRANSITIONS } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { parsePagination, buildPaginationMeta } from '../utils/pagination.js';

/**
 * Create a new order with atomic stock deduction
 */
export async function createOrder({ userId, items, shippingAddress }) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Order items are required');
    err.statusCode = 400;
    throw err;
  }

  const productIds = items.map(i => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map(p => [p._id.toString(), p]));

  const orderItems = [];
  let totalAmount = 0;

  // First validate all products exist and have stock
  for (const item of items) {
    const product = productMap.get(item.product);
    if (!product) {
      const err = new Error('One or more products not found or inactive');
      err.statusCode = 400;
      throw err;
    }

    if (product.stock < item.quantity) {
      const err = new Error(`Insufficient stock for product "${product.title}"`);
      err.statusCode = 400;
      throw err;
    }
  }

  // Atomically deduct stock for each product
  for (const item of items) {
    const product = productMap.get(item.product);
    
    // Use atomic update to prevent race condition
    const result = await Product.updateOne(
      { _id: product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );

    if (result.modifiedCount === 0) {
      // Stock was modified by another request - rollback previous deductions
      for (const prevItem of orderItems) {
        await Product.updateOne(
          { _id: prevItem.product },
          { $inc: { stock: prevItem.quantity } }
        );
      }
      const err = new Error(`Insufficient stock for product "${product.title}". Please try again.`);
      err.statusCode = 400;
      throw err;
    }

    const unitPrice = product.price;
    const unitSalePrice = product.salePrice ?? null;
    const effectivePrice = unitSalePrice ?? unitPrice;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      unitPrice,
      unitSalePrice,
      productTitle: product.title, // Snapshot title
    });

    totalAmount += effectivePrice * item.quantity;
  }

  const order = await Order.create({
    user: new mongoose.Types.ObjectId(userId),
    items: orderItems,
    totalAmount,
    shippingAddress,
  });

  return order.populate('items.product');
}

/**
 * List user orders with pagination
 */
export async function listUserOrders(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  
  const filter = { user: userId };
  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: buildPaginationMeta(totalCount, page, limit),
  };
}

/**
 * Get single order for user
 */
export async function getUserOrderById(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product');
  return order;
}

/**
 * List all orders (admin) with pagination
 */
export async function listAllOrders(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  
  const filter = {};
  
  // Optional status filter
  if (query.status) {
    filter.status = query.status;
  }
  
  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .populate('user')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: buildPaginationMeta(totalCount, page, limit),
  };
}

/**
 * Get single order (admin)
 */
export async function getOrderById(orderId) {
  return Order.findById(orderId).populate('user').populate('items.product');
}

/**
 * Update order status with lifecycle validation
 */
export async function updateOrderStatus(orderId, newStatus) {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  // Validate status transition
  if (!order.canTransitionTo(newStatus)) {
    const allowed = order.getAllowedTransitions();
    const err = new Error(
      `Cannot transition order from "${order.status}" to "${newStatus}". ` +
      `Allowed transitions: ${allowed.length ? allowed.join(', ') : 'none'}`
    );
    err.statusCode = 400;
    throw err;
  }

  order.status = newStatus;
  const now = new Date();
  
  switch (newStatus) {
    case 'paid':
      order.paidAt = now;
      break;
    case 'shipped':
      order.shippedAt = now;
      break;
    case 'delivered':
      order.deliveredAt = now;
      break;
    case 'cancelled':
      order.cancelledAt = now;
      // Restore stock when cancelling
      await restoreOrderStock(order);
      break;
  }

  await order.save();
  return order.populate('user').populate('items.product');
}

/**
 * Mark order as paid
 */
export async function markOrderPaid(orderId, paymentIntentId) {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  // Check if already paid
  if (order.paymentStatus === 'succeeded') {
    const err = new Error('Order is already paid');
    err.statusCode = 400;
    throw err;
  }

  // Validate transition
  if (!order.canTransitionTo('paid')) {
    const err = new Error(`Cannot mark order as paid from status "${order.status}"`);
    err.statusCode = 400;
    throw err;
  }

  order.status = 'paid';
  order.paymentStatus = 'succeeded';
  order.paymentIntentId = paymentIntentId;
  order.paidAt = new Date();

  await order.save();
  return order.populate('user').populate('items.product');
}

/**
 * Cancel an order (user or admin)
 */
export async function cancelOrder(orderId, userId, isAdmin = false, reason = '') {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  // Check ownership for non-admin users
  if (!isAdmin && order.user.toString() !== userId.toString()) {
    const err = new Error('You can only cancel your own orders');
    err.statusCode = 403;
    throw err;
  }

  // Validate transition
  if (!order.canTransitionTo('cancelled')) {
    const err = new Error(`Cannot cancel order with status "${order.status}"`);
    err.statusCode = 400;
    throw err;
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = reason;

  // Restore stock
  await restoreOrderStock(order);

  await order.save();
  return order.populate('user').populate('items.product');
}

/**
 * Helper to restore stock when cancelling an order
 */
async function restoreOrderStock(order) {
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } }
    );
  }
}
