const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");

const factory = require("./handlerFactory");
const Product = require("../models/productModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// s3ImageURL = "https://sapphire-scent-bucket.s3.us-west-2.amazonaws.com/product-437.21080645297894-1617881124840-1.jpeg"

// FACTORY CRUD

exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

/////////////////////////////////////////////////////////////////// IMAGE UPLOADS & PROCESSING
AWS.config.region = "us-west-2";

const s3 = new AWS.S3();

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
  if (req.files.length === 0) return next();

  // Store the images in the body
  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Math.random() * 1000}-${Date.now()}-${
        i + 1
      }.jpeg`;

      const resizedImage = await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
      // .toFile(`public/img/products/${filename}`);

      // console.log(resizedImage);
      // console.log(resizedImage.options.input.buffer);

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: filename,
        Body: resizedImage,
      };

      s3.upload(s3Params, (err, data) => {
        if (err) res.status(500).send(err);
      });

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
