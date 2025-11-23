//src/services/routeListServices/tripPriceServices.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== TRIP PRICE ====================

// lấy tất cả giá vé
const getAllTripPrices = () => {
  return axios.get(`${API_URL}/trip-prices`);
};

// lấy giá vé theo id
const getTripPriceById = (id: number | string) => {
  return axios.get(`${API_URL}/trip-prices/${id}`);
};

// tạo giá vé mới
const createTripPrice = (data: any) => {
  return axios.post(`${API_URL}/trip-prices`, data);
};

// cập nhật giá vé
const updateTripPrice = (id: number | string, data: any) => {
  return axios.put(`${API_URL}/trip-prices/${id}`, data);
};

// xoá giá vé
const deleteTripPrice = (id: number | string) => {
  return axios.delete(`${API_URL}/trip-prices/${id}`);
};

export {
  getAllTripPrices,
  getTripPriceById,
  createTripPrice,
  updateTripPrice,
  deleteTripPrice,
};
