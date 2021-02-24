import axios from "axios";
import { async } from "regenerator-runtime";

export const updateOrder = async (form) => {
  try {
    const delivery =
      form.delStatus.selectedOptions[0].value === "delivered" ? true : false;
    const payment =
      form.payStatus.selectedOptions[0].value === "paid" ? true : false;

    const data = {
      paid: payment,
      delivered: delivery,
    };

    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8000/api/v1/orders/${form.dataset.id}`,
      data,
    });

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/orders/all`;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteOrder = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:8000/api/v1/orders/${id}`,
    });
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/orders/all`;
    }
  } catch (err) {
    console.error(err);
  }
};
