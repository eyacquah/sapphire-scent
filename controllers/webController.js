const catchAsync = require("../utils/catchAsync");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Slider = require("../models/sliderModel");

const APIFeatures = require("../utils/apiFeatures");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  res.locals.categories = await Category.find();
  next();
});

exports.getIndex = catchAsync(async (req, res, next) => {
  const newProducts = [];
  const promoProducts = [];

  const allProducts = await Product.find();
  allProducts.reverse();

  allProducts.forEach((product) => {
    if (
      Date.parse(product.createdAt) + 2.592e9 > Date.now() &&
      newProducts.length <= 7
    )
      newProducts.push(product);

    if (product.priceDiscount && promoProducts.length <= 7) {
      const percentPriceDiscount =
        (product.priceDiscount / product.price) * 100;

      product.amountOff = 100 - Math.floor(percentPriceDiscount);
      promoProducts.push(product);
    }
  });

  const slider = await Slider.findById("603e1a9e45a8e80a8ca21fa9");
  // console.log(slider);

  res.status(200).render("web/index", {
    title: "Home",
    slider,
    newProducts,
    promoProducts,
  });
});

exports.getCategoryProducts = catchAsync(async (req, res, next) => {
  const cat = await Category.findOne({
    slug: req.params.categorySlug,
  }).populate("products");

  const numResults = cat.products.length;
  const RES_PER_PAGE = 10;
  const numOfPages = Math.ceil(numResults / RES_PER_PAGE);

  const currPage = +req.query.page || 1;

  res.locals.currPage = currPage;
  res.locals.numOfPages = numOfPages;
  res.locals.pageLimit = RES_PER_PAGE;

  // Execute Query
  const features = new APIFeatures(
    Product.find({ category: cat._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  // products.reverse();

  res.status(200).render("web/category", {
    title: cat.title,
    products,
  });
});

exports.getProductDetail = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  const category = await Category.findById(product.category).populate({
    path: "products",
  });

  res.status(200).render("web/product-detail", {
    title: product.title,
    product,
    category,
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

  const products = await features.query;

  const numResults = results.length;
  const RES_PER_PAGE = 10;
  const numOfPages = Math.ceil(numResults / RES_PER_PAGE);
  const currPage = +req.query.page || 1;

  res.locals.currPage = currPage;
  res.locals.numOfPages = numOfPages;
  res.locals.pageLimit = RES_PER_PAGE;
  res.locals.query = product;

  res.status(200).render("web/results", {
    title: "Search Results",
    products,
  });
});

exports.getCheckoutPage = catchAsync(async (req, res, next) => {
  res.status(200).render("web/checkout", {
    title: "Checkout",
  });
});

exports.getOrderCompletePage = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderID);
  const { products } = order;

  const date = new Date(Date.parse(order.createdAt));
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  order.date = date.toLocaleString("en-GB", options);
  let id = order._id;
  id = `${id}`;

  order.orderNum = `GH-${id.slice(-5).toUpperCase()}`;

  res.status(200).render("web/order-complete", {
    title: "Thanks for ordering",
    order,
    products,
  });
});
