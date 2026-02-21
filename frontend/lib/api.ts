import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur REQUEST : Ajouter le token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || Cookies.get("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur RESPONSE : Gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          // Tenter de rafraîchir le token
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newToken = res.data.access;

          // Sauvegarder le nouveau token
          localStorage.setItem("token", newToken);
          Cookies.set("token", newToken, { expires: 7 });

          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Pas de refresh token -> rediriger vers login
          throw new Error("No refresh token");
        }
      } catch (refreshError) {
        // Échec du refresh -> déconnecter l'utilisateur
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          Cookies.remove("token");
          
          // Ne rediriger que si on n'est pas déjà sur login/register
          if (!window.location.pathname.includes("/login") && 
              !window.location.pathname.includes("/register")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;