const router = require("express").Router();
const auth = require("../../middleware/auth");
const isShop = require("../../middleware/isShop");
const controller = require("./sale.controller");

router.use(auth);
router.use(isShop);

router.get("/", auth, isShop, controller.getMySales);
router.post("/update", auth, isShop, controller.createSale);

module.exports = router;
