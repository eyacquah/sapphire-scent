const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const paginate = require("express-paginate");

// Security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// Error handling
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Routers
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const adminRouter = require("./routes/adminRoutes");
const webRouter = require("./routes/webRoutes");
const customerRouter = require("./routes/customerRoutes");
const orderRouter = require("./routes/orderRoutes");
const paymentRouter = require("./routes/paymentRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

//  SET HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// DEV LOG
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// LIMIT API REQUESTS FROM AN IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// DATA SANITIZATION against NOSQL Query Injection
app.use(mongoSanitize());

// DATA SANITIZATION against XXS
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
// Custom Middleware/ TEST
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// MOUNTING ROUTERS
// app.use(paginate.middleware(1, 50));
app.use("/", webRouter);
app.use("/dashboard", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/payments", paymentRouter);

// Errors
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
