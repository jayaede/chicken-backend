const router = require("express").Router();
const auth = require("../../middleware/auth");
const isShop = require("../../middleware/isShop");
const controller = require("./shop.controller");
const dashboardController = require("./shop.dashboard.contoller")

router.use(auth); // ✅ DO NOT CALL auth()
router.use(isShop); // ✅ DO NOT CALL isShop()

router.get("/stock", auth, isShop, controller.getStock);
router.post("/stock/update", auth, isShop, controller.updateStock);
router.get("/dashboard", auth, isShop, dashboardController.getShopDashboard);

module.exports = router;
