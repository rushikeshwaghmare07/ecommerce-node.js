const User = require("../models/user.model.js");

const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country,  phone} = req.body
        if (!name || !email || !password || !address || !city || !country || !phone) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already taken !!"});
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone
        });

        return res.status(201).json({ success: true, message: "Registration successful. Please log in." });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }
        // check user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found." });
        }
        // check password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credential" });
        }

        // token
        const token = user.generateToken();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false
        })
        .status(200).json({ success: true, message: "Login successful.", token});
    } catch (error) {
        console.error("Error in loginController: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error."});
    }
};

const getUserProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User profile fetched successfully.", user });
    } catch (error) {
        console.error("Error in profile controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const logoutController = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({ success: true, message: "Logout successfully."});
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const { name, email, address, city, country, phone } = req.body;
        const updateDate = { name, email, address, city, country, phone }

        const user = await User.findByIdAndUpdate(req.user._id, updateDate, {
            new: true,
            runValidators: true
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found."});
        }

        res.status(200).json({ success: true, message: "User profile updated.", user });
    } catch (error) {
        console.error("Error in update profile controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


module.exports = {
    registerController,
    loginController,
    getUserProfileController,
    logoutController,
    updateProfileController,
}