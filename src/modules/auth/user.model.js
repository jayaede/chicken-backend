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
    }
  },
  { timestamps: true }
);

// ✅ PREVENT OverwriteModelError
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
