const crypto = require("crypto");
const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const secret = process.env.PAYSTACK_SECRET_KEY;

const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");

const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);

let count = Math.random() * 100;

const getOrCreateCustomer = async (data) => {
  let customer = await Customer.find({ email: data.email });
  customer = customer.length > 0 ? customer[0] : await Customer.create(data);

  return customer;
};

const createOrder = async (data, payStatus) => {
  const customer = await getOrCreateCustomer(data.customer);

  data.customer = customer._id;
  data.paid = payStatus || false;

  const order = await Order.create(data);

  return order;
};

exports.handleCashOnDelivery = catchAsync(async (req, res, next) => {
  const order = await createOrder(req.body);

  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.generatePaystackREF = catchAsync(async (req, res, next) => {
  const ref = `customer-${req.params.name.split(" ")[0]}-${count}`;
  count += 1;

  res.status(200).json({
    status: "success",
    data: ref,
  });
});

exports.verifyPaystackTransaction = catchAsync(async (req, res, next) => {
  const verification = await paystack.transaction.verify(req.params.ref);

  if (!verification.status) return;

  // const order = await createOrder(verification.data.metadata, true);

  res.status(200).json({
    status: "success",
    // data: order,
  });
});

exports.handleChargeSuccess = catchAsync(async (req, res, next) => {
  // Validate the event
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    const event = req.body;

    if (event.event === "charge.success")
      await createOrder(event.data.metadata, true);
  }

  res.send(200);
});
