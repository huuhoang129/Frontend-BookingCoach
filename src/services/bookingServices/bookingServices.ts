import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

// ---------- BOOKINGS ----------
const getAllBookings = () => {
  return axios.get(`${API_URL}/bookings`);
};

const getBookingById = (id: number | string) => {
  return axios.get(`${API_URL}/bookings/${id}`);
};

const createBooking = (data: any) => {
  return axios.post(`${API_URL}/bookings`, data);
};

const updateBookingStatus = (data: any) => {
  return axios.put(`${API_URL}/bookings`, data);
};

const deleteBooking = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/${id}`);
};

// ---------- BOOKING CUSTOMERS ----------
const getCustomersByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/${bookingId}/customers`);
};

const addCustomer = (data: any) => {
  return axios.post(`${API_URL}/bookings/customers`, data);
};

const updateCustomer = (data: any) => {
  return axios.put(`${API_URL}/bookings/customers`, data);
};

const deleteCustomer = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/customers/${id}`);
};

// ---------- BOOKING POINTS ----------
const getPointsByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/${bookingId}/points`);
};

const addPoint = (data: any) => {
  return axios.post(`${API_URL}/bookings/points`, data);
};

const updatePoint = (data: any) => {
  return axios.put(`${API_URL}/bookings/points`, data);
};

const deletePoint = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/points/${id}`);
};

// ---------- BOOKING SEATS ----------
const getSeatsByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/${bookingId}/seats`);
};

const addSeat = (data: any) => {
  return axios.post(`${API_URL}/bookings/seats`, data);
};

const updateSeat = (data: any) => {
  return axios.put(`${API_URL}/bookings/seats`, data);
};

const deleteSeat = (id: number | string) => {
  return axios.delete(`${API_URL}/bookings/seats/${id}`);
};

// ---------- PAYMENTS ----------
const createPayment = (data: any) => {
  return axios.post(`${API_URL}/bookings/payments`, data);
};

const getPaymentByBooking = (bookingId: number | string) => {
  return axios.get(`${API_URL}/bookings/payments/${bookingId}`);
};

const updatePaymentStatus = (data: any) => {
  return axios.put(`${API_URL}/bookings/payments/status`, data);
};

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
