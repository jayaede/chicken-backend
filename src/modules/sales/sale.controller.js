const mongoose = require("mongoose");
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
  const sales = await Sale.find({ shopId: req.user.shopId })
    .sort({ createdAt: -1 });

  res.json(sales);
};

exports.getShopSalesTrend = async (req, res) => {
  const { shopId } = req.params;

  const trend = await Sale.aggregate([
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        totalKg: { $sum: "$quantityKg" },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $limit: 7,
    },
  ]);

  res.json(
    trend.map((d) => ({
      date: d._id,
      quantity: d.totalKg,
    }))
  );
};