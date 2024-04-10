const User = require("../models/user.model.js");
const cloudinary = require("../utils/cloudinary.js");

const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !address || !city || !country || !phone) {
      return res.status(400).json({ success: false, message: "Please provide all fields." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already taken." });
    }

    // Upload profile picture to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      profilePic: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "Registration successful. Please log in." });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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

const getUserProfileByIdController = async (req, res) => {
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
        const updateData = { name, email, address, city, country, phone }

        const user = await User.findByIdAndUpdate(req.user._id, updateData, {
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

const updateUserPassword = async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide both old and new passwords." });
        }

        const user = await User.findById(req.user._id)
        const isMatch = await user.comparePassword(oldPassword)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect old password" });
        }

        user.password = newPassword
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error in update password controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" }); 
    }
};

const updateProfilePicController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "Please provide an image file." });
        }

        // Delete previous image (if exists)
        if (user.profilePic && user.profilePic.public_id) {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }

        // Upload new image
        const uploadResult = await cloudinary.uploader.upload(file.path);

        // Update user's profile picture
        user.profilePic = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        };

        await user.save();

        res.status(200).json({ success: true, message: "Profile picture updated successfully." });
    } catch (error) {
        console.error("Error in update profile picture controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" }); 
    }
};

module.exports = {
    registerController,
    loginController,
    getUserProfileByIdController,
    logoutController,
    updateProfileController,
    updateUserPassword,
    updateProfilePicController,
}