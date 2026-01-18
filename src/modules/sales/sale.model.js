const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },
    customerName: {
      type: String
    },
    cutType: {
      type: String,
      required: true
    },
    quantityKg: {
      type: Number,
      required: true
    },
    pricePerKg: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    saleDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// 🔒 Prevent overwrite in nodemon
module.exports = mongoose.model("Sale", saleSchema);
