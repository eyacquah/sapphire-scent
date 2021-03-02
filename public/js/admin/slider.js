import axios from "axios";

export const updateSlider = async (form) => {
  //   console.log(form.dataset.id);
  const sliderForm = new FormData();

  const images = document.getElementById("slides")?.files;

  if (images.length === 0) return;

  for (let i = 0; i < images.length; i++) {
    sliderForm.append("images", images[i]);
  }

  return await updateImages(sliderForm, form.dataset.id);
};

const updateImages = async (data, id) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/sliders/${id}`,
      data,
    });

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}`;
    }
  } catch (err) {
    console.error(err);
  }
};
