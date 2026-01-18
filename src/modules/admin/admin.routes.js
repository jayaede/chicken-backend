const router = require("express").Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("./admin.shop.controller");
const dashboardController = require("./admin.dashboard.controller")
router.use(auth);
router.use(isAdmin);

router.post("/shops", controller.createShop);
router.get("/shops", controller.getShops);
router.get("/dashboard", auth, isAdmin, dashboardController.getAdminDashboard);

module.exports = router;
