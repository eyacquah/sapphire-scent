import axios from "axios";
import { async } from "regenerator-runtime";
import { cart } from "./cart";
import { helperCart } from "./index";

import { orderDetails } from "./order";

// 1. Get order info
// 2. Get or Create customer
// 3. Create Order

export const getOrCreateCustomer = async () => {
  try {
    // /get-or-create
    const { customer } = orderDetails;
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:8000/api/v1/customers/get-or-create`,
      data: customer,
    });

    if (res.data.status === "success") {
      return res.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const createOrder = async (payStatus) => {
  try {
    const customer = await getOrCreateCustomer();

    orderDetails.customer = customer._id;
    orderDetails.paid = payStatus || false;

    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/orders",
      data: orderDetails,
    });

    // console.log(res.data.data);
    if (res.data.status === "success") {
      // cart.items.length = 0;
      cart.items.splice(0, cart.items.length);
      helperCart();
      window.location.href = `${window.location.origin}/orders/${res.data.data._id}`;
    }
  } catch (err) {
    console.error(err);
  }
};
