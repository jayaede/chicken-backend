const Shop = require("../shop/shop.model");
const Stock = require("../stock/stock.model");
const Sale = require("../sales/sale.model");

exports.getAdminDashboard = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    startOfDay.getFullYear(),
    startOfDay.getMonth(),
    1
  );

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);

  const totalShops = await Shop.countDocuments();

  const todaySales = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfDay } } },
    { $group: { 
        _id: null,
        total: { $sum: "$totalAmount" },
        totalKg: { $sum: "$quantityKg" }
      } 
    }
  ]);

  const monthSales = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $group: { 
      _id: null,
      total: { $sum: "$totalAmount" },
      totalKg: { $sum: "$quantityKg" }
    } }
  ]);

  const shopWise = await Sale.aggregate([
      {
        $group: {
          _id: "$shopId",
          totalKg: { $sum: "$quantityKg" },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "_id",
          foreignField: "_id",
          as: "shop",
        },
      },
      { $unwind: "$shop" },
      {
        $project: {
          shopId: "$_id",
          shopName: "$shop.name",
          totalKg: 1,
          totalAmount: 1,
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

  const salesChart = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: weekStart },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        amount: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const stockValue = await Stock.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$quantityKg" }
      }
    }
  ]);

  const totalSoldKg = await Sale.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$quantityKg" },
        totalAmount: { $sum: "$totalAmount" },
      }
    }
  ]);

  res.json({
    totalShops,
    totalSalesToday: todaySales[0] || { total: 0, totalKg: 0 },
    totalSalesMonth: monthSales[0] || { total: 0, totalKg: 0 },
    totalStockValue: stockValue[0]?.total || 0,
    totalSoldKg: totalSoldKg[0] || { total: 0, totalAmount: 0 },
    shopWise,
    salesChart: salesChart.map(s => ({
      date: s._id,
      amount: s.amount
    }))
  });
};
