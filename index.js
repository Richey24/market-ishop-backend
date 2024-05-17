const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 4005;
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const webpush = require("web-push");
const Odoo = require("./config/odoo.connection");

//configure database and mongoose
mongoose
     .connect(process.env.MONGO_URL, { useNewUrlParser: true })
     .then(() => {
          console.log("Database is connected");
     })
     .catch((err) => {
          console.log({ database_error: err });
     });
// db configuaration ends here

const vapidKeys = {
     privateKey: "DJW3lZPIc64kptJOrrwFIvoEPDoRlOUBi5zYBq2nexo",
     publicKey:
          "BNW__qlZf6FZ3zCZL8H_JzDe051M2dCs-yaXWT9lc1CreFNlQYJ0oLNihj0AgraCKrOLAltz8MX7E3jLt9xUnD4",
};
webpush.setVapidDetails("https://chat.ishop.black/", vapidKeys.publicKey, vapidKeys.privateKey);

//registering cors
app.use(cors());
app.use(
     express.json({
          limit: "5mb",
          verify: (req, res, buf) => {
               req.rawBody = buf.toString();
          },
     }),
);
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); // configire morgan

// define first route
app.get("/", (req, res) => {
     console.log("Hello MEVN Soldier");
     res.status(201).json({ message: "working" });
});

app.get("/odoo/test", async (req, res) => {
     try {
          await Odoo.connect();
          res.status(200).json({ error: "Odoo is working", status: true });
     } catch (error) {
          res.status(500).json({ error: "Odoo is down", status: false });
     }
});

const { errorResponder } = require("./utils/http_responder");
const userRouter = require("./api/routes/user");
const categoryRouter = require("./api/routes/category");
const productRouter = require("./api/routes/product");
const promotionRouter = require("./api/routes/promotion");
const advertRouter = require("./api/routes/advert");
const serviceRoute = require("./api/routes/service");
const companyRoute = require("./api/routes/company");
const eventRouter = require("./api/routes/event");

app.use("/api/user", userRouter);
app.use("/api/company", companyRoute);
app.use("/api/event", eventRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/showcase", advertRouter);
app.use("/api/service", serviceRoute);

// Catch-all error handling middleware
app.use((error, _request, response, _next) => {
     console.error("Error caught:", error);

     const statusCode = error?.code || 500;
     const message = error?.message || "SERVER ERROR";

     // Respond with an error message and status code.
     return errorResponder(response, statusCode, message);
});

app.listen(PORT, () => {
     console.log(`App is running on ${PORT}`);
});
