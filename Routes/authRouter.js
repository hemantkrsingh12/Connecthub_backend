const router= require("express").Router();
const authcontroller= require("../Controller/authController");

router.post("/signup",authcontroller.signupcontroller);
router.post("/login",authcontroller.logincontroller);
router.get("/refresh",authcontroller.refreshToken);
router.get("/logout",authcontroller.logout);

module.exports=router;