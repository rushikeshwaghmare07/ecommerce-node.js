const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: [true, "Category is required."]
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Product;