// src/services/userServices/userService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== USER ====================

// Lấy tất cả người dùng
const getAllUsers = async () => {
  return axios.get(`${API_URL}/get-all-user`);
};

// Tạo người dùng mới
const createUser = async (data: any) => {
  return axios.post(`${API_URL}/create-user`, data);
};

// Sửa thông tin người dùng
const editUser = async (data: any) => {
  return axios.put(`${API_URL}/edit-user`, data);
};

// Xoá người dùng
const deleteUser = async (id: number) => {
  return axios.delete(`${API_URL}/delete-user`, {
    data: { id },
  });
};

export { getAllUsers, createUser, editUser, deleteUser };
