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
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const monthSales = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const salesChart = await Sale.aggregate([
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
        total: { $sum: "$quantityKg" }
      }
    }
  ]);

  res.json({
    totalShops,
    totalSalesToday: todaySales[0]?.total || 0,
    totalSalesMonth: monthSales[0]?.total || 0,
    totalStockValue: stockValue[0]?.total || 0,
    totalSoldKg: totalSoldKg[0]?.total || 0,
    salesChart: salesChart.map(s => ({
      date: s._id,
      amount: s.amount
    }))
  });
};
