require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Shop = require("../models/Shop");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});
    await Shop.deleteMany({});

    const shop = await Shop.create({
      name: "Main Chicken Shop",
      location: "Hyderabad",
      status: "ACTIVE"
    });

    await User.create({
      username: "admin",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN"
    });

    await User.create({
      username: "manager",
      password: await bcrypt.hash("manager123", 10),
      role: "SHOP",
      shopId: shop._id
    });

    console.log("✅ Users seeded with HASHED passwords");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
