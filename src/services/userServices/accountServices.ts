// src/services/accountServices/accountService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1"; // đổi đúng port backend

// Lấy toàn bộ tài khoản
export const getAllAccounts = () => {
  return axios.get(`${API_URL}/get-all-accounts`);
};

// Khóa tài khoản
export const lockAccount = (id: number) => {
  return axios.put(`${API_URL}/lock-account`, { id });
};

// Mở khóa tài khoản
export const unlockAccount = (id: number) => {
  return axios.put(`${API_URL}/unlock-account`, { id });
};
