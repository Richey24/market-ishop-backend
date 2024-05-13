const express = require("express");
const router = express.Router();

const promotionController = require("../controllers/promotionController");

router.get("/:company_id", promotionController.getPromotions);

router.get("/conditions", promotionController.getCondtions);

router.get("/banners", promotionController.getPromotionBanner);

module.exports = router;
