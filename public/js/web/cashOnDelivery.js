import axios from "axios";
import { async } from "regenerator-runtime";
import { cart } from "./cart";
import { helperCart } from "./index";

import { orderDetails } from "./order";

export const createOrder = async () => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/orders",
      data: orderDetails,
    });

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
