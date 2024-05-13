const User = require("../../model/User");
const Company = require("../../model/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendForgotPasswordEmail } = require("../../config/helpers");
const Odoo = require("../../config/odoo.connection");
const axios = require("axios");
const { USER_ROLE } = require("../../schemas/user.schema");

exports.register = async (req, res) => {
     try {
          console.log("POST registering user");
          await Odoo.connect();

          const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          console.log("IP Address:", ipAddress);

          // Fetch timezone information using the IP address
          const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
          const timezone = response.data.timezone;

          console.log("Timezone:", timezone);
          // TODO: add tenant id to verify
          let user = await User.findOne({ email: req.body.email });
          // console.log("user", user);
          if (req.body.role === "VENDOR" && user) {
               return res.status(409).json({
                    message: "email already in use",
                    status: false,
               });
          }

          const domainExists = await User.findOne({
               "partner_ids.domain": req.body.domain,
               email: req.body.email,
          });

          if (domainExists) {
               return res.status(409).json({
                    message: "Account Already Exist for this Site",
                    status: false,
               });
          }

          let company;
          if (req.body.domain) {
               company = await Company.findOne({ subdomain: req.body.domain });
          }

          let partner_id;
          if (!req.body.role || req.body.role === "USER") {
               partner_id = await Odoo.execute_kw("res.partner", "create", [
                    {
                         name: `${req.body.firstname ?? user?.firstname} ${
                              req.body.lastname ?? user?.lastname
                         }`,
                         email: req.body.email ?? user?.email,
                         phone: req.body.phone ?? user?.phone,
                         company_id: company.company_id,
                         is_published: true,
                    },
               ]);
               console.log("Partner created successfully. Partner ID:", partner_id);
          }

          let data;
          let token;
          if (!user) {
               const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    role: req.body.role,
                    chatID: req.body.chatID ?? "",
                    tour: req.body?.tour ?? "",
                    password: req.body.password,
                    phone: req.body.phone,
                    timeZone: timezone,
                    sales_opt_in: req.body.sales_opt_in,
                    partner_ids: [{ id: partner_id, domain: req.body.domain }],
                    currentSiteType: req.body.currentSiteType,
                    ...(company && { company: company._id }),
               });
               data = await newUser.save();
               token = await newUser.generateAuthToken(req.body.domain);
          } else {
               user = await User.findByIdAndUpdate(user?._id, {
                    $set: {
                         partner_ids: [
                              ...user?.partner_ids,
                              { id: partner_id, domain: req.body.domain },
                         ],
                    },
               });
               token = await user.generateAuthToken(req.body.domain);
          }

          // Omit password from the user object before sending the response
          let userWithoutPassword;
          if (!user)
               userWithoutPassword = {
                    _id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role,
                    chatID: data.chatID,
                    company: data.company,
                    stripeConnectedAccountId: data?.stripeConnectedAccountId,
               };

          sendWelcomeEmail(
               req.body?.email ?? user?.firstname,
               req.body?.firstname ?? user?.lastname,
               req?.body.currentSiteType ?? user?.currentSiteType,
          );

          res.status(201).json({ user: userWithoutPassword ?? user, token, status: true });
     } catch (error) {
          console.log("errpr", error);
          res.status(400).json({ error, status: false });
     }
};

