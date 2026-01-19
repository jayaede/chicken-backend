const router = require("express").Router();
const controller = require("./auth.controller");


router.post("/login", controller.login);
router.post("/forgot-password", controller.sendOtp);
router.post("/reset-password", controller.verifyOtpAndReset);

module.exports = router;
