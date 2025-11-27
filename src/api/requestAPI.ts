// src/api/requestAPI.ts
import axios from "axios";

const requestAPI = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Gắn Token
requestAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Token hết hạn tự động out
requestAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default requestAPI;
