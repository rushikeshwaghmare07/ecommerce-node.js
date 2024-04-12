const express = require("express");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const { createCategoryController, getAllCategoryController, deleteCategoryController, updateCategoryController } = require("../controllers/category.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createCategoryController);
router.get("/get-all", getAllCategoryController);
router.delete("/delete/:id", isAuthenticate, deleteCategoryController);
router.put("/update/:id", isAuthenticate, updateCategoryController);

module.exports = router;