const mongoose = require("mongoose");

module.exports = mongoose.model("GstConfig", new mongoose.Schema({
  gstPercent: Number,
  cgstPercent: Number,
  sgstPercent: Number
}));
