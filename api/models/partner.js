const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: null,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    priceSync: {
      enabled: {
        type: Boolean,
        default: false,
      },
      lastSync: {
        type: Date,
        default: null,
      },
      syncUrl: {
        type: String,
        default: null,
      },
    },
    affiliation: {
      commissionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      conditions: {
        type: String,
        default: '',
      },
      affiliateUrl: {
        type: String,
        default: null,
      },
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

module.exports = mongoose.model('Partner', partnerSchema);
