const ChickenPrices = require("./price.model");

exports.addPrice = async (req, res) => {
  const { cutType, pricePerKg } = req.body;

  const exists = await ChickenPrices.findOne({ cutType });
  if (exists) {
    return res.status(400).json({ message: "Price already exists for this cut type" });
  }

  const newPrice = await ChickenPrices.create({
    cutType,
    pricePerKg
  });

  res.status(201).json(newPrice);
};
exports.updatePrice = async (req, res) => {
  const { pricePerKg } = req.body;

  const existing = await ChickenPrices.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: "Price not found" });
  }

  // Save old price in history
  existing.history.push({
    pricePerKg: existing.pricePerKg
  });

  existing.pricePerKg = pricePerKg;
  await existing.save();

  res.json(existing);
};

exports.getPrices = async (req, res) => {
  try {
    const prices = await ChickenPrices.find().sort({ cutType: 1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const price = await ChickenPrices.findById(req.params.id);
    if (!price) {
      return res.status(404).json({ message: "Price not found" });
    }

    res.json(price.history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
