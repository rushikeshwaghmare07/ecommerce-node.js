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

module.exports = {
    createOrderController,
    getMyOrderController
}