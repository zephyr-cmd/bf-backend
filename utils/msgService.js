const axios = require("axios");
const { response } = require("express");

const msgService = async (full_name, mobileNumber, otpCode) => {
  return new Promise(async (resolve, reject) => {
    let mobileNumber = Number(mobileNumber);
    //console.log("userName, mobileNo, otp", full_name, mobileNumber, otpCode);
    try {
      let template_Id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      const options = {
        method: "POST",
        url: "https://control.msg91.com/api/v5/flow/",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authkey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        data: {
          template_id: template_Id,
          sender: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          short_url: "1 (On) or 0 (Off)",
          mobiles: mobileNumber,
          user: full_name,
          otpCode: otpCode,
        },
      };
      await axios
        .request(options)
        .then(function (response) {
          console.log("response from msgService", response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
      return resolve(response.data);
    } catch (err) {
      console.log("error in sending message--->", err.message);
      return reject({
        message: err.message,
      });
    }
  });
};
const askDoubt = async (firstName, phoneNumber, subject, topic) => {
  return new Promise(async (resolve, reject) => {
    let mobileNumber = Number(phoneNumber);
    //console.log("userName, mobileNo, otp", full_name, mobileNumber, otpCode);
    try {
      let template_Id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      const options = {
        method: "POST",
        url: "https://control.msg91.com/api/v5/flow/",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authkey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        data: {
          template_id: template_Id,
          sender: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          short_url: "1 (On) or 0 (Off)",
          mobiles: mobileNumber,
          user: firstName,
          subject: `${subject}`,
          topic: `${topic}`,
        },
      };
      await axios
        .request(options)
        .then(function (response) {
          console.log("response from msgService", response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
      return resolve(response.data);
    } catch (err) {
      console.log("error in sending message--->", err.message);
      return reject({
        message: err.message,
      });
    }
  });
};


module.exports = {
  msgService,
  askDoubt,
};
