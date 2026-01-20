const mongoose = require("mongoose");
const priceSchema = new mongoose.Schema(
  {
    cutType: {
      type: String,
      required: true,
      unique: true
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: [1, "Price must be valid"]
    },
    history: [
      {
        price: Number,
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChickenPrices", priceSchema);
