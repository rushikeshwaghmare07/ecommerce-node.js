const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        shippingInfo: {
            address: {
                type: String,
                required: [true, "address is required."]
            },
            city: {
                type: String,
                required: [true, "city name is required."]
            },
            country: {
                type: String,
                required: [true, "country name is required."]
            }
        },
        orderItems: [
            {
                name: {
                    type: String,
                    required: [true, "product name is required."]
                },
                price: {
                    type: Number,
                    required: [true, "product price is required."]
                },
                quantity: {
                    type: Number,
                    required: [true, "product quantity is required."]
                },
                image: {
                    type: String,
                    required: [true, "product image is required."]
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    require: true
                }
            }
        ],
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user id is require."]
        },
        paidAt: Date,
        paymentInfo: {
            id: String,
            status: String
        },
        itemPrice: {
            type: Number,
            required: [true, "item price is require"]
        },
        tax: {
            type: Number,
            required: [true, "tax price is require"]
        },
        shippingPrice: {
            type: Number,
            required: [true, "item shipping price is require"]
        },
        totalAmount: {
            type: Number,
            required: [true, "item total amount is require"]
        },
        orderStatus: {
            type: String,
            enum: ["processing", "shipped", "delivered"],
            default: "processing"
        },
        deliveredAt: Date
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;