const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: String,
  ref: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
