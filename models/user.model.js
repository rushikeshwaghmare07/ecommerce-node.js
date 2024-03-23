const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already taken"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password length should be greater than 6 character"]
    },
    address: {
        type: String,
        required: [true, "address is required"],
    },
    city: {
        type: String,
        required: [true, "city name is required"],
    },
    country: {
        type: String,
        required: [true, "country name is required"],
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
    },
    profilePic: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;