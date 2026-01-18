const router = require("express").Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("./report.controller");

router.use(auth);
router.use(isAdmin);

router.get("/", controller.getReport); // ✅ MUST be a function

module.exports = router;
