const Stock = require("../stock/stock.model");
const Shop = require("../../models/Shop");

exports.getLowStock = async (req, res) => {
  const stocks = await Stock.find({ remainingKg: { $lt: 20 } })
    .populate("shopId", "name");

  res.json(
    stocks.map(s => ({
      _id: s._id,
      shopName: s.shopId.name,
      remainingKg: s.remainingKg
    }))
  );
};
