const express = require("express");
const { getAllProductController, getProductByIdController, createProductController, updateProductController, updateImageController, deleteProductImageController, deleteProductController, productReviewController, getTopProductController } = require("../controllers/product.controller");
const { isAuthenticate, isAdmin } = require("../middlewares/authMiddleware.js");
const { upload } = require("../middlewares/multer.middleware.js");

const router = express.Router();

router.get("/get-all", getAllProductController);
router.get("/top-product", getTopProductController);
router.get("/:id", getProductByIdController);
router.post("/create", isAuthenticate, isAdmin, upload.single("images"), createProductController);
router.put("/:id", isAuthenticate, isAdmin, updateProductController);
router.put("/image/:id", isAuthenticate, isAdmin, upload.single("images"), updateImageController);
router.delete("/delete-image/:id", isAuthenticate, isAdmin, deleteProductImageController);
router.delete("/delete-product/:id", isAuthenticate, isAdmin, deleteProductController);
// review product
router.put("/:id/review", isAuthenticate, productReviewController);

module.exports = router;