import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: false, // Will be auto-generated if not provided
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
categorySchema.pre('save', function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

// Also handle during validation for updates
categorySchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

export const Category = mongoose.model('Category', categorySchema);


