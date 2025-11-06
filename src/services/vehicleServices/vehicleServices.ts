//src/services/vehicleServices/vehicleServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// lấy tất cả xe
const getAllVehicles = () => {
  return axios.get(`${API_URL}/vehicles`);
};

// lấy xe theo id
const getVehicleById = (id: number | string) => {
  return axios.get(`${API_URL}/vehicles/${id}`);
};

// tạo xe mới
const createVehicle = (data: any) => {
  return axios.post(`${API_URL}/vehicles`, data);
};

// cập nhật xe
const updateVehicle = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/vehicles/${id}`, data);
};

// xóa xe
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
