const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/get/one/:id", eventController.getOneEvent);
router.get("/get/all", eventController.getAllEvent);
router.post("/search", eventController.searchEvent);
router.get("/search/location", eventController.searchByLocation);
module.exports = router;
