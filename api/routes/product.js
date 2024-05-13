const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const productController = require("../controllers/productController");

// router.get("/:companyId/:productId", productController.getProductById);

router.get("/category/:companyId/:categoryId", productController.getProductbyCategory);
router.post("/search", productController.searchProduct);
router.post("/search/suggestions", productController.searchProductsAndcateg);
router.get("/filter", productController.filterProducts);
router.post("/rate", productController.rateProduct);
router.get("/rate/:id", productController.getProductRating);
router.get("/ads/product", productController.getAdsProduct);



module.exports = router;
