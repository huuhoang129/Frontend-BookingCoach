// src/services/routeListServices/tripPriceServices.ts
import requestAPI from "../../api/requestAPI";

// lấy tất cả giá vé
const getAllTripPrices = () => {
  return requestAPI.get(`/trip-prices`);
};

// lấy giá vé theo id
const getTripPriceById = (id: number | string) => {
  return requestAPI.get(`/trip-prices/${id}`);
};

// tạo giá vé mới
const createTripPrice = (data: any) => {
  return requestAPI.post(`/trip-prices`, data);
};

// cập nhật giá vé
const updateTripPrice = (id: number | string, data: any) => {
  return requestAPI.put(`/trip-prices/${id}`, data);
};

// xoá giá vé
const deleteTripPrice = (id: number | string) => {
  return requestAPI.delete(`/trip-prices/${id}`);
};

export {
  getAllTripPrices,
  getTripPriceById,
  createTripPrice,
  updateTripPrice,
  deleteTripPrice,
};
