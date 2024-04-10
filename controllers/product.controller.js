const Product = require("../models/product.model.js");

const getAllProductController = async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json({ success: true, message: "All products fetched successfully.", product });
    } catch (error) {
        console.error("Error in get all product controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getProductByIdController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });  
        }
        res.status(200).json({ success: true, message: "Product fetched successfully." });
    } catch (error) {
        console.error("Error in get single product controller: ", error);
        if (error instanceof CastError) {
        return res.status(500).json({ success: false, message: "Invalid ID" });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    getAllProductController,
    getProductByIdController
}