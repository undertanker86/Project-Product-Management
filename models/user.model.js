const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
		token: String,
    phone: String,
    avatar: String,
    status: String,
    acceptFriends: Array,
    requestFriends: Array, 
    friendsList: Array, 
    statusOnline: String,
    address: String,
    card:{
      name: String,
      number: String,
      expMonth: String,
      expYear: String,
      cvv: String
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema, "users");
module.exports = User;