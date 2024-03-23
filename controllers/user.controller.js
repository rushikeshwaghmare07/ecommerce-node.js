const User = require("../models/user.model.js");

const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country,  phone} = req.body
        if (!name || !email || !password || !address || !city || !country || !phone) {
            return res.status(500).send({ success: false, message: "Please Provide All Fields" });
        }
        const user = await User.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone
        });
        res.status(201).send({ success: true, message: "Registration Success, Please login" });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ success: false, message: "Internal Server Error"});
    }
}

module.exports = {
    registerController
}