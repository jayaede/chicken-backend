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
      required: true,
      min: [1, "Quantity must be valid"]
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: [1, "Price must be valid"]
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [1, "Total amount must be valid"]
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
