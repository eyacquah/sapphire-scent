import axios from "axios";

export const login = async (form) => {
  try {
    const email = form.email.value;
    const password = form.password.value;

    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      location.assign("/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
};
