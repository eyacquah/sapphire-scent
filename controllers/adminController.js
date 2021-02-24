const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getLoginTemplate = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) return next();

  res.status(200).render("dashboard/login", {
    title: "Login",
  });
});

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
    const date = new Date(Date.parse(order.createdAt));
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    order.date = date.toLocaleString("en-GB", options);

    order.payStatus = order.paid ? "Paid" : "Pending";
    order.delStatus = order.delivered ? "Delivered" : "Pending";
    return order;
  });

  res.status(200).render("dashboard/order-list", {
    title: "All Orders",
    orders,
  });
});

exports.getOrderDetail = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  const date = new Date(Date.parse(order.createdAt));
  const noteDate = new Date(Date.parse(order.notes[0].createdAt));
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const noteOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "GMT",
    timeZoneName: "short",
  };

  order.date = date.toLocaleString("en-GB", options);
  order.notes[0].date = noteDate.toLocaleTimeString("en-GB", noteOptions);

  order.payStatus = order.paid ? "Paid" : "Pending";
  order.delStatus = order.delivered ? "Delivered" : "Pending";

  // console.log(order);

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
  console.log(order);

  res.status(200).render("dashboard/delete-order", {
    order,
  });
});
