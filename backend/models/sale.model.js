import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for finding active sales
saleSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

// Virtual to check if sale is currently running
saleSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

// Ensure virtuals are included in JSON output
saleSchema.set('toJSON', { virtuals: true });
saleSchema.set('toObject', { virtuals: true });

export const Sale = mongoose.model('Sale', saleSchema);
