const express = require("express");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const { createCategoryController, getAllCategoryController } = require("../controllers/category.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createCategoryController);
router.get("/get-all", getAllCategoryController);

module.exports = router;