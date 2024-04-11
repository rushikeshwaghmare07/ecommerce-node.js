const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");

const createCategoryController = async (req, res) => {
    try {
        const { category } = req.body;

        if ( !category ) {
            return res.status(404).json({ success: false, message: "Please provide a category name." });
        }

        const newCategory = await Category.create({ category });

        res.status(201).json({ success: true, message: `${newCategory.category} category created successfully.`, category: newCategory });
    } catch (error) {
        console.error("Error in create category controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllCategoryController = async (req, res) => {
    try {
        const categories = await Category.find({});
        const categoryCount = await Category.countDocuments();

        res.status(200).json({ success: true, message: "Categories fetched successfully.", count: categoryCount, categories, });
    } catch (error) {
        console.error("Error in get all category controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Update products with the category ID to remove the category reference
        await Product.updateMany({ category: categoryId }, { $unset: { category: 1 } });
        
        // delete the category
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category Not Found !!" });
        }

        res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        console.error("Error in get all category controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID format." });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createCategoryController,
    getAllCategoryController,
    deleteCategoryController
}