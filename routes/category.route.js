const express = require("express");
const { isAuthenticate, isAdmin } = require("../middlewares/authMiddleware.js");
const { createCategoryController, getAllCategoryController, deleteCategoryController, updateCategoryController } = require("../controllers/category.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, isAdmin, createCategoryController);
router.get("/get-all", getAllCategoryController);
router.delete("/delete/:id", isAuthenticate, isAdmin, deleteCategoryController);
router.put("/update/:id", isAuthenticate, isAdmin, updateCategoryController);

module.exports = router;