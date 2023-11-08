const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    mealType: {
      type: String,                 //[breakfast, lunch, dinner, juices]
      default: "lunch",
    },
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    basePrice: {
      type: Array,
      required: true,
    },
    image: String,
    tasteOptions: {                   //[spicy/nonSpicy]
      type: Array,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", schema);
module.exports = Product;
