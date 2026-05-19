import axios from "axios";

// ================= API INSTANCE =================

const API = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL,

});

// ================= REQUEST INTERCEPTOR =================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);

// ================= RESPONSE INTERCEPTOR =================

API.interceptors.response.use(

  (response) => response,

  (error) => {

    // ================= TOKEN EXPIRED =================

    if (

      error.response?.status === 401 ||

      error.response?.data?.message ===
        "Token is invalid or expired"

    ) {

      // ✅ SAFE LOGOUT

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      localStorage.removeItem("role");

      // ✅ REDIRECT TO LOGIN

      window.location.href = "/login";

    }

    return Promise.reject(error);

  }

);

console.log(
  "API URL =",
  import.meta.env.VITE_API_URL
);

export default API;