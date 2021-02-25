const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

////////////////////////////////////////

// JSON WEB TOKEN

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

///////////////////////////////////////////

// SIGNUP

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});

/////////////////////////////////////////

/// LOGIN

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password was recieved
  if (!email || !password) {
    return next(new AppError("Please provide your email and password", 400));
  }

  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 3. All good? Send token to client
  createSendToken(user, 200, req, res);
});

// ///// LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

////////////////////////////////////////////

/// ALLOW ACCESS TO ONLY LOGGED IN USERS

exports.protect = catchAsync(async (req, res, next) => {
  // Check if token exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );

  // Verify the token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) return next(new AppError("User no longer exists", 401));

  // Grant Access to protected route
  req.user = currentUser;
  // Pug gets access to res.locals
  res.locals.user = currentUser;
  next();
});
