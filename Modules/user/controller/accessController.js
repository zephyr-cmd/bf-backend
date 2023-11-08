const {
  createUserSer,
  otpVerficationSer,
  loginUserSer,
  logoutUserSer,
  sendOtpSer,
  forgotPasswordSer,
  resetPasswordSer,
  updateUserSer
} = require("../services/userProfile");

const createUser = async (req, res) => {
  try {
    console.log("inside the createUserSer controller--->");
    const data = await createUserSer(req);
    console.log("L-16, data---------->", data)
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the createUserSer Error--->", err.message);
    return res.status(400).json({ error: err.message });
  } s
};
const otpVerfication = async (req, res) => {
  try {
    console.log("inside the otpVerification controller--->");
    const data = await otpVerficationSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the otpVerification Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};
const loginUser = async (req, res) => {
  try {
    console.log("inside the loginUser controller--->");
    const data = await loginUserSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the loginUser Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    console.log("inside the logoutUser controller--->");
    const data = await logoutUserSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the logoutUser Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    console.log("inside the sendOtpSer controller--->");
    const data = await sendOtpSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the forgetPassword Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    console.log("inside the forgetPassword controller--->");
    const data = await forgotPasswordSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the forgetPassword Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    console.log("inside the resetPassword controller--->");
    const data = await resetPasswordSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the resetPassword Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    console.log("inside the updateUser controller--->");
    const data = await updateUserSer(req);
    return res.status(data.status).json(data);
  } catch (err) {
    console.log("inside the updateUser Error--->", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  otpVerfication,
  loginUser,
  logoutUser,
  sendOTP,
  forgotPassword,
  resetPassword,
  updateUser
};