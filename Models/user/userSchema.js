const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        default: "",
        trim: true,
      },
      lastName: {
        type: String,
        default: "",
        trim: true,
      },
      alias: {
        type: String,
        default: "",
        trim: true,
      },
    },
    countryCode: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },
    onlineIdentities: {
      //for social media accounts
      type: mongoose.Schema.Types.Mixed,
    },
    gender: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
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
    password: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "",
    },
    otpCode: {
      // OTP for registration
      type: String,
    },
    otpCodeExpiration: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    role: {
      type: String,     //[admin, user]
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", schema);
module.exports = User;
