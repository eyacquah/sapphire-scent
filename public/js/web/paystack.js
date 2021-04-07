/* eslint-disable */

import { orderDetails } from "./order";
import { createOrder } from "./cashOnDelivery";
import { cart } from "./cart";
import { helperCart } from "./index";
import { showAlert } from "./helper";

import axios from "axios";

let ref;
const paystackPublic = "pk_test_23c82fb58c925434b6231b6534a9a49954808378";

// const

const paymentComplete = async () => {
  const res = await axios.get(`/api/v1/orders/${ref}`);
  // Do some webhook stuff
  // Create order
  // Redirect to order complete page of created order

  // console.log(res.data);
  if (res.data.status === "success") {
    cart.items.splice(0, cart.items.length);
    helperCart();

    showAlert("success", "Order Recieved");
    window.location.href = `${window.location.origin}`;
  }
};

const paymentCancelled = () => {
  window.location.href = `${window.location.origin}/checkout`;
};

const generateRef = async (name) => {
  const res = await axios.get(`/api/v1/orders/create-ref/${name}`);

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
    metadata: orderDetails,
    callback: paymentComplete,
    onClose: paymentCancelled,
  });

  handler.openIframe();
};
