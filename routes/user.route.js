const express = require("express");
const { registerController, loginController, getUserProfileController, logoutController, updateProfileController, updateUserPassword, updateProfilePicController } = require("../controllers/user.controller.js");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const { upload } = require("../config/multer.config.js");

const router = express.Router();

router.post("/register", upload.single("profilePic"), registerController);
router.post("/login", loginController);
router.get("/profile", isAuthenticate, getUserProfileController);
router.get("/logout", isAuthenticate, logoutController);
router.put("/profile-update", isAuthenticate, updateProfileController);
router.put("/update-password", isAuthenticate, updateUserPassword);
router.put('/update-profile-pic', isAuthenticate, upload.single('profilePic'), updateProfilePicController);

module.exports = router;