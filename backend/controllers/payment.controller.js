import crypto from 'crypto';
import { getOrderById, markOrderPaid } from '../services/order.service.js';

// This is a simplified "payment intent" style API.
// In a real app, you'd integrate Stripe, PayPal, etc.

export async function createPaymentIntentController(req, res, next) {
  try {
    const { orderId } = req.body;
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (order.paymentStatus === 'succeeded') {
      return res.status(400).json({ success: false, message: 'Order already paid' });
    }

    const paymentIntentId = crypto.randomUUID();

    // In a real integration, you'd call your PSP to create an intent here
    const clientSecret = `mock_client_secret_${paymentIntentId}`;

    res.status(201).json({
      success: true,
      paymentIntent: {
        id: paymentIntentId,
        amount: order.totalAmount,
        currency: order.currency,
        clientSecret,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function confirmPaymentController(req, res, next) {
  try {
    const { orderId, paymentIntentId } = req.body;
    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // In a real flow you would verify with the PSP here.
    const updated = await markOrderPaid(orderId, paymentIntentId);
    res.json({ success: true, order: updated });
  } catch (err) {
    next(err);
  }
}


