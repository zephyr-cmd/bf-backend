const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      default: "",
      required: true,
    },
    item: {
      totalItems: { type: Array, required: true },
      totalPrice: { type: Number, required: true },
      totalQuantity: { type: Number, required: true },
    },
    isPaymentOnline: { type: Boolean, default: false },
    address: {
      houseNumber: {
        type: String,
        default: "",
      },
      line1: {
        type: String,
        default: "",
      },
      line2: {
        type: String,
        default: "",
      },
      street: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      pinCode: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      landMark: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const ClientOrder = mongoose.model("ClientOrder", schema);
module.exports = ClientOrder;
