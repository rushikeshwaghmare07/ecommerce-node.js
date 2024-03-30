const express = require("express");
const { registerController, loginController, getUserProfileController } = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", getUserProfileController);

module.exports = router;