exports.confirmEmail = async (req, res) => {
     try {
          console.log("POST registering user");
          await Odoo.connect();
          // TODO: add tenant id to verify
          let user = await User.findOne({ email: req.body.email });
          const domainExists = await User.findOne({
               "partner_ids.domain": req.body.domain,
               email: req.body.email,
          });
          // console.log("domainExists", domainExists, req.body);
          if (domainExists) {
               return res.status(409).json({
                    message: "Account Already Exist for this Site",
                    status: false,
               });
          }

          if (user && !domainExists) {
               return res.status(201).json({
                    exists: true,
                    status: true,
               });
          } else {
               return res.status(201).json({
                    exists: false,
                    status: true,
               });
          }
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
};

exports.loginUser = async (req, res) => {
     console.log({
          body: req.body,
     });
     try {
          console.log("logging user in");
          const email = req.body.email;
          const password = req.body.password;
          const domain = req.body.domain;
          const user = await User.findByCredentials(email, password);

          if (!user) {
               return res
                    .status(401)
                    .json({ error: "Login failed! Check authenthication credentails" });
          }

          const userWithoutPassword = {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               role: user.role,
               chatID: user.chatID,
               onboarded: user.onboarded,
               partner_id: user?.partner_ids?.find((partner) => partner?.domain === domain)?.id,
               subscribed: user.subscribed,
               status: user.status,
          };
          const token = await user.generateAuthToken(domain);
          res.status(201).json({ user: userWithoutPassword, token });
     } catch (error) {
          res.status(400).json(error);
     }
};

exports.socialRegister = async (req, res) => {
     console.log("register");
     try {
          await Odoo.connect();
          let user = await User.findOne({ email: req.body.email });
          if (req.body.role && user) {
               console.log("switching to login");
               return socialLogin(req, res);
          }
          const domainExists = await User.findOne({
               "partner_ids.domain": req.body.domain,
               email: req.body.email,
          });

          if (domainExists) {
               return res.status(409).json({
                    message: "Account Already Exist for this Site",
                    status: false,
               });
          }

          let company;
          if (req.body.domain) {
               company = await Company.findOne({ subdomain: req.body.domain });
          }

          let partner_id;
          if (!req.body.role) {
               partner_id = await Odoo.execute_kw("res.partner", "create", [
                    {
                         name: `${req.body.firstname ?? user?.firstname} ${
                              req.body.lastname ?? user?.lastname
                         }`,
                         email: req.body.email ?? user?.email,
                         phone: req.body.phone ?? user?.phone,
                         company_id: company.company_id,
                         is_published: true,
                    },
               ]);
               console.log("Partner created successfully. Partner ID:", partner_id);
          }
          let data;
          let token;

          if (!user) {
               const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    role: req.body.role,
                    chatID: req.body.chatID ?? "",
                    tour: req.body?.tour ?? "",
                    password: req.body.password,
                    phone: req.body.phone,
                    partner_ids: [{ id: partner_id, domain: req.body.domain }],
                    currentSiteType: req.body.currentSiteType,
                    ...(company && { company: company._id }),
               });
               data = await newUser.save();
               token = await newUser.generateAuthToken(req.body.domain);
          } else {
               user = await User.findByIdAndUpdate(user?._id, {
                    $set: {
                         partner_ids: [
                              ...user?.partner_ids,
                              { id: partner_id, domain: req.body.domain },
                         ],
                    },
               });
               token = await user.generateAuthToken(req.body.domain);
          }
          let userWithoutPassword;
          if (!user)
               userWithoutPassword = {
                    _id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role,
                    chatID: data.chatID,
                    company: data.company,
               };
          sendWelcomeEmail(
               req.body?.email ?? user?.firstname,
               req.body?.firstname ?? user?.lastname,
               req?.body.currentSiteType ?? user?.currentSiteType,
          );

          res.status(201).json({
               user: userWithoutPassword ?? user,
               token,
               status: true,
          });
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
};

exports.logoutUser = async (req, res) => {
     console.log("logoutuser");
     try {
          let randomNumberToAppend = toString(Math.floor(Math.random() * 1000 + 1));
          let randomIndex = Math.floor(Math.random() * 10 + 1);
          let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);

          // now just concat the hashed random number to the end of the token
          req.token = req.token + hashedRandomNumberToAppend;
          return res.status(200).json("logout");
     } catch (err) {
          return res.status(500).json(err.message);
     }
};

