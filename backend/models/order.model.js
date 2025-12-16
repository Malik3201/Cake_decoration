import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unitSalePrice: {
      type: Number,
      default: null,
      min: 0,
    },
    // Snapshot product title at order time
    productTitle: {
      type: String,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postcode: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Valid status transitions for order lifecycle
const STATUS_TRANSITIONS = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentIntentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['requires_payment', 'succeeded', 'failed', 'refunded'],
      default: 'requires_payment',
      index: true,
    },
    shippingAddress: shippingAddressSchema,
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    currency: {
      type: String,
      default: 'aud',
      enum: ['aud'],
    },
  },
  { timestamps: true }
);

// Indexes for common queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: 1 });

/**
 * Check if a status transition is valid
 */
orderSchema.methods.canTransitionTo = function(newStatus) {
  const allowed = STATUS_TRANSITIONS[this.status] || [];
  return allowed.includes(newStatus);
};

/**
 * Get allowed next statuses
 */
orderSchema.methods.getAllowedTransitions = function() {
  return STATUS_TRANSITIONS[this.status] || [];
};

export const Order = mongoose.model('Order', orderSchema);
export { STATUS_TRANSITIONS };
