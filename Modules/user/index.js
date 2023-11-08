const express = require("express");
const router = express.Router();
// const multerS3 = require("multer-s3");
// const aws = require("aws-sdk");

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
const { createOrder } = require("./controller/serviceController");
const { verifyUser } = require("../../utils/middleware/verifyUser");

// let s3 = new aws.S3({
//     accessKeyId: "Axxxxxxxxxxxxxxxxxxxx",
//     secretAccessKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
// });
// let appUpload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: "pos-stockholm-bucket",
//         acl: "public-read",
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, `appUploads/doubtImage/${file.originalname}`);
//         }
//         // process.env.awsBucket,
//     }),
//     limits: {
//         fileFilter
//     },
// });

console.log("--------inside the index/User_Modules routes ---->");

router.post("/login", loginUser); //localhost:8080/api/v1/modules/student
router.post("/", createUser);
router.post("/otpverification", otpVerfication);
router.put("/logout", verifyUser, logoutUser);
router.put("/sendotp", sendOTP);
router.put("/forgotpass", forgotPassword);
router.put("/resetpass", resetPassword);
router.put(
  "/", // appUpload.single("profileImage"),
  updateUser
);

router.post("/order", verifyUser, createOrder);

module.exports = router;
