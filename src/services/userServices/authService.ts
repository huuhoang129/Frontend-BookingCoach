// src/services/userServices/authService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== AUTH ====================

// Đăng nhập
const login = (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, data);
};

// Đăng ký
const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) => {
  return axios.post(`${API_URL}/register`, data);
};

// Quên mật khẩu (gửi OTP)
const forgotPassword = (email: string) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

// Đặt lại mật khẩu
const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  return axios.post(`${API_URL}/reset-password`, data);
};

export { login, register, forgotPassword, resetPassword };
