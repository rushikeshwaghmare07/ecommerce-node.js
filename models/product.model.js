const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required."]
    },
    description: {
        type: String,
        required: [true, "Product description is required."]
    },
    price: {
        type: Number,
        required: [true, "Product price is required."]
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required."]
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required."]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ]
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;