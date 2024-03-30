const express = require("express");
const { registerController, loginController, getUserProfileController } = require("../controllers/user.controller.js");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", isAuthenticate, getUserProfileController);

module.exports = router;