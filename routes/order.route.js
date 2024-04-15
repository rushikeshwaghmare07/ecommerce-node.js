const express = require("express");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const  { createOrderController } = require("../controllers/order.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createOrderController);

module.exports = router;