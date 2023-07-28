const express = require("express");
const router = express.Router();
const siteController = require("../controllers/siteController");

router.get("/:domain", siteController.getSiteByDomain);

module.exports = router;