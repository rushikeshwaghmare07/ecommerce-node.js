const express = require("express");
const { getAllProductController, getProductByIdController, createProductController, updateProductController, updateImageController, deleteProductImageController } = require("../controllers/product.controller");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const { upload } = require("../middlewares/multer.middleware.js");

const router = express.Router();

router.get("/get-all", getAllProductController);
router.get("/:id", getProductByIdController);
router.post("/create", isAuthenticate, upload.single("images"), createProductController);
router.put("/:id", isAuthenticate, updateProductController);
router.put("/image/:id", isAuthenticate, upload.single("images"), updateImageController);
router.delete("/delete-image/:id", isAuthenticate, deleteProductImageController);

module.exports = router;