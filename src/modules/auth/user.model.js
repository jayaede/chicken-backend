const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "SHOP"],
      default: "SHOP"
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null
    },
    phone: { 
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"]
    },
    shopName: {
      type: String,
      required: function () {
        return this.role === "SHOP";
      }
    },
    otpHash: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

// ✅ PREVENT OverwriteModelError
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
