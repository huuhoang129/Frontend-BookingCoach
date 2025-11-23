// src/services/userServices/driverService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== DRIVER ====================

// Lấy tất cả tài xế
const getAllDrivers = async () => {
  return axios.get(`${API_URL}/drivers`);
};

// Lấy chi tiết tài xế theo id
const getDriverById = async (id: number) => {
  return axios.get(`${API_URL}/drivers/${id}`);
};

// Tạo tài xế mới
const createDriver = async (data: any) => {
  return axios.post(`${API_URL}/drivers`, data);
};

// Cập nhật thông tin tài xế
const editDriver = async (id: number, data: any) => {
  return axios.put(`${API_URL}/drivers/${id}`, data);
};

// Xoá tài xế
const deleteDriver = async (id: number) => {
  return axios.delete(`${API_URL}/drivers/${id}`);
};

export { getAllDrivers, getDriverById, createDriver, editDriver, deleteDriver };
