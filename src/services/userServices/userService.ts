import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ✅ Lấy tất cả người dùng
export const getAllUsers = async () => {
  return axios.get(`${API_URL}/get-all-user`);
};
