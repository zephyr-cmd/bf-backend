const express = require("express");
const Router = express.Router();
console.log("--------------- index Modules --------------->", new Date());
Router.use("/user", require("./user"));
Router.use("/kitchen", require("./departments/kitchen"));

module.exports = Router;
