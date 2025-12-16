import {
  createOrder,
  cancelOrder,
  getOrderById,
  getUserOrderById,
  listAllOrders,
  listUserOrders,
  markOrderPaid,
  updateOrderStatus,
} from '../services/order.service.js';

export async function createOrderController(req, res, next) {
  try {
    const order = await createOrder({
      userId: req.user._id,
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

export async function listMyOrdersController(req, res, next) {
  try {
    const result = await listUserOrders(req.user._id, req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrderController(req, res, next) {
  try {
    const order = await getUserOrderById(req.user._id, req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

export async function cancelMyOrderController(req, res, next) {
  try {
    const { reason } = req.body;
    const order = await cancelOrder(req.params.id, req.user._id, false, reason);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

// Admin
export async function listAllOrdersController(req, res, next) {
  try {
    const result = await listAllOrders(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getOrderController(req, res, next) {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatusController(req, res, next) {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

export async function markOrderPaidController(req, res, next) {
  try {
    const { paymentIntentId } = req.body;
    const order = await markOrderPaid(req.params.id, paymentIntentId);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrderController(req, res, next) {
  try {
    const { reason } = req.body;
    const order = await cancelOrder(req.params.id, req.user._id, true, reason);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}
