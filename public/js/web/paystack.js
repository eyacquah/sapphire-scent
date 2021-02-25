/* eslint-disable */

import { orderDetails } from "./order";
import { createOrder } from "./cashOnDelivery";
import axios from "axios";

let ref;
const paystackPublic = "pk_test_23c82fb58c925434b6231b6534a9a49954808378";

const paymentComplete = async () => {
  const res = await axios.get(`/api/v1/payments/${ref}`);
  // Do some webhook stuff
  // Create order
  // Redirect to order complete page of created order

  // return;
  if (res.data.status === "success") {
    await createOrder(true);
  }
};

const paymentCancelled = () => {
  window.location.href = `${window.location.origin}/checkout`;
};

const generateRef = async (name) => {
  const res = await axios.get(`/api/v1/payments/create-ref/${name}`);

  return res.data;
};

export const payWithPaystack = async () => {
  // Generate Payment Reference
  const res = await generateRef(orderDetails.customer.name);
  ref = res.data;

  const handler = PaystackPop.setup({
    key: paystackPublic,
    email: orderDetails.customer.email,
    amount: orderDetails.totalAmount * 100,
    currency: "GHS",
    ref: ref,
    callback: paymentComplete,
    onClose: paymentCancelled,
  });

  handler.openIframe();
};
