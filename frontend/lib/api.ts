import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://zando-backend.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || Cookies.get("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⚠️ Si 401 et refresh possible
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // 🔥 S'il n'y a pas de refresh token
      if (!refreshToken) {
        // 👉 ON NE REDIRIGE PLUS AUTOMATIQUEMENT
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://zando-backend.onrender.com/api/token/refresh/",
          { refresh: refreshToken }
        );

        const newToken = res.data.access;

        localStorage.setItem("token", newToken);
        Cookies.set("token", newToken, { expires: 7 });

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nettoyage sans redirection forcée
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        Cookies.remove("token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;