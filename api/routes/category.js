const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.findAll);
router.get("/get/featured", categoryController.fetchFeatureCategories);

module.exports = router;
