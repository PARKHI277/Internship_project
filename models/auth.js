const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    mobileNumber: {
      unique: true,
      type: Number,
      maxlength: 10,
      required: [true, "Mobile Number is required"],
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const user = new mongoose.model("user", adminSchema);
module.exports = user;
