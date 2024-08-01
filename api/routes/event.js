const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");


router.post("/create", eventController.createEvent)
router.post("/send/mail", eventController.sendEventMail)
router.post("/publish", eventController.publishEvent)
router.put("/update/:id", eventController.updateEvent)
router.get("/get/one/:id", eventController.getOneEvent)
router.get("/get/all", eventController.getAllEvent)
router.post("/search", eventController.searchEvent)
router.get("/search/location", eventController.searchByLocation)


router.delete("/delete/:id", eventController.deleteEvent)

module.exports = router
