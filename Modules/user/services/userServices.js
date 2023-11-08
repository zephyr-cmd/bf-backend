const mongoose = require("mongoose");
const userSchema = require("../../../Models/user/userSchema");
const orderSchema = require("../../../Models/user/orderSchema");

const createOrderSer = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userId = new mongoose.Types.ObjectId(req.loggedInDetails.userId);
      console.log("L-9, req.body------->", req.body);
      let { order, phoneNumber, isPaymentOnline, address } = req.body;
      let item = order;
      let user = await userSchema.findOne({ _id: userId });
      console.log("L-12, createUserSer--------------->", req.body);
      // let user = await userSchema.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        return reject({
          status: 400,
          message: "User not registered, Kindly signUp",
          data: {},
        });
      } else if (user) {
        let newObj = {
          phoneNumber: phoneNumber,
          item: item,
          isPaymentOnline: isPaymentOnline || false,
          address: address,
        };
        console.log(
          "L-30, -----------------else if / createOrderSer--------------->",
          newObj
        );
        const savedOrder = await orderSchema.create(newObj);
        if (!savedOrder) {
          return reject({
            status: 500,
            message:
              "something went wrong :  order failed, Please try again later ",
            data: {},
          });
        }
        if (savedOrder) {
          // sms msg91
          // sample textMessage = `Dear ${firstName}, Your OTP for registration is ${otpCode} and is valid up to 15 minutes.`
          let mobileNo = `91${phoneNumber}`;
          console.log("L-42 , user Created phoneno & otp----->", mobileNo);
          // msgService(firstName, mobileNo, otpCode)

          let io = req.app.get("socketio");
          let socketData = {
            message: `Received new order`,
          };
          io.emit(`order_recieved`, socketData);

          return resolve({
            status: 201,
            message: "Successfully order placed",
            data: savedOrder,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      return reject({
        status: 400,
        message: "Something went wrong",
        data: {},
      });
    }
  });
};

function currentTime(extraTime) {
  var currentTime = new Date();
  console.log("L-65, current-Time", currentTime);
  // var currentOffset = new Date().getTimezoneOffset();
  var currentOffset = 0;
  console.log("L-68, currentoffset", currentOffset);
  var ISTOffset = 330; // IST offset UTC +5:30
  var created_at = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );
  console.log("L-71, created_at", created_at);
  created_at.setMinutes(created_at.getMinutes() + extraTime);
  console.log("L-73, created_at + 15min", created_at);
  return created_at;
}

module.exports = {
  createOrderSer,
};
