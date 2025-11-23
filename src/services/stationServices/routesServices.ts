//src/services/stationServices/routesServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== ROUTE ====================

// Lấy tất cả tuyến đường
const getAllRoutes = () => {
  return axios.get(`${API_URL}/routes`);
};

// Lấy tuyến đường theo id
const getRouteById = (id: number | string) => {
  return axios.get(`${API_URL}/routes/${id}`);
};

// tạo tuyến đường mới
const createRoute = (data: {
  fromLocationId: number | string;
  toLocationId: number | string;
  imageRouteCoach?: string;
}) => {
  return axios.post(`${API_URL}/routes`, data);
};

// cập nhật tuyến đường
const updateRoute = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/routes/${id}`, data);
};

// xoá tuyến đường
const deleteRoute = (id: number | string) => {
  return axios.delete(`${API_URL}/routes/${id}`);
};

export { getAllRoutes, getRouteById, createRoute, deleteRoute, updateRoute };
