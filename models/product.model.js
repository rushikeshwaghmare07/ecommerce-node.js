const mongoose = require("mongoose");

// review model
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is require"],
      },
      rating: {
        type: Number,
        default: 0,
      },
      comment: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user require"],
      },
},{ timestamps: true });

// product model
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
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
      },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;