const JWT = require("jsonwebtoken");
const User = require("../models/user.model");

// user auth
const isAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized User"});
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// admin auth
const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ success: false, message: "Admin only" });
    };

    next();
};

module.exports = {
    isAuthenticate,
    isAdmin
}