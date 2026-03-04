const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    components: [
      {
        component: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Component',
          required: true,
        },
        selectedPartner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Partner',
          default: null,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'finalized', 'archived'],
      default: 'draft',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Configuration', configurationSchema);
