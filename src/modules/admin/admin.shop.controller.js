const Shop = require("../shop/shop.model");
const User = require("../auth/user.model");
const bcrypt = require("bcryptjs");

/**
 * Create new shop + manager
 */
exports.createShop = async (req, res) => {
  try {
    const { name, location, phone, username, password } = req.body;

    if (!name || !location || !username || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ username: username });
    if (existing) {
      return res.status(400).json({ message: "Manager already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const shop = await Shop.create({
      name,
      location,
      phone,
    });
    const manager = await User.create({
      username: username,
      password: hashedPassword,
      role: "SHOP",
      shopId: shop._id,
      phone,
      shopName: shop.name
    });

    res.status(201).json({ 
      message: "Shop created", 
      shop,
      shop,
      shopUser: {
        id: manager._id,
        username: manager.username,
        shopId: manager.shopId
      }
     });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all shops
 */
exports.getShops = async (req, res) => {
  const shops = await Shop.aggregate([
    {
      $lookup: {
        from: "stocks",
        localField: "_id",
        foreignField: "shopId",
        as: "stocks",
      },
    },
    {
      $lookup: {
        from: "sales",
        localField: "_id",
        foreignField: "shopId",
        as: "sales",
      },
    },
    {
      $addFields: {
        totalStockAdded: {
          $ifNull: [{ $sum: "$stocks.quantityKg" }, 0],
        },
        totalSold: {
          $ifNull: [{ $sum: "$sales.quantityKg" }, 0],
        },
      },
    },
    {
      $addFields: {
        stockLeft: {
          $subtract: ["$totalStockAdded", "$totalSold"],
        },
      },
    },
    {
      $project: {
        name: 1,
        phone: 1,
        stockLeft: 1,
      },
    },
  ]);

  res.json(shops);
};
