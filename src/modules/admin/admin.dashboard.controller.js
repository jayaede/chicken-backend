const Shop = require("../shop/shop.model");

exports.getAdminDashboard = async (req, res) => {
  try {
    const shops = await Shop.aggregate([
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "shopId",
          as: "stock"
        }
      },
      {
        $lookup: {
          from: "sales",
          localField: "_id",
          foreignField: "shopId",
          as: "sales"
        }
      },
      {
        $addFields: {
          currentStock: {
            $ifNull: [{ $arrayElemAt: ["$stock.remainingKg", 0] }, 0]
          },
          totalStockAdded: {
            $ifNull: [{ $arrayElemAt: ["$stock.quantityKg", 0] }, 0]
          },
          totalSaleAmount: { $sum: "$sales.totalAmount" },
          totalSoldKg: { $sum: "$sales.quantityKg" }
        }
      },
      {
        $addFields: {
          wastage: {
            $max: [
              {
                $subtract: [
                  { $subtract: ["$totalStockAdded", "$totalSoldKg"] },
                  "$currentStock"
                ]
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          phone: 1,
          totalStockAdded: 1,
          totalSoldKg: 1,
          totalSaleAmount: 1,
          currentStock: 1,
          wastage: 1,
        }
      }
    ]);

    res.json(shops);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};