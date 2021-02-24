const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);
// const Payment = require("../models/paymentModel");
const catchAsync = require("../utils/catchAsync");

let count = Math.random() * 100;

exports.generatePaystackREF = catchAsync(async (req, res, next) => {
  const ref = `customer-${req.params.name.split(" ")[0]}-${count}`;
  count += 1;

  res.status(200).json({
    status: "success",
    data: ref,
  });
});

exports.getRefDoc = catchAsync(async (req, res, next) => {
  const verification = await paystack.transaction.verify(req.params.ref);

  res.status(200).json({
    status: "success",
    data: {
      verification,
    },
  });
});
