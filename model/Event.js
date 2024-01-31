const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
     name: {
          type: String,
     },
     price: {
          type: String,
     },
     description: {
          type: String,
     },
     email: {
          type: String,
     },
     phoneNumber: {
          type: String,
     },
     noOfTicket: {
          type: String,
     },
     category: {
          type: String,
          enum: [
               "Music",
               "Nightlife",
               "Performing & Visual Arts",
               "Holidays",
               "Health",
               "Hobbies",
               "Business",
               "Food & Drink",
          ],
     },
     date: {
          type: Date,
     },
     country: {
          type: String,
     },
     city: {
          type: String,
     },
     street: {
          type: String,
     },
     images: {
          type: Array,
     },
     adsSubscription: [
          {
               _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
               sessionId: {
                    type: String,
                    default: null,
               },
               subscriptionId: {
                    type: String,
                    default: null,
               },
               status: {
                    type: String,
                    default: null,
               },
               currentPeriodEnd: {
                    type: Date,
                    default: null,
               },
               eventId: {
                    type: String,
               },
          },
     ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
