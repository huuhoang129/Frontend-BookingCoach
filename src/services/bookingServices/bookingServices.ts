// src/services/bookingServices/bookingServices.ts
import requestAPI from "../../api/requestAPI";

// ==================== BOOKINGS ====================

// Lấy toàn bộ đơn đặt vé
const getAllBookings = () => {
  return requestAPI.get(`/bookings`);
};

// Lấy chi tiết đơn đặt vé theo ID
const getBookingById = (id: number | string) => {
  return requestAPI.get(`/bookings/${id}`);
};

// Tạo đơn đặt vé mới
const createBooking = (data: any) => {
  return requestAPI.post(`/bookings`, data);
};

// Cập nhật trạng thái đơn đặt vé
const updateBooking = (data: any) => {
  return requestAPI.put(`/bookings`, data);
};

// Xóa đơn đặt vé
const deleteBooking = (id: number | string) => {
  return requestAPI.delete(`/bookings/${id}`);
};

// ==================== BOOKING CUSTOMERS ====================

// Lấy danh sách khách hàng trong một booking
const getCustomersByBooking = (bookingId: number | string) => {
  return requestAPI.get(`/bookings/${bookingId}/customers`);
};

// Thêm khách hàng vào booking
const addCustomer = (data: any) => {
  return requestAPI.post(`/bookings/customers`, data);
};

// Cập nhật thông tin khách hàng
const updateCustomer = (data: any) => {
  return requestAPI.put(`/bookings/customers`, data);
};

// Xóa khách hàng khỏi booking
const deleteCustomer = (id: number | string) => {
  return requestAPI.delete(`/bookings/customers/${id}`);
};

// ==================== BOOKING POINTS ====================

// Lấy danh sách điểm đón/trả theo booking
const getPointsByBooking = (bookingId: number | string) => {
  return requestAPI.get(`/bookings/${bookingId}/points`);
};

// Thêm điểm đón/trả
const addPoint = (data: any) => {
  return requestAPI.post(`/bookings/points`, data);
};

// Cập nhật điểm đón/trả
const updatePoint = (data: any) => {
  return requestAPI.put(`/bookings/points`, data);
};

// Xóa điểm đón/trả
const deletePoint = (id: number | string) => {
  return requestAPI.delete(`/bookings/points/${id}`);
};

// ==================== BOOKING SEATS ====================

// Lấy danh sách ghế theo booking
const getSeatsByBooking = (bookingId: number | string) => {
  return requestAPI.get(`/bookings/${bookingId}/seats`);
};

// Thêm ghế vào booking
const addSeat = (data: any) => {
  return requestAPI.post(`/bookings/seats`, data);
};

// Cập nhật ghế trong booking
const updateSeat = (data: any) => {
  return requestAPI.put(`/bookings/seats`, data);
};

// Xóa ghế khỏi booking
const deleteSeat = (id: number | string) => {
  return requestAPI.delete(`/bookings/seats/${id}`);
};

// ==================== PAYMENTS ====================

// Tạo thanh toán mới cho booking
const createPayment = (data: any) => {
  return requestAPI.post(`/bookings/payments`, data);
};

// Lấy thông tin thanh toán theo booking
const getPaymentByBooking = (bookingId: number | string) => {
  return requestAPI.get(`/bookings/payments/${bookingId}`);
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = (data: any) => {
  return requestAPI.put(`/bookings/payments/status`, data);
};

export {
  // bookings
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,

  // customers
  getCustomersByBooking,
  addCustomer,
  updateCustomer,
  deleteCustomer,

  // points
  getPointsByBooking,
  addPoint,
  updatePoint,
  deletePoint,

  // seats
  getSeatsByBooking,
  addSeat,
  updateSeat,
  deleteSeat,

  // payments
  createPayment,
  getPaymentByBooking,
  updatePaymentStatus,
};
