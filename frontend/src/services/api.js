import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://skill-bridge-0y3s.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err.response?.data?.message || "API error");
    return Promise.reject(err);
  }
);

export default api;