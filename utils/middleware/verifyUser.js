const jwt = require("jsonwebtoken");
const UserDB = require("../../Models/user/userSchema");
const { securityKey } = require("./../../utils/commonURL");
const verifyUser = async (req, res, next) => {
  try {
    // req.checkHeaders("eh-auth-token", "No Token Found").exists();
    const headerToken = req.headers["auth-token"];
    console.log("L-8, authorization------->", req.headers);
    console.log("L-9, authorization------->", headerToken);
    if (!headerToken) {
      return res.status(401).json({
        status: 401,
        message: "No header token attached",
        data: {},
      });
    }
    try {
      let decoded = await jwt.verify(headerToken, securityKey);
      if (decoded) {
        let user = await UserDB.findOne({ token: headerToken });
        if (!user) {
          return res.status(403).send({
            status: 403,
            message: "no user found !!"
          })
        }
        req.loggedInDetails = user;
        next();
      }
    } catch (error) {
      console.log(`L-31, --------error------ ${error.message}`)
      return res.status(401).json({
        status: 401,
        message: `${error.message}`,
        data: {},
      });
    }
  } catch (error) {
    console.log("---------error---->", error.message);
    return res.status(500).json({
      staus: 500,
      message: "Something went wrong",
      data: {},
    });
  }
};
module.exports = { verifyUser };
