const express = require("express");
const router = express.Router();
const advertController = require("../controllers/adsController");

router.get("/", advertController.findAll);
router.get("/length", advertController.getAdsLenght);
router.get("/advert-service", advertController.findAllAdsService);
router.get("/company-adverts", advertController.findAdsByCompany);
router.get("/ad-id", advertController.findAdById);

module.exports = router;
