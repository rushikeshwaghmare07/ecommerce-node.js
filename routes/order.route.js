const express = require("express");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const  { createOrderController, getMyOrderController } = require("../controllers/order.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createOrderController);
router.get("/my-order", isAuthenticate, getMyOrderController);

module.exports = router;