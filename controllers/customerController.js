const Customer = require("../models/customerModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getOrCreateCustomer = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  let customer = await Customer.find({ email: email });

  customer =
    customer.length > 0 ? customer[0] : await Customer.create(req.body);

  res.status(200).json({
    status: "success",
    data: customer,
  });
});

exports.createCustomer = factory.createOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.getAllCustomers = factory.getAll(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
