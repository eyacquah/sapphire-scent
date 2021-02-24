const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, pass, pass con
const userSchema = new mongoose.Schema({
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
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must have a password"],
    validate: {
      validator: function (str) {
        // Only works on SAVE!!
        return str === this.password;
      },
      message: "The two passwords should match!",
    },
  },
});

//////////////////////////////////////
// DOCUMENT MIDDLEWARE

// Password hashing
userSchema.pre("save", async function (next) {
  // Only run func if the password was modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12 -- CPU power
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

///////////////////////////////////////////////////
//  SCHEMA METHODS

// Check if Password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
