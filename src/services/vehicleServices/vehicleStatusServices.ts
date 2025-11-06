//src/services/vehicleServices/vehicleStatusServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// Lấy danh sách tình trạng xe
const getAllVehicleStatus = () => {
  return axios.get(`${API_URL}/vehicle-status`);
};

// Lấy tình trạng xe theo id
const getVehicleStatusById = (id: number | string) => {
  return axios.get(`${API_URL}/vehicle-status/${id}`);
};

// Tạo tình trạng xe
const createOrUpdateVehicleStatus = (data: any) => {
  return axios.post(`${API_URL}/vehicle-status`, data);
};

// Xoá tình trạng xe
const deleteVehicleStatus = (id: number | string) => {
  return axios.delete(`${API_URL}/vehicle-status/${id}`);
};

export {
  getAllVehicleStatus,
  getVehicleStatusById,
  createOrUpdateVehicleStatus,
  deleteVehicleStatus,
};
