const multer = require("multer");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Product = require("../models/productModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// FACTORY CRUD

exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

/////////////////////////////////////////////////////////////////// IMAGE UPLOADS & PROCESSING

const multerStorage = multer.memoryStorage();

// Filter for Valid File Types
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image", 400), false);
  }
};

// Handle Upload
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadProductImages = upload.array("images", 7);

// Resizing Uploaded Images
exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // Store the images in the body
  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Math.random() * 1000}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.updateProductInfo = catchAsync(async (req, res, next) => {
  // Handling PATCH, expects only props that should be updated

  const doc = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!doc) return next(new AppError("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.getSearchData = catchAsync(async (req, res, next) => {
  const { product } = req.query;

  const products = await Product.find({
    title: { $regex: new RegExp(`^${product}`, "i") },
  });

  res.status(200).json({
    status: "success",
    data: {
      results: products.length,
      products,
    },
  });
});
