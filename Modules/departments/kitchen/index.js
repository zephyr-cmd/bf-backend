const express = require("express");
const router = express.Router();

const {
  createUser,
  otpVerfication,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
  sendOTP,
} = require("./controller/accessController");
const {
  updateProduct,
  createProduct,
  fetchProduct,
} = require("./controller/serviceController");

console.log("--------inside the kitchen_Modules routes ---->");

router.post("/login", loginUser); //localhost:8080/api/v1/modules/student
router.post("/", createUser);
router.post("/otpverification", otpVerfication);
router.put("/logout", logoutUser);
router.put("/sendotp", sendOTP);
router.put("/forgotpass", forgotPassword);
router.put("/resetpass", resetPassword);
router.put(
  "/", // appUpload.single("profileImage"),
  updateUser
);

router.post("/product", createProduct);
router.put("/product", updateProduct);
router.get("/product", fetchProduct)

module.exports = router;
