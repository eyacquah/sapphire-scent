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

  if (!images && productId) {
    return await updateProduct(productForm, productId);
  }
  for (let i = 0; i < images.length; i++) {
    productForm.append("images", images[i]);
  }

  if (images && productId) return await updateProduct(productForm, productId);

  await createProduct(productForm);
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
