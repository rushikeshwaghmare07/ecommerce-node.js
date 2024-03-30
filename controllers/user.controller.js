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
        res.status(200).json({ success: true, message: "Login successful.", token});
    } catch (error) {
        console.log("Error in loginController: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

module.exports = {
    registerController,
    loginController
}