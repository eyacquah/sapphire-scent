const mongoose = require("mongoose");
const validator = require("validator");

// name, email, pass, pass con, phone number,address

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Enter a valid email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "A customer must have a phone number"],
    validate: [validator.isMobilePhone, "Enter a valid phone number"],
  },
  address: {
    country: String,
    region: String,
    city: String,
    streetAddress: String,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
