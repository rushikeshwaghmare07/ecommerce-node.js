const express = require("express");
const { isAuthenticate, isAdmin } = require("../middlewares/authMiddleware.js");
const  { createOrderController, getMyOrderController, singleOrderDetailController, paymentController, getAllOrderController, changeOrderStatusController } = require("../controllers/order.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createOrderController);
router.get("/my-order", isAuthenticate, getMyOrderController);
router.get("/my-order/:id", isAuthenticate, singleOrderDetailController);

router.post("/payments", isAuthenticate, paymentController);

// admin part
router.get("/admin/get-all-orders", isAuthenticate, isAdmin, getAllOrderController);

// change order status
router.put("/admin/order/:id", isAuthenticate, isAdmin, changeOrderStatusController);

module.exports = router;