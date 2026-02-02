const router = require("express").Router();
const auth = require("../../middleware/auth");
const isShop = require("../../middleware/isShop");
const controller = require("./sale.controller");

router.get("/", auth, isShop, controller.getMySales);
router.post("/update", auth, isShop, controller.createSale);
router.get("/trend/:shopId", auth,  controller.getShopSalesTrend);
module.exports = router;
