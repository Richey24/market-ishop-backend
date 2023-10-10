const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const orderController = require("../controllers/orderController");

router.get("/company/companyId", orderController.getOrdersByCompanyId);
router.get("/customer/:customerId", orderController.getOrdersByPartner);
router.get("/customer/history/:customerId", orderController.getOrderHistoryByPartner);
router.post("/create", orderController.createOrder);
router.post("/product", orderController.addProductToOrder);
router.delete("/product/:id", orderController.removeProductFromOrderLine);
router.put("/product/qty/:id", orderController.updateProductToOrderLine);
router.put("/status", orderController.changeOrderStatus);

module.exports = router;
