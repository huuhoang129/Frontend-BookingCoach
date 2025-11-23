// src/services/paymentServices/paymentService.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

// ==================== PAYMENTS ====================

// Tạo mã QR thanh toán
const createPaymentQR = (data: any) => {
  return axios.post(`${BASE_URL}/payments/create-banking-qr`, data);
};

// Tạo thanh toán cho đơn đặt vé
const createPayment = (data: any) => {
  return axios.post(`${BASE_URL}/bookings/payments`, data);
};

export { createPaymentQR, createPayment };
