/* eslint-disable */
import validator from "validator";
import { showAlert } from "./helper";
import { createOrder } from "./cashOnDelivery";
import { payWithPaystack } from "./paystack";

const shippingFieldForm = document.querySelector(".shipping-field-wrapper");

export const orderDetails = {
  products: [],
  customer: {
    name: "",
    email: "",
    phoneNumber: "",
    address: {
      country: "",
      region: "",
      city: "",
      streetAddress: "",
    },
  },
  shippingAddress: {
    country: "",
    region: "",
    city: "",
    streetAddress: "",
  },
  orderReciepient: {
    name: "",
    phoneNumber: "",
  },
  shippingMethod: "",
  shippingFee: 0,
  subtotal: 0,
  paymentMethod: "",
  totalAmount: 0,
  notes: [],
};

export async function getCheckoutFormData(form) {
  const name = `${form.firstName.value.trim()} ${form.lastName.value.trim()}`;
  const country = form.country.value;
  const streetAddress = `${form.address1.value.trim()} ${form.address2.value.trim()}`;
  const city = form.city.value.trim();
  const region = form.state.value;
  const zip = form.zip.value.trim();
  const phoneNumber = form.phone.value.trim();
  const email = form.email.value.trim();
  const shippingMethod = form.shippingMethod.value;
  const paymentMethod = form.paymentMethod.value;
  const orderNote = form.orderNotes.value;

  if (!validator.isMobilePhone(phoneNumber) || !validator.isEmail(email))
    return showAlert("error", "Enter a valid email address AND phone number");

  // Create customer object
  const customer = {
    name,
    email,
    phoneNumber,
    address: {
      country,
      region,
      city,
      streetAddress,
    },
  };

  const shippingAddress = {
    country,
    region,
    city,
    streetAddress,
  };
  const orderReciepient = {
    name,
    phoneNumber,
  };

  const note = {
    text: orderNote,
    by: name,
  };

  orderDetails.customer = customer;
  orderDetails.shippingAddress = shippingAddress;
  orderDetails.orderReciepient = orderReciepient;
  orderDetails.shippingMethod = shippingMethod;
  orderDetails.paymentMethod = paymentMethod;
  orderDetails.notes.push(note);

  // Check if Billing Address !== Shipping Address

  if (shippingFieldForm.classList.contains("show")) {
    // Grab all form data
    const shippingName = `${form.shippingFirstName.value.trim()} ${form.shippingLastName.value.trim()}`;
    const shippingCountry = form.shippingCountry.value;
    const shippingAddress = `${form.shippingAddress1.value.trim()} ${form.shippingAddress2.value.trim()}`;
    const shippingCity = form.shippingCity.value.trim();
    const shippingState = form.shippingState.value;
    const shippingZip = form.shippingZip.value.trim();
    const shippingPhone = form.shippingPhone.value.trim();

    if (!validator.isMobilePhone(shippingPhone))
      return showAlert("error", "Enter a valid phone number for shipping info");

    //   set shipping address to the filled address form
    const reciepientShippingAddress = {
      country: shippingCountry,
      region: shippingState,
      city: shippingCity,
      streetAddress: shippingAddress,
    };

    const reciepientDetails = {
      name: shippingName,
      phoneNumber: shippingPhone,
    };

    orderDetails.orderReciepient = reciepientDetails;
    orderDetails.shippingAddress = reciepientShippingAddress;
  }

  orderDetails.paymentMethod === "paystack"
    ? await payWithPaystack()
    : await createOrder();
}
