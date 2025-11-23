//src/services/vehicleServices/vehicleServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== VEHICLE ====================

// Lấy tất cả xe
const getAllVehicles = () => {
  return axios.get(`${API_URL}/vehicles`);
};

// Lấy xe theo id
const getVehicleById = (id: number | string) => {
  return axios.get(`${API_URL}/vehicles/${id}`);
};

// Tạo xe mới
const createVehicle = (data: any) => {
  return axios.post(`${API_URL}/vehicles`, data);
};

// Cập nhật xe
const updateVehicle = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/vehicles/${id}`, data);
};

// Xóa xe
const deleteVehicle = (id: number | string) => {
  return axios.delete(`${API_URL}/vehicles/${id}`);
};

export {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
