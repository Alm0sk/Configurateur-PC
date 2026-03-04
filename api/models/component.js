const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
    image: {
      type: String,
      default: null,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Component', componentSchema);
