const mongoose = require('mongoose');

const partnerPriceSchema = new mongoose.Schema(
  {
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    link: {
      type: String,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// index composite pour éviter les doublons
partnerPriceSchema.index({ component: 1, partner: 1 }, { unique: true });

module.exports = mongoose.model('PartnerPrice', partnerPriceSchema);
