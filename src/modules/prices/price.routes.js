const router = require("express").Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("./price.controller");


router.get("/", auth, controller.getPrices);

router.post("/", auth, isAdmin,controller.addPrice);
router.post("/:id", auth, isAdmin, controller.updatePrice);
router.get("/:id/history", auth, isAdmin, controller.getHistory);

module.exports = router;
