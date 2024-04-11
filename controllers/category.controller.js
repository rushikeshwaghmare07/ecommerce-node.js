const Category = require("../models/category.model.js");

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

module.exports = {
    createCategoryController
}