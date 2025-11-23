// src/services/vehicleServices/vehicleServices.ts
import requestAPI from "../../api/requestAPI";

// Lấy tất cả xe
const getAllVehicles = () => {
  return requestAPI.get(`/vehicles`);
};

// Lấy xe theo id
const getVehicleById = (id: number | string) => {
  return requestAPI.get(`/vehicles/${id}`);
};

// Tạo xe mới
const createVehicle = (data: any) => {
  return requestAPI.post(`/vehicles`, data);
};

// Cập nhật xe
const updateVehicle = (id: number | string, data: any) => {
  return requestAPI.put(`/vehicles/${id}`, data);
};

// Xóa xe
const deleteVehicle = (id: number | string) => {
  return requestAPI.delete(`/vehicles/${id}`);
};

export {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
