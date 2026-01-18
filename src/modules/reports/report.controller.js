const Sale = require("../sales/sale.model");

/**
 * Get sales report (admin)
 */
exports.getReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = {};
    if (from && to) {
      filter.saleDate = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }

    const sales = await Sale.find(filter).populate("shopId", "name location");

    const totalRevenue = sales.reduce(
      (sum, s) => sum + s.totalAmount,
      0
    );

    res.json({
      count: sales.length,
      totalRevenue,
      sales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
