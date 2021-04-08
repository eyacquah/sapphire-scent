/* eslint-disable */
import axios from "axios";
import { orderDetails } from "./order";

const cartItemEl = document.querySelector(".mini-products-list");
const cartItemCheckout = document.querySelector(".insertCartItems");
const cartCheckoutSubtotal = document.querySelector(".cartSubtotal");
const orderTotalEl = document.querySelector(".orderTotal");
const deliveryFee = document.querySelector(".deliveryFee");

const s3ImageURL = "https://sapphire-scent-bucket.s3.us-west-2.amazonaws.com";

// export let cartItems = [];

export const cart = {
  items: [],
  totalItemQty: 0,
  subtotal: 0,
};

export const getProduct = async (id) => {
  try {
    const res = await axios.get(`/api/v1/products/${id}`);

    if (res.data.status === "success") {
      return res.data.data.doc;
    }
  } catch (err) {
    console.error(err);
  }
};

export const setCartTotals = (item) => {
  cart.subtotal += item.priceDiscount
    ? item.priceDiscount * item.quantity
    : item.price * item.quantity;
  cart.totalItemQty += item.quantity;
};

export const renderCartItems = (arr) => {
  cartItemEl.innerHTML = "";
  cart.subtotal = 0;
  cart.totalItemQty = 0;

  arr.forEach((product) => {
    setCartTotals(product);
    const cartItemHTML = `
  <li class="item">
						<a href="/products/${product.slug}" title="${
      product.title
    }" class="product-image"><img src="${s3ImageURL}/${
      product.images[0]
    }" alt="${product.title}"></a>
						<div class="product-details">
                            <p class="product-name">
                                <a href="/products/${product.slug}">${
      product.title
    }</a>
                            </p>
                            <p class="qty-price">
                                    ${
                                      product.quantity
                                    }X <span class="price"> GHS ${
      product.priceDiscount ? product.priceDiscount : product.price
    }</span>
                            </p>
                            <a href="#" title="Remove This Item" class="btn-remove remove-item" data-id=${
                              product.id
                            }><i class="fas fa-times"></i></a>
						</div>
					</li>`;

    cartItemEl.insertAdjacentHTML("beforeend", cartItemHTML);
  });
};

export const setItemQuantity = (item, qty) => {
  const cartItem = cart.items.find((el) => el.id === item.id);
  if (!cartItem) {
    item.quantity = qty || 1;
    cart.items.push(item);
    return;
  }

  //   If item is already in the cart, update quantity
  cartItem.quantity += qty || 1;
};

export const renderCartCheckout = () => {
  cart.items.forEach((item) => {
    // Render
    const itemHtml = `<tr>
													<td>
														<strong class="d-block text-color-dark line-height-1 font-weight-semibold">${
                              item.title
                            } <span class="product-qty"> x${
      item.quantity
    }</span></strong>
													</td>
													<td class="text-right align-top">
														<span class="amount font-weight-medium text-color-grey">GHS ${
                              item.priceDiscount || item.price
                            }</span>
													</td>
												</tr>`;

    cartItemCheckout.insertAdjacentHTML("afterend", itemHtml);

    //  Add to order products
    const product = {
      type: item._id,
      orderQuantity: item.quantity,
      price: item.priceDiscount || item.price,
    };
    orderDetails.products.push(product);
  });
  cartCheckoutSubtotal.textContent = `GHS ${cart.subtotal}`;

  orderDetails.totalAmount = deliveryFee.checked
    ? +deliveryFee.dataset.shippingRate + cart.subtotal
    : cart.subtotal;

  orderDetails.shippingFee = +deliveryFee.dataset.shippingRate;
  orderDetails.subtotal = cart.subtotal;
  orderTotalEl.textContent = `GHS ${orderDetails.totalAmount}`;
};
