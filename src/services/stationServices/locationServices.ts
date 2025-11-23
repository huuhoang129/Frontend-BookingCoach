// src/services/stationServices/locationServices.ts
import requestAPI from "../../api/requestAPI";

// ==================== PROVINCE ====================

// Lấy tất cả tỉnh/thành phố
const getAllProvinces = () => {
  return requestAPI.get(`/provinces`);
};

// Lấy tỉnh/thành phố theo id
const getProvinceById = (id: number | string) => {
  return requestAPI.get(`/provinces/${id}`);
};

// Tạo tỉnh/thành phố mới
const createProvince = (data: any) => {
  return requestAPI.post(`/provinces`, data);
};

// Cập nhật tỉnh/thành phố
const updateProvince = (id: number | string, data: any) => {
  return requestAPI.put(`/provinces/${id}`, data);
};

// Xóa tỉnh/thành phố
const deleteProvince = (id: number | string) => {
  return requestAPI.delete(`/provinces/${id}`);
};

// ==================== LOCATION ====================

// Lấy tất cả địa điểm
const getAllLocations = () => {
  return requestAPI.get(`/locations`);
};

// Lấy địa điểm theo id
const getLocationById = (id: number | string) => {
  return requestAPI.get(`/locations/${id}`);
};

// Tạo địa điểm mới
const createLocation = (data: any) => {
  return requestAPI.post(`/locations`, data);
};

// Cập nhật địa điểm
const updateLocation = (id: number | string, data: any) => {
  return requestAPI.put(`/locations/${id}`, data);
};

// Xóa địa điểm
const deleteLocation = (id: number | string) => {
  return requestAPI.delete(`/locations/${id}`);
};

// Lấy cây địa điểm
const getLocationsTree = () => {
  return requestAPI.get(`/locations-tree`);
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
