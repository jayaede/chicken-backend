const mongoose = require("mongoose");
const Sale = require("../sales/sale.model");
const Stock = require("../stock/stock.model");

exports.getShopDashboard = async (req, res) => {
  const shopId = req.user.shopId;
  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  if (!shopId) {
    return res.status(400).json({ message: "Shop ID missing" });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaySales = await Sale.aggregate([
    { $match: { shopId: shopObjectId, createdAt: { $gte: startOfDay } } },
    { $group: { 
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
        totalQty: { $sum: "$quantityKg" } 
      } 
    }
  ]);

  const last7Days = await Sale.aggregate([
    {
      $match: {
        shopId: shopObjectId,
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        totalAmount: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const stock = await Stock.findOne({ shopId: shopId });
 
  res.json({
    todaySales: todaySales[0]?.totalAmount || 0,
    currentStockKg: stock?.quantityKg || 0,
    salesChart: last7Days.map(item => ({
      date: item._id,
      amount: item.totalAmount
    }))
  });
};
