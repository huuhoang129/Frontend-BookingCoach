// src/services/routeListServices/tripListServices.ts
import requestAPI from "../../api/requestAPI";

// Lấy tất cả chuyến
const getAllTrips = () => {
  return requestAPI.get(`/trips`);
};

// Lấy chuyến theo id
const getTripById = (id: number | string) => {
  return requestAPI.get(`/trips/${id}`);
};

// Tạo chuyến mới
const createTrip = (data: any) => {
  return requestAPI.post(`/trips`, data);
};

// Cập nhật chuyến
const updateTrip = (id: number | string, data: any) => {
  return requestAPI.put(`/trips/${id}`, data);
};

// Xóa chuyến
const deleteTrip = (id: number | string) => {
  return requestAPI.delete(`/trips/${id}`);
};

// Tìm kiếm chuyến
const searchTrips = (params: {
  fromLocationId?: number | string;
  toLocationId?: number | string;
  startDate: string;
  endDate?: string;
}) => {
  return requestAPI.get(`/search-trips`, { params });
};

export {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  searchTrips,
};
