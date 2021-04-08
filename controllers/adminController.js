const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const User = require("../models/userModel");
const Slider = require("../models/sliderModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getLoginTemplate = async (req, res, next) => {
  // await Order.deleteMany();
  // console.log("DELETED");
  res.locals.url = "https://sapphire-scent-bucket.s3.us-west-2.amazonaws.com";
  try {
    const token = req.cookies.jwt;
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    await User.findById(decodedToken.id);
    return next();
  } catch (err) {
    // console.log(err);
    res.status(200).render("dashboard/login", {
      title: "Login",
    });
  }
};

exports.getDashboard = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.locals.categories = categories;

  res.status(200).render("dashboard/index", {
    title: "Admin",
  });
});

exports.getUpdateProductForm = catchAsync(async (req, res, next) => {
  const productArr = await Product.find({ slug: req.params.slug });
  const product = productArr[0];

  const categories = await Category.find();
  res.locals.categories = categories;

  res.status(200).render("dashboard/product-form", {
    title: "Add Product",
    product,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { product } = req.query;
  const results = await Product.find();

  const features = new APIFeatures(Product.find(), req.query).paginate();

  const allProducts = await features.query;

  const products = allProducts.map((item) => {
    item.amountOff = item.priceDiscount
      ? 100 - Math.floor((item.priceDiscount / item.price) * 100)
      : 0;

    return item;
  });

  const numResults = results.length;
  const RES_PER_PAGE = 10;
  const numOfPages = Math.ceil(numResults / RES_PER_PAGE);
  const currPage = +req.query.page || 1;

  res.locals.currPage = currPage;
  res.locals.numOfPages = numOfPages;
  res.locals.pageLimit = RES_PER_PAGE;
  res.locals.query = product;

  products.reverse();

  res.status(200).render("dashboard/product-list", {
    title: "All Products",
    products,
  });
});

exports.getCategoryForm = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard/category-form", {
    title: "Add Category",
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).render("dashboard/category-list", {
    title: "All Categories",
    categories,
  });
});

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(200).render("dashboard/customer-list", {
    title: "All Customers",
    customers,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const results = await Order.find();

  const orders = results.map((order) => {
    order.payStatus = order.paid ? "Paid" : "Pending";
    order.delStatus = order.delivered ? "Delivered" : "Pending";
    return order;
  });

  orders.reverse();

  res.status(200).render("dashboard/order-list", {
    title: "All Orders",
    orders,
  });
});

exports.getOrderDetail = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  const noteDate = new Date(Date.parse(order.notes[0].createdAt));

  const noteOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "GMT",
    timeZoneName: "short",
  };

  order.notes[0].date = noteDate.toLocaleTimeString("en-GB", noteOptions);

  order.payStatus = order.paid ? "Paid" : "Pending";
  order.delStatus = order.delivered ? "Delivered" : "Pending";

  res.status(200).render("dashboard/order-detail", {
    title: "Order Detail",
    order,
  });
});

// ///// DELETE

exports.confirmDeleteProduct = catchAsync(async (req, res, next) => {
  const productArr = await Product.find({ slug: req.params.slug });
  const product = productArr[0];

  res.status(200).render("dashboard/delete-product", {
    product,
  });
});

exports.confirmDeleteCategory = catchAsync(async (req, res, next) => {
  const catArr = await Category.find({ slug: req.params.slug });
  const category = catArr[0];

  res.status(200).render("dashboard/delete-category", {
    category,
  });
});

exports.confirmDeleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  res.status(200).render("dashboard/delete-order", {
    order,
  });
});

exports.getSearchResults = catchAsync(async (req, res, next) => {
  const { product } = req.query;

  const results = await Product.find({
    title: { $regex: new RegExp(`^${product}`, "i") },
  });

  const features = new APIFeatures(
    Product.find({
      title: { $regex: new RegExp(`^${product}`, "i") },
    }),
    req.query
  ).paginate();

  const allProducts = await features.query;

  const products = allProducts.map((item) => {
    item.amountOff = item.priceDiscount
      ? 100 - Math.floor((item.priceDiscount / item.price) * 100)
      : 0;

    return item;
  });

  const numResults = results.length;
  const RES_PER_PAGE = 10;
  const numOfPages = Math.ceil(numResults / RES_PER_PAGE);
  const currPage = +req.query.page || 1;

  res.locals.currPage = currPage;
  res.locals.numOfPages = numOfPages;
  res.locals.pageLimit = RES_PER_PAGE;
  res.locals.query = product;

  res.status(200).render("dashboard/product-list", {
    title: "Admin",
    products,
  });
});

exports.getSliderUpdateForm = catchAsync(async (req, res, next) => {
  const slider = await Slider.findById("603e1a9e45a8e80a8ca21fa9");
  res.status(200).render("dashboard/slider-form", {
    slider,
  });
});
