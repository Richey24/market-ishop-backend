const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const userController = require("../controllers/userController");
const asyncHandler = require("../../config/asyncHandler");

router.post("/register", asyncHandler(userController.register));
router.post("/social/register", asyncHandler(userController.socialRegister));
router.post("/confirm", asyncHandler(userController.confirmEmail));
router.post("/login", asyncHandler(userController.loginUser));
router.post("/logout", asyncHandler(userController.logoutUser));

router.get("/me/customer/:id", userController.getUserDetails);
router.put("/me/customer", userController.updateUserDetails);
router.put("/update/password", auth, userController.updatePassword);
router.put("/update/password/customer", userController.updatePasswordCustomer);
router.post("/forgot/password", userController.forgotPassword);
router.post("/reset/password", userController.resetPassword);


module.exports = router;
