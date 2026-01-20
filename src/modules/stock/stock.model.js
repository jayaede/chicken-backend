const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },
    itemName: {
      type: String,
      default: "Chicken"
    },
    quantityKg: {
      type: Number,
      required: true,
      min: [1, "Quantity must be valid"]
    },
    lowStockAlertKg: {
      type: Number,
      default: 10
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
