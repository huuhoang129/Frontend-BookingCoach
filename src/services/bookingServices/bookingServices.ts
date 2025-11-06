import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ==================== BOOKINGS ====================

//  Lấy toàn bộ đơn đặt vé
const getAllBookings = () => {
  return axios.get(`${API_URL}/bookings`);
};

//  Lấy chi tiết đơn đặt vé theo ID
const getBookingById = (id: number | string) => {
  return axios.get(`${API_URL}/bookings/${id}`);
};

//  Tạo đơn đặt vé mới
const createBooking = (data: any) => {
  return axios.post(`${API_URL}/bookings`, data);
};

//  Cập nhật trạng thái đơn đặt vé
const updateBookingStatus = (data: any) => {
  return axios.put(`${API_URL}/bookings`, data);
};

//  Xóa đơn đặt vé
const deleteBooking = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/${id}`);
};

// ==================== BOOKING CUSTOMERS ====================

//  Lấy danh sách khách hàng trong một booking
const getCustomersByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/${bookingId}/customers`);
};

//  Thêm khách hàng vào booking
const addCustomer = (data: any) => {
  return axios.post(`${API_URL}/bookings/customers`, data);
};

//  Cập nhật thông tin khách hàng
const updateCustomer = (data: any) => {
  return axios.put(`${API_URL}/bookings/customers`, data);
};

//  Xóa khách hàng khỏi booking
const deleteCustomer = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/customers/${id}`);
};

// ==================== BOOKING POINTS ====================

//  Lấy danh sách điểm đón/trả theo booking
const getPointsByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/${bookingId}/points`);
};

//  Thêm điểm đón/trả
const addPoint = (data: any) => {
  return axios.post(`${API_URL}/bookings/points`, data);
};

//  Cập nhật điểm đón/trả
const updatePoint = (data: any) => {
  return axios.put(`${API_URL}/bookings/points`, data);
};

//  Xóa điểm đón/trả
const deletePoint = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/points/${id}`);
};

// ==================== BOOKING SEATS ====================

//  Lấy danh sách ghế theo booking
const getSeatsByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/${bookingId}/seats`);
};

//  Thêm ghế vào booking
const addSeat = (data: any) => {
  return axios.post(`${API_URL}/bookings/seats`, data);
};

//  Cập nhật ghế trong booking
const updateSeat = (data: any) => {
  return axios.put(`${API_URL}/bookings/seats`, data);
};

//  Xóa ghế khỏi booking
const deleteSeat = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/seats/${id}`);
};

// ==================== PAYMENTS ====================

// Tạo thanh toán mới cho booking
const createPayment = (data: any) => {
  return axios.post(`${API_URL}/bookings/payments`, data);
};

// Lấy thông tin thanh toán theo booking
const getPaymentByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/payments/${bookingId}`);
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = (data: any) => {
  return axios.put(`${API_URL}/bookings/payments/status`, data);
};

// ==================== EXPORT ====================
export {
  // bookings
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
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
