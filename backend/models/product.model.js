import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String, // file path or URL to local asset
        trim: true,
      },
    ],
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// Auto-generate slug from title if not provided
productSchema.pre('validate', function () {
  // Generate slug from title if not set
  if (!this.slug && this.title) {
    this.slug = slugify(this.title) + '-' + Date.now().toString(36);
  }
  
  // Ensure salePrice is null if undefined
  if (this.salePrice === undefined) {
    this.salePrice = null;
  }
  
  // Validate salePrice is less than price
  if (this.salePrice !== null && this.salePrice >= this.price) {
    this.invalidate('salePrice', 'Sale price must be less than regular price');
  }
});

export const Product = mongoose.model('Product', productSchema);
