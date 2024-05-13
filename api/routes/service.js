const express = require("express");
const serviceController = require("../controllers/serviceController");
const serviceOrder = require("../controllers/serviceOrderController");

const router = express.Router();
const multer = require("multer");
const {
     addFirstCat,
     addSecondCat,
     addThirdCat,
     getCat,
     getMainCategory,
     getFirstSubCategory,
     getSecondSubCategory,
} = require("../controllers/serviceCatController");
const auth = require("../../config/auth");
const upload = multer({ dest: "./upload" });

router.put("/availability/:serviceId", auth, serviceController.toggleServiceAvailability);
router.get("/get/all", serviceController.getAllService);
router.get("/get/one/:id", serviceController.getOneService);
router.get("/get/user", auth, serviceController.getServiceByUserId);
router.get("/get/user/:id", serviceController.getServiceByUserIdParams);
router.get("/category/:categoryName", serviceController.getServicesByCategoryName);

router.post("/search", serviceController.searchService);
router.post("/rate", serviceController.rateService);
router.post("/cat/first/add", addFirstCat);
router.post("/cat/second/add", addSecondCat);
router.post("/cat/third/add", addThirdCat);
router.get("/cat/get", getCat);
router.get("/cat/get/main", getMainCategory);
router.post("/cat/get/first", getFirstSubCategory);
router.post("/cat/get/second", getSecondSubCategory);
router.post("/reviews", serviceController.addReview);
router.put("/reviews", serviceController.updateReview);
router.delete("/reviews", serviceController.deleteReview);
router.get("/reviews/:serviceId", serviceController.getServiceReviews);
router.get("/reviews/freelancer/:userId", serviceController.getReviewsByServiceUserId);

router.put("/order/start/:orderId", serviceOrder.start);
router.put("/order/hold/:orderId", serviceOrder.hold);
router.put("/order/continue/:orderId", serviceOrder.continue);
router.put("/order/deliver/:orderId", serviceOrder.deliver);
router.put("/order/admin/mark-as-paid/:orderId", serviceOrder.markAsPaid);
router.put("/order/confirm-payment/:orderId", serviceOrder.confirmPayment);

router.post("/orders/create", serviceOrder.create);
router.get("/orders/get/one/:orderId", serviceOrder.getOneServiceOrder);
router.get("/orders/:customerId", serviceOrder.getCustomerOrders);
router.get("/orders", serviceOrder.getAllOrders);
router.get("/orders/get/vendor", auth, serviceOrder.getOrderedServicesByVendors);
router.get("/orders/services/:customerId", serviceOrder.getOrderedServices);

router.post("/wishlist/add", serviceOrder.addToWishlist);
router.get("/wishlist/:userId", serviceOrder.getWishlist);

module.exports = router;
