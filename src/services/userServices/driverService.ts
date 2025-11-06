import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// Lấy tất cả tài xế
export const getAllDrivers = async () => {
  return axios.get(`${API_URL}/drivers`);
};

// Lấy chi tiết tài xế theo id
export const getDriverById = async (id: number) => {
  return axios.get(`${API_URL}/drivers/${id}`);
};

// Tạo tài xế mới
export const createDriver = async (data: any) => {
  return axios.post(`${API_URL}/drivers`, data);
};

// Cập nhật thông tin tài xế
export const editDriver = async (id: number, data: any) => {
  return axios.put(`${API_URL}/drivers/${id}`, data);
};

// Xoá tài xế
export const deleteDriver = async (id: number) => {
  return axios.delete(`${API_URL}/drivers/${id}`);
};
