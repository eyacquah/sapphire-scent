const express = require("express");

const sliderController = require("../controllers/sliderController");

const router = express.Router();

router
  .route("/")
  .post(
    sliderController.uploadSliderImages,
    sliderController.resizeSliderImages,
    sliderController.createSlider
  );

router
  .route("/:id")
  .patch(
    sliderController.uploadSliderImages,
    sliderController.resizeSliderImages,
    sliderController.updateSlider
  );

module.exports = router;
