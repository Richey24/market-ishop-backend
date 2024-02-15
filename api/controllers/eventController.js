const { default: algoliasearch } = require("algoliasearch");
const Event = require("../../model/Event");
const jwt = require("jsonwebtoken");
const { sendCreateEventMail } = require("../../config/helpers");

exports.createEvent = async (req, res) => {
     try {
          const body = req.body;
          if (!body.name || !body.email) {
               return res.status(400).json({ message: "Send all required parameter" });
          }
          const event = await Event.create(body);
          const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
          const index = client.initIndex("ishop-event");
          index.search(body.name).then(async ({ hits }) => {
               if (hits.length < 1) {
                    await index.saveObject(
                         {
                              name: body.name,
                              description: body.description,
                         },
                         {
                              autoGenerateObjectIDIfNotExist: true,
                         },
                    );
               }
          });
          res.status(200).json(event);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.updateEvent = async (req, res) => {
     try {
          const id = req.params.id;
          const body = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          const event = await Event.findByIdAndUpdate(id, body, { new: true });
          res.status(200).json(event);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getOneEvent = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          const event = await Event.findById(id);
          res.status(200).json(event);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.searchByLocation = async (req, res) => {
     const region = req.query.region;
     try {
          let events = await Event.find({
               $or: [{ country: region }, { city: region }, { state: region }],
               published: true,
          });
          return res.status(200).json(events);
     } catch (err) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getAllEvent = async (req, res) => {
     try {
          const events = await Event.find({ published: true });
          res.status(200).json(events);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.searchEvent = async (req, res) => {
     try {
          const body = req.body;
          const keys = Object.keys(body);
          const obj = {};
          let andConditions = []; // Array to hold all $and conditions

          // keys.forEach((key) => {

          Object.keys(body).forEach((key) => {
               if (key === "price") {
                    if (body.price === "free") {
                         obj[key] = { $eq: 0 };
                    } else {
                         obj[key] = { $gt: 0 };
                    }
               } else if (key === "location") {
                    // Location condition
                    andConditions.push({
                         $or: [
                              { country: body.location },
                              { city: body.location },
                              { state: body.location },
                         ],
                    });
               }
          });

          // Handle "name or tag" outside the loop to ensure it's correctly applied
          let nameOrTagConditions = [];
          if (body.name) {
               // Construct regex for name search
               const nameRegex = new RegExp("^[" + body.name + "]", "i");
               nameOrTagConditions.push({ name: nameRegex });
          }
          if (Array.isArray(body.tags)) {
               // Condition for tags
               nameOrTagConditions.push({ tags: { $in: body.tags } });
          }

          // Only add the "name or tag" condition if it's needed
          if (nameOrTagConditions.length > 0) {
               andConditions.push({ $or: nameOrTagConditions });
          }

          // Apply boolean and regex conditions directly to obj, assuming they don't conflict with existing keys
          Object.keys(body).forEach((key) => {
               if (
                    typeof body[key] === "boolean" ||
                    (key !== "price" && key !== "location" && key !== "tags" && key !== "name")
               ) {
                    // Apply boolean values directly
                    if (typeof body[key] === "boolean") {
                         obj[key] = body[key];
                    } else {
                         // Apply regex for unspecified string fields, excluding special cases already handled
                         obj[key] = { $regex: body[key], $options: "i" };
                    }
               }
          });

          // Finally, add all $and conditions to the query if any exist
          if (andConditions.length > 0) {
               obj["$and"] = andConditions;
          }

          // The published filter is independent of the loop
          if (body.hasOwnProperty("published")) {
               // This checks explicitly for the presence of 'published'
               obj["published"] = true;
          }

          console.log({ obj: obj["$and"], body, keys });
          //$or: [{ country: region }, { city: region }, { state: region }]
          const events = await Event.find(obj);
          res.status(200).json(events);
     } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.deleteEvent = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          await Event.findByIdAndDelete(id);
          res.status(200).json({ message: "deleted successfully" });
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.sendEventMail = async (req, res) => {
     try {
          const { id, email } = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          const token = jwt.sign(
               {
                    id: id,
               },
               "event_secret",
          );
          sendCreateEventMail(email, token);
          res.status(200).json({ message: "message sent successfully" });
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.publishEvent = async (req, res) => {
     try {
          const { token } = req.body;
          if (!token) {
               return res.status(400).json({ message: "Send token" });
          }
          const decoded = jwt.verify(token, "event_secret");
          if (decoded.id) {
               const event = await Event.findByIdAndUpdate(
                    decoded.id,
                    {
                         published: true,
                    },
                    { new: true },
               );
               res.status(200).json(event);
          } else {
               res.status(400).json({ message: "No ID" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};
