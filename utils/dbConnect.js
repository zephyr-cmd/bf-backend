const mongoose = require("mongoose");

const DBCluster = process.env.DATABASE;

// let DB_URL = "mongodb://127.0.0.1:27017/testCode"; //local Machine DB
let DB_URL = "mongodb+srv://deva:Crazy.xyz@cluster0.lf3ztjv.mongodb.net/";

console.log(`DB_URL`, DB_URL);

module.exports = () => {
  console.log("........connecting to DB..........");
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`DB connection successful !`))
    .catch((error) => {
      console.log(`DB connection failed due to :: ${error.message}`);
    });
};
