const router = require("express").Router();
const authCtrl = require("../controllers/auth.controller");

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.post("/logout", authCtrl.logout);

router.post("/forgot", authCtrl.forgotPass);

router.post("/otp", authCtrl.otp);

router.post("/changepassword", authCtrl.changePassword);

// router.post("/refresh_token", authCtrl.generateAccessToken);

module.exports = router;
