const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['CPU', 'GPU', 'RAM', 'Stockage', 'Carte Mère', 'Boîtier', 'Alimentation', 'Refroidissement', 'SSD', 'HDD'],
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
