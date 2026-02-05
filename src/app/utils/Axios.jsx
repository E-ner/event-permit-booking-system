import axios from "axios";
import { authStore } from "../../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      authStore.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
