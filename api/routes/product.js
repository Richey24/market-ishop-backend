const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const productController = require("../controllers/productController");

router.get("/:companyId", auth, productController.getProductbyCompanyId);
// router.get("/:companyId/:productId", productController.getProductById);

router.get("/category/:companyId/:categoryId", productController.getProductbyCategory);
router.post("/", auth, multer().any("images"), productController.createProduct);
router.put("/:id", auth, multer().any("images"), productController.updateProduct);
router.post("/multiple", productController.createMultipleProducts);
router.post("/search", productController.searchProduct);
router.post("/search/suggestions", productController.searchProductsAndcateg);
router.get("/:companyId/featured", productController.getFeaturedProducts);
router.get("/details/:id", productController.productDetails);
router.get("/filter", productController.filterProducts);
router.get("/site/:companyId", productController.getProductbyCompanyId);
router.get("/image/:productId", productController.getProductImage);
router.post("/rating/mail", productController.sendRateMail);
router.post("/rate", productController.rateProduct);
router.get("/rate/:id", productController.getProductRating);
router.get("/unrated/:id", productController.getUnratedProducts);
router.delete("/rate/:id", productController.deleteProductRating);

router.get("/ads/product", productController.getAdsProduct);
router.post("/wishlist", productController.createWishlistRecord);
router.get("/wishlist/:partner_id", productController.fetchWishlist);

router.get("/best-selling/:companyId", productController.getBestSellingProducts);

module.exports = router;
