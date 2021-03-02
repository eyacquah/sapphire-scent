const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  images: [String],
});

const Slider = mongoose.model("Slider", sliderSchema);

module.exports = Slider;
