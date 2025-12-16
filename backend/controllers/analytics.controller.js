import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';

export async function getSummaryStatsController(req, res, next) {
  try {
    const [revenueAgg, ordersCount, customersCount] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'succeeded' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        ordersCount,
        customersCount,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getSalesOverTimeController(req, res, next) {
  try {
    const { range = 'monthly' } = req.query;

    const match = { paymentStatus: 'succeeded' };

    let dateGroup;
    if (range === 'daily') {
      dateGroup = {
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
      };
    } else {
      dateGroup = {
        $dateToString: { format: '%Y-%m', date: '$createdAt' },
      };
    }

    const data = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: dateGroup,
          revenue: { $sum: '$totalAmount' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      range,
      data: data.map(d => ({
        period: d._id,
        revenue: d.revenue,
        ordersCount: d.ordersCount,
      })),
    });
  } catch (err) {
    next(err);
  }
}


