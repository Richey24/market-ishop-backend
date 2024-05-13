const express = require("express");
const { getCompany } = require("../controllers/companyController");
const router = express.Router();

router.get("/get/:id", getCompany);

module.exports = router;
