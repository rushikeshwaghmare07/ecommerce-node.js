const express = require("express");
const { isAuthenticate } = require("../middlewares/authMiddleware.js");
const { createCategoryController } = require("../controllers/category.controller.js");
const router = express.Router();

router.post("/create", isAuthenticate, createCategoryController);

module.exports = router;