exports.updateUserDetails = async (req, res) => {
     console.log("Request body", req.body);
     try {
          const updatedUserData = {
               firstname: req.body?.firstname,
               lastname: req.body.lastname,
               email: req.body.email,
               phone: req.body?.phone,
               image: req.body?.image,
               sales_opt_in: req.body?.sales_opt_in,
               salesEmailReport: req.body?.salesEmailReport,
               timeZone: req.body?.timeZone,
          };

          console.log("updatedUserData", updatedUserData);

          // Assuming you have a User model and a method like `updateUserById` to update a user by ID
          const updatedUser = await User.findByIdAndUpdate(
               req?.userData?._id ?? req.body.userId,
               updatedUserData,
               {
                    new: true,
               },
          );

          let company;
          if (updatedUser?.company)
               company = await Company.findByIdAndUpdate(
                    updatedUser?.company,
                    {
                         phone: req.body.phone,
                         ...(req.body.companyName && { company_name: req.body.companyName }),
                    },
                    {
                         new: true,
                    },
               );

          // Omit password from the updated user object before sending the response
          const userWithoutPassword = {
               _id: updatedUser._id,
               firstname: updatedUser.firstname,
               lastname: updatedUser.lastname,
               email: updatedUser.email,
               role: updatedUser.role,
               company: updatedUser.company,
               sales_opt_in: updatedUser.sales_opt_in,
               salesEmailReport: updatedUser.salesEmailReport,
          };

          res.status(200).json({ user: userWithoutPassword, company, status: true });
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(400).json({ error, status: false });
     }
};

exports.resetPassword = async (req, res) => {
     try {
          const { token, newPassword } = req.body;
          const decoded = jwt.verify(token, "secret");
          const user = await User.findById(decoded._id);

          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          user.password = newPassword;
          await user.save();

          res.status(200).json({ message: "Password updated successfully", status: true });
     } catch (error) {
          console.error("Error updating password:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.updatePassword = async (req, res) => {
     try {
          const user = await User.findById(req.userData._id);
          if (req.body.oldPassword && !req.body.reset) {
               const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
               if (!isPasswordMatch) {
                    return res.status(401).json({ message: "wrong old password" });
               }
          }
          const password = await bcrypt.hash(req.body.password, 8);
          const updatedUserData = {
               password: password,
          };
          // Assuming you have a User model and a method like `updateUserById` to update a user by ID
          const updatedUser = await User.findByIdAndUpdate(req.userData._id, updatedUserData, {
               new: true,
          });

          // Omit password from the updated user object before sending the response
          const userWithoutPassword = {
               _id: updatedUser._id,
               firstname: updatedUser.firstname,
               lastname: updatedUser.lastname,
               email: updatedUser.email,
               role: updatedUser.role,
               company: updatedUser.company,
          };

          res.status(200).json({ user: userWithoutPassword, status: true });
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.updatePasswordCustomer = async (req, res) => {
     try {
          const user = await User.findById(req.body.userId);
          if (req.body.oldPassword && !req.body.reset) {
               const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
               if (!isPasswordMatch) {
                    return res.status(401).json({ message: "wrong old password" });
               }
          }
          const password = await bcrypt.hash(req.body.password, 8);
          const updatedUserData = {
               password: password,
          };
          // Assuming you have a User model and a method like `updateUserById` to update a user by ID
          const updatedUser = await User.findByIdAndUpdate(req.body.userId, updatedUserData, {
               new: true,
          });

          // Omit password from the updated user object before sending the response
          const userWithoutPassword = {
               _id: updatedUser._id,
               firstname: updatedUser.firstname,
               lastname: updatedUser.lastname,
               email: updatedUser.email,
               role: updatedUser.role,
               company: updatedUser.company,
          };

          res.status(200).json({ user: userWithoutPassword, status: true });
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.forgotPassword = async (req, res) => {
     try {
          const email = req.body.email;
          const url = req.body.url;
          const check = await User.findOne({ email: email });
          if (!check) {
               return res.status(201).json({ message: "No user found with email", status: false });
          }
          const token = jwt.sign(
               {
                    _id: check._id,
               },
               "secret",
          );
          sendForgotPasswordEmail(email, check.firstname, token, url);
          res.status(200).json({ message: "Reset Password Emaill Sent", status: true });
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

exports.getUserDetails = async (req, res) => {
     try {
          const user = await User.findById(req?.userData?._id ?? req.params.id).populate({
               path: "company",
               populate: {
                    path: "selectedCarriers",
               },
               options: { virtuals: true },
          });

          if (!user) {
               return res.status(404).json({ message: "User not found.", status: false });
          }

          res.status(200).json({ user, company: null, status: true });
     } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).json({ message: "Internal server error.", status: false });
     }
};

exports.getAllFreelancUsers = async (req, res) => {
     try {
          const users = await user.find({ role: USER_ROLE.FREELANCER });
          res.status(200).json(users);
          return successResponder(res, users);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};
