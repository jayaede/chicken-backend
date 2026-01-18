const router = require("express").Router();
const auth = require("../../middleware/auth");
const isShop = require("../../middleware/isShop");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("./stock.controller");

router.get("/", auth, isShop, controller.getStock);
router.post("/add", auth, isAdmin, controller.addStock);
router.get("/shop/:shopId", auth, isAdmin, controller.getStock);

module.exports = router;