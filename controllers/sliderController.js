const multer = require("multer");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Slider = require("../models/sliderModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

      await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/sliders/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.updateSlider = catchAsync(async (req, res, next) => {
  // Handling PATCH, expects only props that should be updated
  console.log("---WORKING!!----");
  console.log(req.body);
  const doc = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  console.log(doc);

  if (!doc) return next(new AppError("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createSlider = factory.createOne(Slider);
