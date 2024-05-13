const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_ROLE } = require("../schemas/user.schema");

const currentDate = new Date();

const userSchema = mongoose.Schema({
     firstname: {
          type: String,
          required: [true, "Please Include your first name"],
     },
     tour: {
          type: String,
     },
     lastname: {
          type: String,
          required: [true, "Please include your last Name"],
     },

     email: {
          type: String,
          required: [true, "Please Include your email"],
     },
     currentSiteType: {
          type: String,
     },

     chatID: {
          type: String,
     },

     image: {
          type: String,
     },

     status: {
          type: String,
          enum: ["active", "suspended", "banned"],
          default: "active",
     },
     suspensionEndDate: {
          type: Date,
          default: null,
     },
     role: {
          type: String,
          default: USER_ROLE.USER,
          enum: [
               USER_ROLE.USER,
               USER_ROLE.ADMIN,
               USER_ROLE.VENDOR,
               USER_ROLE.CUSTOMER,
               USER_ROLE.DEVELOPER,
               USER_ROLE.FREELANCER,
          ],
          required: [true, "Please include user role"],
     },
     githubUsername: {
          type: String,
     },
     portfolioUrl: {
          type: String,
     },
     password: {
          type: String,
          required: [true, "Please Include your password"],
     },
     onboarded: {
          type: Boolean,
          default: false,
     },
     phone: {
          type: Number,
     },
     partner_id: {
          type: Number,
     },
     paid: {
          type: Boolean,
          default: false,
     },
     subCanceled: {
          type: Boolean,
          default: false,
     },
     expiryDate: {
          type: Date,
     },
     stripeID: {
          type: String,
     },
     subscriptionID: {
          type: String,
     },
     subscriptionPlan: {
          type: String,
     },
     rated: {
          type: Array,
          default: [],
     },
     subscription: {
          sessionId: { type: String, default: null },
          planId: { type: String, default: null },
          planType: { type: String, default: null },
          planStartDate: { type: String, default: null },
          planEndDate: { type: String, default: null },
          planDuration: { type: Number, default: null },
     },
     order_products: {
          type: Array,
          default: [],
     },
     order_reported: {
          type: Array,
          default: [],
     },
     suspensionCount: {
          type: Number,
          default: 0,
     },
     banReason: {
          type: [String],
          default: [],
     },
     suspensionReasons: {
          type: [String],
          default: [],
     },
     stripeConnectedAccountId: {
          type: String,
     },
     isStripeConnectedAccountVerified: {
          type: Boolean,
          default: false,
     },
     partner_ids: [
          {
               id: { type: Number },
               domain: { type: String },
          },
     ],
     sales_opt_in: {
          type: Boolean,
     },
     salesEmailReport: {
          status: { type: Boolean, default: false },
          frequency: { type: String, enum: ["Per sales", "Once daily"] },
          time: { type: String },
     },
     created_at: {
          type: Date,
          default: Date.now,
     },
     company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
     },
     position: {
          type: String,
          required: [false, "Position is not required"],
     },
     batch: {
          type: Number,
          default: 1,
     },
     address: {
          type: String,
     },
     timeZone: {
          type: String,
     },
     languages: [
          {
               type: String,
          },
     ],
     skills: [
          {
               type: String,
          },
     ],
     about: {
          type: String,
     },
     serviceWishlist: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Service",
          },
     ],
     tokens: [
          {
               token: {
                    type: String,
                    required: true,
               },
          },
     ],
     navigation: {
          type: Array,
     },
});

userSchema.pre("save", async function () {
     const user = this;
     if (user.isModified("password")) {
          user.password = await bcrypt.hash(user.password, 8);
     }

     var token = jwt.sign(
          { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email },
          "secret",
     );

     user.tokens = user.tokens.concat({ token });
     return token;
});

//this function generates an auth token for the user
userSchema.methods.generateAuthToken = async function (domain) {
     const user = this;
     let options = {};

     // Set token to expire in 1 hour in production mode
     if (process.env.NODE_ENV !== "development") {
          options.expiresIn = "1h";
     } else {
          options.expiresIn = "5d";
     }

     const token = jwt.sign(
          {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               onboarded: user.onboarded,
               partner_id: user?.partner_ids?.find((partner) => partner?.domain === domain)?.id,
          },
          "secret",
          options,
     );
     user.tokens = user.tokens.concat({ token });
     await user.save();

     return token;
};

//this method search for a user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
     const user = await User.findOne({ email });

     if (!user) {
          return false;
     }

     const isPasswordMatch = await bcrypt.compare(password, user.password);

     if (!isPasswordMatch) {
          return false;
     }
     return user;
};

userSchema.statics.getUsers = async () => {
     const users = await User.find({}).populate("role");
     if (!users) {
          return false;
     }
     return users;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
