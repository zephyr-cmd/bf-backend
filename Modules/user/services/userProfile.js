const mongoose = require("mongoose");
const userSchema = require("../../../Models/user/userSchema");
const saltRounds = 12;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { msgService } = require("../../../utils/msgService");
const passwordGenerator = require("generate-otp");
const { securityKey } = require("../../../utils/commonURL");

const createUserSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { firstName, lastName, phoneNumber, email, password } = req.body;
      console.log("L-12, createUserSer--------------->", req.body);
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(password, salt);
      const otpCode = passwordGenerator.generate(6);

      let user = await userSchema.findOne({ phoneno: phoneNumber });
      if (user) {
        return resolve({
          status: 409,
          message: "User already registered, Kindly signIn",
          data: {},
        });
      } else if (!user) {
        let newUser = {
          name: {
            firstName: firstName,
            lastName: lastName,
          },
          phoneNumber: phoneNumber,
          email: email,
          role: "user",
          password: hashed,
          otpCode: `${otpCode}`,
          otpCodeExpiration: currentTime(15),
        };
        console.log(
          "L-35, -----------------else if / createUserSer--------------->",
          newUser
        );
        const savedUser = await userSchema.create(newUser);
        if (!savedUser) {
          return resolve({
            status: 500,
            message:
              "something went wrong :  signUp failed, Please try again later ",
            data: {},
          });
        }
        if (savedUser) {
          // sms msg91
          // sample textMessage = `Dear ${firstName}, Your OTP for registration is ${otpCode} and is valid up to 15 minutes`
          let mobileNo = `91${phoneNumber}`;
          console.log(
            "L-61 , user Created phoneno & otp----->",
            mobileNo,
            "**&**",
            savedUser.otpCode
          );
          // msgService(firstName, mobileNo, otpCode)

          return resolve({
            status: 201,
            message: "Successfully created the user",
            data: savedUser,
          });
        }
      }
    } catch (err) {
      console.log(err.message);
      return reject({
        status: 400,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const otpVerficationSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("L-85, otpVerification-------->", req.body);
      let status = await otpVerfication(req, userSchema);
      if (status) {
        let user = await userSchema.findOneAndUpdate(
          {
            $or: [{ phoneno: req.body.phoneNumber }, { email: req.body.email }],
          },
          { isVerified: true }
        );
        if (user) {
          console.log(
            "L-109, otpVerification-------->",
            user.otpCodeExpiration
          );
          resolve({
            status: 200,
            message: "OTP verification successful",
            data: {
              email: user.email,
              phoneNumber: user.phoneNumber,
            },
          });
        } else {
          return resolve({
            status: 400,
            message: "something went wrong",
            data: {},
          });
        }
      } else {
        return resolve({
          status: 422,
          message: "Otp expired or Invalid OTP",
        });
      }
    } catch (err) {
      console.log(err.message);
      return reject({
        errorCode: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const loginUserSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, phoneNumber, password } = req.body;
      console.log("L-112, req.body", req.body);
      // if (typeof phoneNumber !== 'string' || typeof email !== 'string') {
      //     console.log('Invalid arguments. phoneNumber and email must be strings.');
      // }
      let user = await userSchema.findOne({
        $or: [{ phoneNumber: phoneNumber }, { email: email }],
      });
      if (!user) {
        return resolve({
          status: 403,
          message: "there is no user with such email id or Mobile Number",
          data: {},
        });
      }

      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(password, salt);
      console.log("L-163, password------------>", password, hashed);
      const passwordMatch = await bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return resolve({
          status: 401,
          message:
            "Invalid credentials, please signin with correct id & password",
          data: {},
        });
      }
      const token = jwt.sign(
        {
          userId: user._id,
          // firstName: user.name.firstName,
        },
        securityKey,
        { expiresIn: "360h" }
      );
      user.token = token;
      await user.save();
      return resolve({
        status: 200,
        message: `Successfully loggedIn as ${user.role}`,
        data: {
          firstName: user.name.firstName,
          token: user.token,
          role: user?.role
        },
      });
    } catch (err) {
      console.log(err.message);
      return reject({
        errorCode: 400,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const logoutUserSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.loggedInDetails.userId);
      console.log("L-194, inside logoutuser--->", userId);
      const { phoneNumber, email } = req.body;
      await userSchema.findOneAndUpdate(
        {
          $or: [{ phoneno: phoneNumber }, { email: email }, { _id: userId }],
        },
        { token: null }
      );
      return resolve({
        status: 200,
        message: "Successfully logged out the user",
        data: {},
      });
    } catch (err) {
      console.log(err.message);
      return reject({
        status: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const sendOtpSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { phoneNumber, email } = req.body;
      var currentTime = new Date();
      console.log("L-215, currentoffset", currentTime);
      var currentOffset = new Date().getTimezoneOffset();
      // var currentOffset = 0;
      console.log("L-218, currentoffset", currentOffset);
      var ISTOffset = 330; // IST offset UTC +5:30
      var created_at = new Date(
        currentTime.getTime() + (ISTOffset + currentOffset) * 60000
      );
      const user = await userSchema.findOne({
        $or: [{ phoneno: phoneNumber }, { email: email }],
      });
      if (!user) {
        return resolve({
          status: 403,
          message: "No user exits, please signUp ",
          data: {},
        });
      } else {
        let mobileNo = `91${phoneNumber}`;
        const otpCode = passwordGenerator.generate(6);
        console.log(
          "L-230, user Created phoneno & otp----->",
          mobileNo,
          "**&**",
          otpCode,
          user.name.firstName
        );
        // msgService(user.name.firstName, mobileNo, otpCode);
        user.otpCode = otpCode;
        user.otpCodeExpiration = created_at;
        await user.save();
        return resolve({
          status: 200,
          message: "Otp send Successfully",
          data: {},
        });
      }
    } catch (err) {
      console.log(err.message);
      return reject({
        status: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const forgotPasswordSer = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const email = req.body.email.toString().trim();
      const { phoneNumber, email, otpCode, password } = req.body;
      let salt = await bcrypt.genSalt(saltRounds);
      let hashed = await bcrypt.hash(password, salt);
      // const recoveryCode = Math.floor(Math.random() * 100000);
      const user = await userSchema.findOneAndUpdate(
        {
          $or: [{ phoneno: phoneNumber }, { email: email }],
          otpCode: otpCode,
          otpCodeExpiration: { $gt: currentTime(0) },
        },
        {
          password: hashed,
        }
      );
      if (!user) {
        return reject({
          status: 404,
          message: "something went wrong",
          data: {},
        });
      } else {
        return resolve({
          status: 200,
          message: "password reset Successfully",
          data: {
            name: `${user.name}`,
            email: user.email,
          },
        });
      }
    } catch (err) {
      console.log(err.message);
      return reject({
        status: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const resetPasswordSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { otp, email, phoneNumber, newPassword } = req.body;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(newPassword, salt);
      let user = await userSchema.findOneAndUpdate(
        {
          $or: [{ phoneno: phoneNumber }, { email: email }],
          recoveryCode: otp,
          otpCodeExpiration: { $gt: Date.now() },
        },
        {
          password: hashed,
        }
      );
      if (!user) {
        resolve({
          status: 500,
          message: "user password updation failed, Check email and otp",
          data: {},
        });
      }
      resolve({
        status: 200,
        message: "user password updated",
        data: user,
      });
    } catch (err) {
      console.log("err in reset forgetpassword------->", err.message);
      return reject({
        errorCode: 500,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

const updateUserSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    console.log("---File uploaded data----", req.file);
    try {
      req.checkHeaders("x-auth-token", "No Token Found").exists();
      var errors = req.validationErrors();
      if (errors) {
        return resolve({
          status: 422,
          message: "please provide header",
          data: {},
        });
      }
      console.log("L-244, inside addAddressSer/appUser/v1TreeDrive");
      const userId = mongoose.Types.ObjectId(req.loggedInDetails._id);
      console.log("L-246, userId", userId);
      let user = await userSchema.findOne({
        _id: userId,
        isDeleted: false,
        isUserVerified: true,
      });
      user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
      user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
      user.phoneNumber = req.body.phoneNumber
        ? req.body.phoneNumber
        : user.phoneNumber;
      user.gender = req.body.gender ? req.body.gender : user.gender;
      user.dateOfBirth = req.body.dateOfBirth
        ? req.body.dateOfBirth
        : user.dateOfBirth;
      if (req.file) {
        user.profileImage = req.file.key ? req.file.key : user.profileImage;
      }
      // user.address.state = req.body.state;
      // user.address.city = req.body.city;
      // user.address.country = req.body.country;
      // user.address.pinCode = req.body.pincode;
      // user.address.location.coordinates = coordinates;
      await user.save((err, user) => {
        if (err) {
          return reject({
            status: 500,
            message: "Internal server Error, cannot update the user ",
          });
        }
        return resolve({
          status: 200,
          message: "successfully updated the user ",
          data: {
            // user
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
            token: user.token,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            profileImage: user.profileImage,
          },
        });
      });
    } catch (error) {
      return reject({
        status: 500,
        message: "internal server error",
        data: {},
      });
    }
  });
};

const otpVerfication = async (req, Model) => {
  let { phoneNumber, email, otpCode } = req.body;
  console.log("L-425, inside otpVerification", Model, req.body);
  let user = await Model.findOne({
    $or: [{ phoneno: phoneNumber }, { email: email }],
    otpCode: otpCode,
    otpCodeExpiration: { $gt: currentTime(0) },
  });
  if (!user) {
    return false;
  }
  // await Model.findOneAndUpdate(
  //     {
  //         [phoneno]: req.body.phoneNumber
  //     },
  //     { otpRecoveryCodeExpiration: Date.now() - 60 * 2 * 1000 }
  // );
  console.log("L-360, return true ");
  return true;
};

function currentTime(extraTime) {
  var currentTime = new Date();
  console.log("L-440, current-Time", currentTime);
  // var currentOffset = new Date().getTimezoneOffset();
  var currentOffset = 0;
  console.log("L-443, currentoffset", currentOffset);
  var ISTOffset = 330; // IST offset UTC +5:30
  var created_at = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );
  console.log("L-446, created_at", created_at);
  created_at.setMinutes(created_at.getMinutes() + extraTime);
  console.log("L-448, created_at + 15min", created_at);
  return created_at;
}

module.exports = {
  createUserSer,
  otpVerficationSer,
  loginUserSer,
  logoutUserSer,
  sendOtpSer,
  forgotPasswordSer,
  resetPasswordSer,
  updateUserSer,
};
