const Sale = require("./sale.model");
const Stock = require("../stock/stock.model");

exports.createSale = async (req, res) => {
  const { shopId, customerName, cutType, quantityKg, pricePerKg, totalAmount } = req.body;

  const sale = await Sale.create({
    shopId,
    customerName,
    cutType,
    quantityKg,
    pricePerKg,
    totalAmount
  });

  const stock = await Stock.findOne({ shopId });
  if (!stock || stock.quantityKg < quantityKg) {
    return res.status(400).json({ message: "Insufficient stock" });
  }
  stock.quantityKg -= quantityKg;
  await stock.save();
  res.json({
    message: "Sale completed",
    remainingStock: stock.quantityKg
  });
};

exports.getMySales = async (req, res) => {
  const sales = await Sale.find({ shop: req.user.shop })
    .sort({ createdAt: -1 });

  res.json(sales);
};
