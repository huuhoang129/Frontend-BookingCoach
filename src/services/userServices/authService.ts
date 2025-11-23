// src/services/userServices/authService.ts
import requestAPI from "../../api/requestAPI";

// Đăng nhập
const login = (data: { email: string; password: string }) => {
  return requestAPI.post("/login", data);
};

// Đăng ký
const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) => {
  return requestAPI.post("/register", data);
};

// Quên mật khẩu
const forgotPassword = (email: string) => {
  return requestAPI.post("/forgot-password", { email });
};

// Đặt lại mật khẩu
const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  return requestAPI.post("/reset-password", data);
};

export { login, register, forgotPassword, resetPassword };
