const express = require("express");
const { registerController, loginController, getUserProfileController, logoutController } = require("../controllers/user.controller.js");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", isAuthenticate, getUserProfileController);
router.get("/logout", isAuthenticate, logoutController);

module.exports = router;