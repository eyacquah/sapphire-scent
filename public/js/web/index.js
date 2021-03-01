import regeneratorRuntime from "regenerator-runtime";

import {
  setItemQuantity,
  getProduct,
  renderCartItems,
  cart,
  renderCartCheckout,
} from "./cart";
import { handleSearchForm } from "./search";

import { getCheckoutFormData, orderDetails } from "./order";

const cartBtns = document.querySelectorAll(".addToCart");
const cartQty = document.querySelector(".cart-qty");
const cartTotal = document.querySelector(".cart--total");
const cartForm = document.querySelector(".cart-form");
const searchForm = document.querySelector(".searchForm");
const cartItemCheckout = document.querySelector(".insertCartItems");
const orderTotalEl = document.querySelector(".orderTotal");
const shippingMethodBtns = document.querySelectorAll(".shippingMethod");
const checkoutForm = document.querySelector(".checkoutForm");

const addListeners = () => {
  const removeItemBtns = document.querySelectorAll(".remove-item");
  removeItemBtns.forEach((el) =>
    el.addEventListener("click", handleRemoveCartItem)
  );
};

const persistCart = () => {
  localStorage.setItem("items", JSON.stringify(cart.items));
};

export async function helperCart(pass = true, id, qty) {
  if (!pass) {
    const item = await getProduct(id);
    setItemQuantity(item, qty);
  }
  renderCartItems(cart.items);
  cartQty.textContent = cart.totalItemQty;
  cartTotal.textContent = `GHS ${cart.subtotal}`;
  addListeners();
  persistCart();
}

async function handleAddToCart(e) {
  e.preventDefault();
  await helperCart(false, this.dataset.id);
}

function handleRemoveCartItem() {
  const clickedProduct = cart.items.find(
    (product) => product.id === this.dataset.id
  );
  cart.items.pop(clickedProduct);
  helperCart(true);
}

async function handleCartForm(e) {
  e.preventDefault();
  const itemQty = +document.getElementById("itemQty").value;
  await helperCart(false, this.dataset.id, itemQty);
}

function displayOrderTotal(e) {
  const shippingFee = +e.target.dataset.shippingRate;
  orderDetails.shippingFee = shippingFee;
  orderDetails.totalAmount = cart.subtotal + shippingFee;
  orderTotalEl.textContent = `GHS ${orderDetails.totalAmount}`;
}

async function handleCheckout(e) {
  e.preventDefault();

  await getCheckoutFormData(this);
}

const init = () => {
  const storage = localStorage.getItem("items");
  if (storage) {
    cart.items = JSON.parse(storage);
    renderCartItems(cart.items);
    cartQty.textContent = cart.totalItemQty;
    cartTotal.textContent = `GHS ${cart.subtotal}`;
    addListeners();
  } else {
    helperCart();
  }
};

// localStorage.clear("items");
init();
if (cartBtns)
  cartBtns.forEach((el) => el.addEventListener("click", handleAddToCart));

if (cartItemCheckout) renderCartCheckout();

////

////////////////////////

if (searchForm) searchForm.addEventListener("submit", handleSearchForm);

if (cartForm) cartForm.addEventListener("submit", handleCartForm);

if (shippingMethodBtns) {
  shippingMethodBtns.forEach((btn) =>
    btn.addEventListener("click", displayOrderTotal)
  );
}

if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckout);
