const express = require("express");
const { getAllProductController, getProductByIdController } = require("../controllers/product.controller");

const router = express.Router();

// GET All Products
router.get("/get-all", getAllProductController);
// GET Product by Id
router.get("/:id", getProductByIdController);

module.exports = router;