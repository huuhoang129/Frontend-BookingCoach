// src/services/userServices/accountServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== ACCOUNT ====================

// Lấy toàn bộ tài khoản
const getAllAccounts = () => {
  return axios.get(`${API_URL}/get-all-accounts`);
};

// Khóa tài khoản
const lockAccount = (id: number) => {
  return axios.put(`${API_URL}/lock-account`, { id });
};

// Mở khóa tài khoản
const unlockAccount = (id: number) => {
  return axios.put(`${API_URL}/unlock-account`, { id });
};

export { getAllAccounts, lockAccount, unlockAccount };
