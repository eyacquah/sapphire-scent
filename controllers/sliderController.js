const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");

const factory = require("./handlerFactory");
const Slider = require("../models/sliderModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

///////////////////////////////
/// IMAGE PROCESSING BEFORE UPLOAD
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
exports.uploadSliderImages = upload.array("images", 7);

exports.resizeSliderImages = catchAsync(async (req, res, next) => {
  if (req.files.length === 0) return next();

  // Store the images in the body
  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Math.random() * 1000}-${Date.now()}-${
        i + 1
      }.jpeg`;

      const slider = await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
      // .toFile(`public/img/sliders/${filename}`);

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: filename,
        Body: slider,
      };

      s3.upload(s3Params, (err, data) => {
        if (err) res.status(500).send(err);
      });

      req.body.images.push(filename);
    })
  );

  next();
});

exports.updateSlider = catchAsync(async (req, res, next) => {
  // Handling PATCH, expects only props that should be updated

  const doc = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!doc) return next(new AppError("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createSlider = factory.createOne(Slider);
