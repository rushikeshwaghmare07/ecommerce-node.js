const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Failed!! ${error}`);
    }
};

module.exports = connectDB;