const Product = require("../models/product.model.js");

const getAllProductController = async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json({ success: true, message: "All products fetched successfully.", product });
    } catch (error) {
        console.log("Error in get all product controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getAllProductController,
    getSingleProductController
}