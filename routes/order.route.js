const express = require("express");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const  { createOrderController, getMyOrderController, singleOrderDetailController } = require("../controllers/order.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createOrderController);
router.get("/my-order", isAuthenticate, getMyOrderController);
router.get("/my-order/:id", isAuthenticate, singleOrderDetailController);

module.exports = router;