const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: String,
    fullName: String,
    phone: String,
    address: String,
    products: Array,
    status: String,
    total: Number,
    card: {
      name: String,
      number: String,
      expMonth: String,
      expYear: String,
      cvv: String,
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;