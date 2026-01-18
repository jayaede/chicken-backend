const Stock = require("./stock.model");

exports.addStock = async (req, res) => {
  try {
    const { shopId, quantityKg } = req.body;

    if (!shopId || !quantityKg) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let stock = await Stock.findOne({ shopId });

    if (stock) {
      stock.quantityKg += quantityKg;
      await stock.save();
    } else {
      stock = await Stock.create({
        shopId,
        quantityKg
      });
    }

    res.json({
      message: "Stock added successfully",
      stock
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStock = async (req, res) => {
  res.json(await Stock.find({ shopId: req.user.shopId }));
};
