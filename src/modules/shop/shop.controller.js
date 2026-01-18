const Shop = require("./shop.model");
const Stock = require("../stock/stock.model");

/**
 * Get shop stock (manager only)
 */
exports.getStock = async (req, res) => {
  try {
    const stock = await Stock.find({ shopId: req.user.shopId });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update stock quantity
 */
exports.updateStock = async (req, res) => {
  try {
    const { cutType, remainingKg } = req.body;

    if (!cutType || remainingKg == null) {
      return res.status(400).json({ message: "cutType and remainingKg required" });
    }

    const stock = await Stock.findOneAndUpdate(
      { shopId: req.user.shopId, cutType },
      { remainingKg },
      { new: true, upsert: true }
    );

    res.json({ message: "Stock updated", stock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
