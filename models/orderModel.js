const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      type: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "An order must have at least one product"],
      },
      orderQuantity: Number,
      price: Number,
    },
  ],
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: [true, "An order must belong to a customer"],
  },
  totalAmount: {
    type: Number,
    required: [true, "An order must have a total amount"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  orderReciepient: {
    name: String,
    phoneNumber: String,
  },
  shippingAddress: {
    country: String,
    region: String,
    city: String,
    streetAddress: String,
  },
  shippingMethod: String,
  shippingFee: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    default: this.totalAmount - this.shippingFee,
  },
  paymentMethod: String,
  notes: [
    {
      text: String,
      by: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

orderSchema.pre(/^find/, function (next) {
  this.populate("customer").populate({
    path: "products.type",
    select: "title price priceDiscount",
  });
  next();
});

orderSchema.pre("save", function (next) {
  // Create Order Number
  let id = this._id;
  id = `${id}`;

  this.orderNum = `GH-${id.slice(-5).toUpperCase()}`;

  // Create Human Readable Date
  const date = new Date(Date.parse(this.createdAt));
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  this.date = date.toLocaleString("en-GB", options);

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
