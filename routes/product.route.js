const express = require("express");
const { getAllProductController, getSingleProductController } = require("../controllers/product.controller");

const router = express.Router();

// GET All Products
router.get("/get-all", getAllProductController);

module.exports = router;