const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin.endsWith(".vercel.app") ||
        origin === "http://localhost:5173"
      ) {
        return callback(null, true);
      }

      callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://chicken-frontend-pi.vercel.app");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }
//   next();
// });

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
