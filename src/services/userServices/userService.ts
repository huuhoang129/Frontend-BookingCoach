import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ✅ Lấy tất cả người dùng
export const getAllUsers = async () => {
  return axios.get(`${API_URL}/get-all-user`);
};

export const createUser = async (data: any) => {
  return axios.post(`${API_URL}/create-user`, data);
};

// ✅ Sửa thông tin người dùng
export const editUser = async (data: any) => {
  return axios.put(`${API_URL}/edit-user`, data);
};

// ✅ Xoá người dùng
export const deleteUser = async (id: number) => {
  return axios.delete(`${API_URL}/delete-user`, {
    data: { id },
  });
};
