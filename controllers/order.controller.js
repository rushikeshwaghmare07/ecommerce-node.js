const { stripe } = require("../index.js");
const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");

const createOrderController = async (req, res) => {
    try {
        const { shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingPrice, totalAmount } = req.body;
        if (!shippingInfo || !orderItems || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingPrice || !totalAmount) {
            return res.status(404).json({ success: false, message: "Please provide all the fields." });
        }

        await Order.create({
            user: req.user._id,
            shippingInfo, 
            orderItems, 
            paymentMethod, 
            paymentInfo, 
            itemPrice, 
            tax, 
            shippingPrice, 
            totalAmount
        })

        // stock update
        for (let i = 0; i < orderItems.length; i++) {
            const product = await Product.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity
            await product.save();
        }

        res.status(201).json({ success: true, message: "Order placed successfully." });
    } catch (error) {
        console.error("Error in create order controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const getMyOrderController = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        if (!orders) {
            return res.status(404).json({ success: false, message: "No order found." });
        }

        res.status(200).json({ success: true, message: "Your order date.", totalOrders: orders.length, orders });
    } catch (error) {
        console.error("Error in my order controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const singleOrderDetailController = async (req, res) => {
    try {
        const orders = await Order.findById(req.params.id);
        if (!orders) {
            return res.status(404).json({ success: false, message: "No order found." });
        }

        res.status(200).json({ success: true, message: "Your order fetch.", orders });
    } catch (error) {
        console.error("Error in single order controller: ", error);
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "invalid order ID format" });
        }
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const paymentController = async (req, res) => {
    try {
        const { totalAmount } = req.body;
        if (!totalAmount) {
            return res.status(400).json({ success: false, message: "Total amount is required." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(totalAmount * 100),
            currency: "inr"
        });

        res.status(200).json({ success: true, client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error in payment controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// admin section
const getAllOrderController = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).send({ success: true, message: "All Orders Data", totalOrders: orders.length, orders });
    } catch (error) {
        console.error("Error in get all order controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

module.exports = {
    createOrderController,
    getMyOrderController,
    singleOrderDetailController,
    paymentController,
    getAllOrderController
}