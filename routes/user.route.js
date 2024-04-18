const express = require("express");
const { registerController, loginController, getUserProfileByIdController, logoutController, updateProfileController, updateUserPassword, updateProfilePicController, passwordResetController } = require("../controllers/user.controller.js");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const { upload } = require("../middlewares/multer.middleware.js");
const rateLimit = require("express-rate-limit");

// rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

const router = express.Router();

router.post("/register", limiter, upload.single("profilePic"), registerController);
router.post("/login", limiter, loginController);
router.get("/profile/:id", isAuthenticate, getUserProfileByIdController);
router.get("/logout", isAuthenticate, logoutController);
router.put("/profile-update", isAuthenticate, updateProfileController);
router.put("/update-password", isAuthenticate, updateUserPassword);
router.put('/update-profile-pic', isAuthenticate, upload.single('profilePic'), updateProfilePicController);
// forgot password
router.post("/reset-password", passwordResetController);

module.exports = router;