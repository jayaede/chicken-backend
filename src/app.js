const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chicken-frontend-pi.vercel.app/"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Chicken Shop Backend Running 🚀");
});
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/shop", require("./modules/shop/shop.routes"));
app.use("/api/prices", require("./modules/prices/price.routes"));
app.use("/api/reports", require("./modules/reports/report.routes"));
app.use("/api/admin", require("./modules/admin/admin.routes"));
app.use("/api/stock", require("./modules/stock/stock.routes"));
app.use("/api/sales", require("./modules/sales/sale.routes"));


module.exports = app;
