import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ---------- TRIPS ----------

// Lấy tất cả chuyến
const getAllTrips = () => {
  return axios.get(`${API_URL}/trips`);
};

// Lấy chuyến theo id
const getTripById = (id: number | string) => {
  return axios.get(`${API_URL}/trips/${id}`);
};

// Tạo chuyến mới
const createTrip = (data: any) => {
  return axios.post(`${API_URL}/trips`, data);
};

// Cập nhật chuyến
const updateTrip = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/trips/${id}`, data);
};

// Xóa chuyến
const deleteTrip = (id: number | string) => {
  return axios.delete(`${API_URL}/trips/${id}`);
};

// Search chuyến theo route + ngày
const searchTrips = (params: {
  fromLocationId?: number | string;
  toLocationId?: number | string;
  startDate: string;
  endDate?: string; // 👈 thêm endDate
}) => {
  return axios.get(`${API_URL}/search-trips`, { params });
};

export {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  searchTrips,
};
