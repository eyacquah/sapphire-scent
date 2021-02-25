// 1. Get form data

import axios from "axios";

export const createOrUpdateProduct = async (form) => {
  const productId = form.dataset.id;

  const productForm = new FormData();

  const visibility =
    form.visibility.selectedOptions[0].dataset.bool === "yes" ? true : false;

  productForm.append("title", form.title.value);
  productForm.append("description", form.description.value);
  productForm.append("price", form.price.value);
  productForm.append("priceDiscount", form.priceDiscount.value);
  productForm.append("category", form.categories.selectedOptions[0].dataset.id);
  productForm.append("isVisible", visibility);

  // return;
  const images = document.getElementById("images")?.files;

  // images.length === 0
  //   ?
  //   : console.log("Updating with images...");

  // if (productId) {
  //   console.log("Updating with images and product");
  // }

  // console.log(productId);

  // return;
  // iF NO IMAGES, UPdate Without Images
  if (images.length === 0) {
    return await updateProduct(productForm, productId);
  }
  if (images.length === 0) {
    return console.log("Updating without images.. SHOULD NOT RUN!");
  }

  for (let i = 0; i < images.length; i++) {
    productForm.append("images", images[i]);
  }

  console.log(images.length);

  if (productId) return await updateProduct(productForm, productId);
  if (productId) return console.log("UPDATAING with images.. SHOULD NOT RUN");

  await createProduct(productForm);
  console.log("CREATING a new product..SHOULD NOT RUN");
};

const updateProduct = async (data, id) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/products/${id}`,
      data,
    });

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/products/update/${res.data.data.slug}`;
    }
  } catch (err) {
    console.error(err);
  }
};

const createProduct = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/products",
      data,
    });

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/products/all`;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/products/${id}`,
    });
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/products/all`;
    }
  } catch (err) {
    console.error(err);
  }
};
