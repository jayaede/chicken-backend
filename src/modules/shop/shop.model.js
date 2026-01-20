const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { 
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"]
    },
    shopUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
