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
      required: true
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
