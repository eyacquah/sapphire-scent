import axios from "axios";

export const createCategory = async (form) => {
  const category = {};
  category.title = form.title.value.trim();
  //   const catForm = new FormData();

  //   catForm.append("title", form.title.value.trim());
  //   console.log(catForm.get("title"));

  console.log(category);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/categories",
      data: category,
    });
    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/categories/all`;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:8000/api/v1/categories/${id}`,
    });
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/categories/all`;
    }
  } catch (err) {
    console.error(err);
  }
};
