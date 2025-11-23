// src/services/stationServices/routesServices.ts
import requestAPI from "../../api/requestAPI";

// Lấy tất cả tuyến đường
const getAllRoutes = () => {
  return requestAPI.get(`/routes`);
};

// Lấy tuyến đường theo id
const getRouteById = (id: number | string) => {
  return requestAPI.get(`/routes/${id}`);
};

// Tạo tuyến đường mới
const createRoute = (data: {
  fromLocationId: number | string;
  toLocationId: number | string;
  imageRouteCoach?: string;
}) => {
  return requestAPI.post(`/routes`, data);
};

// Cập nhật tuyến đường
const updateRoute = (id: number | string, data: any) => {
  return requestAPI.put(`/routes/${id}`, data);
};

// Xoá tuyến đường
const deleteRoute = (id: number | string) => {
  return requestAPI.delete(`/routes/${id}`);
};

export { getAllRoutes, getRouteById, createRoute, deleteRoute, updateRoute };
