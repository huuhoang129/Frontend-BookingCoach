// src/services/paymentServices/paymentService.ts
import requestAPI from "../../api/requestAPI";

// Tạo mã QR thanh toán
const createPaymentQR = (data: any) => {
  return requestAPI.post(`/payments/create-banking-qr`, data);
};

// Tạo thanh toán cho đơn đặt vé
const createPayment = (data: any) => {
  return requestAPI.post(`/bookings/payments`, data);
};

export { createPaymentQR, createPayment };
