// src/services/stationServices/locationServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== PROVINCE ====================

// Lấy tất cả tỉnh/thành phố
const getAllProvinces = () => {
  return axios.get(`${API_URL}/provinces`);
};

// Lấy tỉnh/thành phố theo id
const getProvinceById = (id: number | string) => {
  return axios.get(`${API_URL}/provinces/${id}`);
};

// Tạo tỉnh/thành phố mới
const createProvince = (data: any) => {
  return axios.post(`${API_URL}/provinces`, data);
};

// Cập nhật tỉnh/thành phố
const updateProvince = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/provinces/${id}`, data);
};

// Xóa tỉnh/thành phố
const deleteProvince = (id: number | string) => {
  return axios.delete(`${API_URL}/provinces/${id}`);
};

// ==================== LOCATION ====================

// Lấy tất cả địa điểm
const getAllLocations = () => {
  return axios.get(`${API_URL}/locations`);
};

// Lấy địa điểm theo id
const getLocationById = (id: number | string) => {
  return axios.get(`${API_URL}/locations/${id}`);
};

// Tạo địa điểm mới
const createLocation = (data: any) => {
  return axios.post(`${API_URL}/locations`, data);
};

// Cập nhật địa điểm
const updateLocation = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/locations/${id}`, data);
};

// Xóa địa điểm
const deleteLocation = (id: number | string) => {
  return axios.delete(`${API_URL}/locations/${id}`);
};

// Lấy cây địa điểm
const getLocationsTree = () => {
  return axios.get(`${API_URL}/locations-tree`);
};

export {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationsTree,
};
